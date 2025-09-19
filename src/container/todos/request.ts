import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"

import {
	TCreateTask,
	TEditTask,
	RTaskMutation,
	TTask,
} from "@/shared/types/todos"
import request from "@/shared/constant/request"
import { Variables } from "@/shared/constant/variables"
import { AxiosError } from "axios"
import { TStringIndex } from "@/shared/types/misc"

export const requestGetTasks = (userId: string, token: string) => {
	return useQuery({
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
		queryKey: ["get-tasks"],
		staleTime: "static",
		queryFn: async () => {
			const response = await request.get(`/todos?userId=${userId}`, {
				token,
			})

			return response.data
		},
	})
}

export const requestEditTask = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()

	return useMutation({
		retry: false,
		mutationKey: ["edit-task"],
		mutationFn: async (payload: TEditTask) => {
			const response = await request.put(`/todos`, payload, {
				token: props.token,
			})

			return response.data
		},
		onError: (error: Error) => {
			if (error.name === "AxiosError") {
				const err = error as AxiosError
				if (props.onError) {
					props.onError(err.response?.data as TStringIndex)
				}
			}
		},
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
			const { data } = await request.post(`/todos`, payload, {
				token: props.token,
			})

			return data
		},
		onError: (error: Error) => {
			if (error.name === "AxiosError") {
				const err = error as AxiosError
				if (props.onError) {
					props.onError(err.response?.data as TStringIndex)
				}
			}
		},
		onSuccess: (data: T) => {
			queryClient.setQueryData(["get-tasks"], (prevTasks: TTask[]) => {
				return prevTasks ? [...prevTasks, data] : prevTasks
			})
		},
	})
}

export const requestDeleteTaskMutation = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()

	return useMutation({
		retry: false,
		mutationKey: ["delete-task"],
		mutationFn: async (payload: { _id: string; userId: string }) => {
			const { data } = await request.delete(`/todos`, payload, {
				token: props.token,
			})

			return data
		},
		onError: (error: Error) => {
			if (error.name === "AxiosError") {
				const err = error as AxiosError
				if (props.onError) {
					props.onError(err.response?.data as TStringIndex)
				}
			}
		},
		onSuccess: (data: T, variables: { _id: string; userId: string }) => {
			queryClient.setQueryData(["get-tasks"], (prevTasks: TTask[]) => {
				return prevTasks.filter((task) => task._id != variables._id)
			})
		},
	})
}
