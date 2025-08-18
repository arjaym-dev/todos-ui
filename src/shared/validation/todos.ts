/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { object, string, number, date, InferType } from "yup"

export const createTaskSchema = object({
	userId: string().required("UserID is required"),
	task: string().required("Task is required"),
})

export const deleteTaskSchema = object({
	userId: string().required("UserID is required"),
	taskId: string().required("TaskID is required"),
})

export const editTaskSchema = object({
	userId: string().required("UserID is required"),
	taskId: string().required("TaskID is required"),
	task: string().required("Task is required"),
})

export type TCreateTask = InferType<typeof createTaskSchema>
export type TDeleteTask = InferType<typeof deleteTaskSchema>
export type TEditTask = InferType<typeof editTaskSchema>
