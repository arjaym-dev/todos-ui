import { useQuery, useMutation } from "@tanstack/react-query"

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

			return await response.json()
		},
	})
}
