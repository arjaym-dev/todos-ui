import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { TPermission, TRole, TRolesRow } from "@/shared/types/roles"

import request from "@/shared/constant/request"
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

export const requestGetRoles = (roleId: string, token: string) => {
	return useQuery({
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
		queryKey: ["get-roles"],
		queryFn: async () => {
			const response = await request.get(`/roles?roleId=${roleId}`, {
				token: token,
			})

			const data = response.data

			const formattedRows = [...formatRows(data)]
			const duplicateRows = [...formatRows(data)]

			return {
				rows: formattedRows,
				roles: data.roles,
				permissions: data.permissions,
				duplicateRows: duplicateRows,
			}
		},
	})
}

export const requestEditRoles = (token: string) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ["edit-roles"],
		mutationFn: async (payload: TRole[]) => {
			const response = await request.put(
				`/roles`,
				{ roles: payload },
				{ token },
			)

			if (response.status === 200) {
				return response.data
			} else {
				return []
			}
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(["get-roles"], (prevRoles: any) => {
				const formattedRows = formatRows({
					roles: variables,
					permissions: prevRoles.permissions,
				})

				return { ...prevRoles, rows: formattedRows, roles: variables }
			})
		},
	})
}
