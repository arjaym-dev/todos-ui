import { InferType } from "yup"
import {
	createTaskSchema,
	deleteTaskSchema,
	editTaskSchema,
} from "../validation/todos"
import { QueryClient } from "@tanstack/react-query"
import { TStringIndex } from "./misc"
import { TLink } from "./user"

export type TTask = {
	userId: string
	_id: string
	task: string
	links: TLink[]
}

export type RTaskMutation<T> = {
	onError?: (error: TStringIndex) => void
	onSuccess?: (data?: T) => void
	queryClient?: QueryClient
	token?: string
}

export type TCreateTask = InferType<typeof createTaskSchema>
export type TDeleteTask = InferType<typeof deleteTaskSchema>
export type TEditTask = TTask
