/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from "@tanstack/react-query"

import { TCreateTask } from "@/shared/types/todos"

type RCreateTask = {
	onError: (error: Error & { [key: string]: string }) => void
}

export const requestGetTasks = (userId: string) => {
	return useQuery({
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
		queryKey: ["get-tasks"],
		queryFn: async () => {
			const res = await fetch(`/api/todos?userId=${userId}`)

			return await res.json()
		},
	})
}

export const requestCreateTask = (props: RCreateTask) => {
	return useMutation({
		retry: false,
		mutationKey: ["create-task"],
		mutationFn: async (payload: TCreateTask) => {
			const res = await fetch("/api/todos", {
				method: "POST",
				body: JSON.stringify(payload),
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			// const current = innerRef.current as any
			// if (current) {
			//   current.setErrors(error.validation)
			// }

			props.onError(error)
		},
	})
}
