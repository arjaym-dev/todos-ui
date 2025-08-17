/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { object, string, number, date, InferType } from "yup"

export const createTaskSchema = object({
	userId: string().required("UserID is required"),
	task: string().required("Task is required"),
})

export type TCreateTask = InferType<typeof createTaskSchema>
