import { useMutation } from "@tanstack/react-query"

import { TLoginUser } from "@/shared/validation/users"
import { TUser } from "@/shared/types/user"
import { TStringIndex } from "@/shared/types/misc"

import request from "@/shared/constant/request"
import { AxiosError } from "axios"

export type TRequestLogin = {
	onError?: (error: TStringIndex) => void
	onSuccess?: (data: TUser) => void
}

export const requestLogin = (props: TRequestLogin) => {
	return useMutation({
		retry: false,
		mutationKey: ["todos"],
		mutationFn: async (payload: TLoginUser) => {
			const res = await request.post("/login", payload)
			const data = res.data

			if (res.statusText != "OK") {
				let error = new Error("Bad request") as Error & {
					[key: string]: string
				}

				error.validation = data

				throw error
			}

			return data
		},
		onError: (error: Error) => {
			if (error.name == "AxiosError") {
				let err = error as AxiosError
				if (props.onError) {
					props.onError(err.response?.data as TStringIndex)
				}
			}
		},
		onSuccess: (data) => {
			if (props.onSuccess) {
				props.onSuccess(data)
			}
		},
	})
}
