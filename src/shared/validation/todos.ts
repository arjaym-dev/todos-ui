import { object, string } from "yup"

export const createTaskSchema = object({
	userId: string().required("UserID is required"),
	task: string().required("Task is required"),
})

export const deleteTaskSchema = object({
	userId: string().required("UserID is required"),
	_id: string().required("TaskID is required"),
})

export const editTaskSchema = object({
	userId: string().required("UserID is required"),
	_id: string().required("TaskID is required"),
	task: string().required("Task is required"),
})
