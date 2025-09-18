import { useMutation } from "@tanstack/react-query"

import { TLoginUser } from "@/shared/validation/users"
import { TUser } from "@/shared/types/user"

import { Variables } from "@/shared/constant/variables"
export type TRequestLogin = {
	onError?: (error: Error & { [key: string]: string }) => void
	onSuccess?: (data: TUser) => void
}

export const requestLogin = (props: TRequestLogin) => {
	return useMutation({
		retry: false,
		mutationKey: ["todos"],
		mutationFn: async (payload: TLoginUser) => {
			const res = await fetch(Variables.baseQuery + "/login", {
				method: "POST",
				body: JSON.stringify(payload),
				credentials: "same-origin",
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
