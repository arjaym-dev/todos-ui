import { useMutation } from "@tanstack/react-query"

import { TLoginUser } from "@/shared/validation/users"
import { TProfile } from "@/shared/types/profile"

export type TRequestLogin = {
	onError?: (error: Error & { [key: string]: string }) => void
	onSuccess?: (data: TProfile) => void
}

export const requestLogin = (props: TRequestLogin) => {
	return useMutation({
		retry: false,
		mutationKey: ["todos"],
		mutationFn: async (payload: TLoginUser) => {
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(payload),
			})

			const data = await res.json()

			if (!res.ok) {
				let error = new Error("Bad request") as Error & {
					[key: string]: string
				}

				error.validation = data

				throw error
			}

			return data
		},
		onError: (error: Error & { [key: string]: string }) => {
			if (props.onError) {
				props.onError(error)
			}
		},
		onSuccess: (data) => {
			if (props.onSuccess) {
				props.onSuccess(data)
			}
		},
	})
}
