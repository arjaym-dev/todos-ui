import { useQuery, useMutation } from "@tanstack/react-query"

import request from "@/shared/constant/request"

export const requestGetNavlinks = (token: string) => {
	return useQuery({
		enabled: token.length > 0,
		retry: false,
		refetchOnWindowFocus: false,
		queryKey: ["get-navlinks", token],
		queryFn: async () => {
			const response = await request.get(`/navlinks`, { token })

			return response.data
		},
	})
}

export const requestDeleteLogout = (
	props: { onSuccess: () => void },
	token: string,
) => {
	return useMutation({
		retry: false,
		mutationKey: ["logout"],
		mutationFn: async () => {
			await request.delete("/logout", {}, { token })
		},
		onSuccess: () => {
			if (props.onSuccess) props.onSuccess()
		},
	})
}
