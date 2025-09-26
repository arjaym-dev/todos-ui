import { useQueryClient } from "@tanstack/react-query"

export const useQueriesData = (key: string[] | string) => {
	const queryClient = useQueryClient().getQueriesData({ queryKey: key })

	return queryClient
}
