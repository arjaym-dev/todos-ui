import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"

import {
	TCreateTask,
	TEditTask,
	RTaskMutation,
	TTask,
} from "@/shared/types/todos"
import request from "@/shared/constant/request"
import { AxiosError } from "axios"
import { TStringIndex } from "@/shared/types/misc"
import { TLinks } from "@/shared/types/user"

export const requestGetTasks = (userId: string, token: string) => {
	const queryKey = ["get-tasks", token] as const

	const fetchTasks = async () => {
		const response = await request.get(
			`/todos?userId=${encodeURIComponent(userId)}`,
			{ token },
		)
		return response.data
	}

	const queryOptions = {
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
		queryKey,
		queryFn: fetchTasks,
	}

	return useQuery(queryOptions)
}

export const requestEditTask = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()
	const mutationKey = ["edit-task"] as const

	const editTask = async (payload: TEditTask): Promise<T> => {
		const { data } = await request.put(`/todos`, payload, {
			token: props.token,
		})
		return data as T
	}

	const handleError = (error: Error) => {
		if (error.name === "AxiosError") {
			const err = error as AxiosError
			props.onError?.(err.response?.data as TStringIndex)
		}
	}

	const handleSuccess = (data: T, variables: TEditTask) => {
		queryClient.setQueryData(
			["get-tasks", props.token],
			(prev: TTask[] | { items: TTask[]; links: TLinks } | undefined) => {
				if (!prev) return prev

				// If cached as an array of tasks
				if (Array.isArray(prev)) {
					return prev.map((task) =>
						task._id === variables._id
							? { ...task, ...(data as Partial<TTask>) }
							: task,
					)
				}

				// If cached as a paginated object with items
				if ("items" in prev && Array.isArray(prev.items)) {
					const updatedItems = prev.items.map((task) =>
						task._id === variables._id
							? { ...task, ...(data as Partial<TTask>) }
							: task,
					)
					return { ...prev, items: updatedItems }
				}

				return prev
			},
		)

		props.onSuccess?.(data)
	}

	return useMutation<T, Error, TEditTask>({
		retry: false,
		mutationKey,
		mutationFn: editTask,
		onError: handleError,
		onSuccess: handleSuccess,
	})
}

export const requestCreateTask = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()
	const mutationKey = ["create-task"]

	const createTask = async (payload: TCreateTask) => {
		const { data } = await request.post(`/todos`, payload, {
			token: props.token,
		})

		return data
	}

	const handleError = (error: Error) => {
		if (error.name === "AxiosError") {
			const err = error as AxiosError
			props.onError?.(err.response?.data as TStringIndex)
		}
	}

	const handleSuccess = (data: T) => {
		queryClient.setQueryData(
			["get-tasks", props.token],
			(prevTasks: TTask[] | undefined) => {
				return prevTasks ? [...prevTasks, data] : prevTasks
			},
		)

		if (props.onSuccess) props.onSuccess(data)
	}

	return useMutation({
		retry: false,
		mutationKey: mutationKey,
		mutationFn: createTask,
		onError: handleError,
		onSuccess: handleSuccess,
	})
}

export const requestDeleteTaskMutation = <T>(props: RTaskMutation<T>) => {
	const queryClient = useQueryClient()
	const mutationKey = ["delete-task"]

	const deleteTask = async (payload: { _id: string; userId: string }) => {
		const { data } = await request.delete(`/todos`, payload, {
			token: props.token,
		})
		return data
	}

	const handleError = (error: Error) => {
		if (error.name === "AxiosError") {
			const err = error as AxiosError
			props.onError?.(err.response?.data as TStringIndex)
		}
	}

	const handleSuccess = (
		data: T,
		variables: { _id: string; userId: string },
	) => {
		queryClient.setQueryData(
			["get-tasks", props.token],
			(prevTasks: TTask[] | undefined) => {
				if (!prevTasks) return prevTasks
				return prevTasks.filter((task) => task._id !== variables._id)
			},
		)

		if (props.onSuccess) props.onSuccess(data)
	}

	return useMutation({
		retry: false,
		mutationKey,
		mutationFn: deleteTask,
		onError: handleError,
		onSuccess: handleSuccess,
	})
}
