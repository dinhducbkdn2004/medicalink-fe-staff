export interface Permission {
	id: string;
	resource: string;
	action: string;
	description: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PermissionStats {
	total: number;
	byResource: Record<string, number>;
	byAction: Record<string, number>;
}

export interface PermissionGroup {
	id: string;
	name: string;
	description: string;
	tenantId: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface GroupPermission {
	id: string;
	permissionId: string;
	resource: string;
	action: string;
	description: string;
	effect: "ALLOW" | "DENY";
	createdAt: string;
}

export interface CreateGroupRequest {
	name: string;
	description?: string;
}

export interface UpdateGroupRequest {
	name?: string;
	description?: string;
	isActive?: boolean;
}

export interface AssignGroupPermissionRequest {
	permissionId: string;
	effect: "ALLOW" | "DENY";
	conditions?: PermissionCondition[];
}

export interface RevokeGroupPermissionRequest {
	permissionId: string;
}

export interface PermissionCondition {
	field: string;
	operator: "eq" | "ne" | "in" | "contains";
	value: string | string[];
}

export interface AssignUserPermissionRequest {
	userId: string;
	permissionId: string;
	effect: "ALLOW" | "DENY";
	conditions?: PermissionCondition[];
}

export interface RevokeUserPermissionRequest {
	userId: string;
	permissionId: string;
}

export interface AddUserToGroupRequest {
	groupId: string;
}
