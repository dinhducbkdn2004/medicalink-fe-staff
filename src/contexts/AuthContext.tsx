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
					localStorage.removeItem("user");
				}
			}

			try {
				const response =
					await api.get<ApiResponse<StaffAccount>>("/auth/profile");
				const freshUser = response.data.data;

				localStorage.setItem("user", JSON.stringify(freshUser));
				setState({
					user: freshUser,
					token,
					isLoading: false,
					isAuthenticated: true,
				});
			} catch (apiError) {
				if (cachedUser) {
					console.warn(
						"API /auth/profile not available, using cached user data"
					);
				} else {
					throw apiError;
				}
			}
		} catch (error) {
			console.error("Auth check failed:", error);
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
			await api.post("/auth/logout");
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
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
