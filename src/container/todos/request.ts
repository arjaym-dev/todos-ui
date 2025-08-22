/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"

import {
	TCreateTask,
	TEditTask,
	RTaskMutation,
	TTask,
} from "@/shared/types/todos"

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

export const requestEditTask = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()

	return useMutation({
		retry: false,
		mutationKey: ["edit-task"],
		mutationFn: async (payload: TEditTask) => {
			const res = await fetch("/api/todos", {
				method: "PUT",
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

			if (props.onError) {
				props.onError(error)
			}
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onSuccess: (data: T, variables: TTask) => {
			queryClient.setQueryData(["get-tasks"], (prevTasks: TTask[]) => {
				return prevTasks.map((task: TTask) => {
					if (variables._id === task._id) {
						return { ...task, ...data }
					} else {
						return task
					}
				})
			})

			if (props.onSuccess) props.onSuccess(data)
		},
	})
}

export const requestCreateTask = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()

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

			if (props.onError) {
				props.onError(error)
			}
		},
		onSuccess: (data: T) => {
			queryClient.setQueryData(["get-tasks"], (prevTasks: TTask[]) => {
				return prevTasks ? [...prevTasks, data] : prevTasks
			})
		},
	})
}
