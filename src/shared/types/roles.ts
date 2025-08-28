export type TPermission = { _id: string; name: string }

export type TRole = {
	permissions: string[]
	roleId: "ADMIN" | "MEMBER" | string
	roleName: string
	_id: string
}

export type TRolesRow = {
	id: string
	permissionName: string
	permissions: string[]
	roleIdAdmin: string
	roleIdMember: string
}
