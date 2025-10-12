import { useMutation } from "@tanstack/react-query"

import request from "@/shared/constant/request"

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
