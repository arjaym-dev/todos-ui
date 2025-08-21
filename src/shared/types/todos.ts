import { InferType } from "yup"
import {
	createTaskSchema,
	deleteTaskSchema,
	editTaskSchema,
} from "../validation/todos"

export type TTask = { userId: string; _id: string; task: string }

export type TCreateTask = InferType<typeof createTaskSchema>
export type TDeleteTask = InferType<typeof deleteTaskSchema>
export type TEditTask = InferType<typeof editTaskSchema>
