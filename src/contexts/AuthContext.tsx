/* eslint-disable unicorn/prevent-abbreviations, no-use-before-define, @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import type * as React from "react";
import api from "@/api/axios";
import type { StaffAccount, LoginResponse, ApiResponse } from "@/common/types";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface AuthState {
	user: StaffAccount | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<void>;
	checkAuth: () => Promise<void>;
	changePassword: (data: ChangePasswordRequest) => Promise<void>;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isLoading: true,
	isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	const [state, setState] = useState<AuthState>(initialState);

	// Check if user is authenticated on app start
	useEffect(() => {
		void checkAuth();
	}, []);

	const checkAuth = async (): Promise<void> => {
		setState((prev) => ({ ...prev, isLoading: true }));

		try {
			const token = localStorage.getItem("accessToken");
			const cachedUser = localStorage.getItem("user");

			if (!token) {
				setState((prev) => ({ ...prev, isLoading: false }));
				return;
			}

			// Sử dụng cached user trước (fast UX)
			if (cachedUser) {
				try {
					const user = JSON.parse(cachedUser) as StaffAccount;
					setState({
						user,
						token,
						isLoading: false,
						isAuthenticated: true,
					});
				} catch {
					// Invalid cached user data, clear it
					localStorage.removeItem("user");
				}
			}

			// Verify với server và lấy fresh data (security)
			try {
				const response =
					await api.get<ApiResponse<StaffAccount>>("/auth/profile");
				const freshUser = response.data.data;

				// Update với data mới từ server
				localStorage.setItem("user", JSON.stringify(freshUser));
				setState({
					user: freshUser,
					token,
					isLoading: false,
					isAuthenticated: true,
				});
			} catch (apiError) {
				// API /auth/profile chưa có hoặc token invalid
				if (cachedUser) {
					// Nếu có cached user, vẫn cho phép sử dụng (fallback)
					console.warn(
						"API /auth/profile not available, using cached user data"
					);
				} else {
					// Không có cached user và API fail -> logout
					throw apiError;
				}
			}
		} catch (error) {
			// Clear everything on error
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
			setState({
				user: null,
				token: null,
				isLoading: false,
				isAuthenticated: false,
			});
		}
	};

	const login = async (credentials: LoginRequest): Promise<void> => {
		setState((prev) => ({ ...prev, isLoading: true }));

		try {
			const response = await api.post<LoginResponse>(
				"/auth/login",
				credentials
			);
			const { user, token, refreshToken } = response.data.data;

			// Store tokens and user data
			localStorage.setItem("accessToken", token);
			localStorage.setItem("refreshToken", refreshToken);
			localStorage.setItem("user", JSON.stringify(user));

			setState({
				user,
				token,
				isLoading: false,
				isAuthenticated: true,
			});
		} catch (error) {
			setState((prev) => ({ ...prev, isLoading: false }));
			throw error;
		}
	};

	const refreshToken = async (): Promise<void> => {
		try {
			const storedRefreshToken = localStorage.getItem("refreshToken");
			if (!storedRefreshToken) {
				throw new Error("No refresh token available");
			}

			const response = await api.post<ApiResponse<{ token: string }>>(
				"/auth/refresh",
				{
					refreshToken: storedRefreshToken,
				}
			);

			const { token } = response.data.data;
			localStorage.setItem("accessToken", token);

			setState((prev) => ({ ...prev, token }));

			// Check auth state after token refresh
			void checkAuth();
		} catch (error) {
			void logout();
			throw error;
		}
	};

	const logout = async (): Promise<void> => {
		try {
			// Call logout API để invalidate token trên server
			await api.post("/auth/logout");
		} catch (error) {
			// Nếu API fail, vẫn logout locally
			console.warn("Logout API failed, proceeding with local logout");
		} finally {
			// Always clear local storage
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");

			setState({
				user: null,
				token: null,
				isLoading: false,
				isAuthenticated: false,
			});
		}
	};

	const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
		await api.post("/auth/change-password", data);
		// Password changed successfully, no need to update state
	};

	const value: AuthContextType = {
		...state,
		login,
		logout,
		refreshToken,
		checkAuth,
		changePassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
