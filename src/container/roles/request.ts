import { useQuery, useMutation } from "@tanstack/react-query"

import { TPermission, TRole, TRolesRow } from "@/shared/types/roles"

const formatRows = (data: {
	permissions: TPermission[]
	roles: TRole[]
}): TRolesRow[] => {
	const { permissions, roles } = data

	if (roles.length < 1) return []

	const rows: TRolesRow[] = []

	for (let p = 0; p < permissions.length; p++) {
		const permission = permissions[p]

		const row: { [key: string]: string | string[] } = {
			id: permission._id,
			permissionName: permission.name.replaceAll("_", " "),
		}

		for (let r = 0; r < roles.length; r++) {
			const role = roles[r],
				roleName = role.roleName

			const rowFieldName = `roleId${roleName}`,
				rowPermissionsFieldName = `roleId${roleName}Permissions`

			row[rowFieldName] = permission.name
			row[rowPermissionsFieldName] = role.permissions

			if (!row.permissions) {
				row.permissions = role.permissions
			}
		}

		rows.push(row as TRolesRow)
	}

	return rows
}

export const requestGetRoles = (roleId: string) => {
	return useQuery({
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
		queryKey: ["get-roles"],
		queryFn: async () => {
			const response = await fetch(
				`http://localhost:3000/api/roles?roleId=${roleId}`,
			)

			const data = await response.json()

			const formattedData = formatRows(data)

			return formattedData
		},
	})
}
