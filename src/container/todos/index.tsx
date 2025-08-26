/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react"

import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import TextField, { TextFieldProps } from "@mui/material/TextField"

import { Formik, Form } from "formik"

import { TCreateTask } from "@/shared/types/todos"
import { createTaskSchema } from "@/shared/validation/todos"
import useTodoStore from "@/shared/zustand/todos"
import TodosTable from "./table"
import { requestCreateTask, requestGetTasks } from "./request"
import { TableContainerWrapper } from "./styled"

const Todos = () => {
	const innerRef = useRef(null)
	const { formMode, user } = useTodoStore()

	const form = { userId: user._id, task: "" }

	const handleOnError = (error: Error & { [key: string]: string }) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const current = innerRef.current as any
		if (current) {
			current.setErrors(error.validation)
		}
	}
	const handleOnSubmit = (values: TCreateTask) => {
		taskMutation.mutate(values)
	}

	const taskMutation = requestCreateTask({ onError: handleOnError })
	const { data = [], isPending } = requestGetTasks(user._id)

	return (
		<TableContainerWrapper>
			<Formik
				innerRef={innerRef}
				initialValues={form}
				validationSchema={createTaskSchema}
				onSubmit={handleOnSubmit}>
				{({ errors, values, handleChange }) => {
					const taskInputProps: TextFieldProps = {
						error: errors.task ? true : false,
						helperText: errors.task,
						size: "small",
						name: "task",
						placeholder: "Enter task...",
						value: values.task,
						onChange: handleChange,
						disabled: formMode === "EDIT",
					}

					return (
						<Form>
							<Box className="searchbar">
								<TextField {...taskInputProps} />
								<Button
									size="small"
									variant="contained"
									color="success"
									type="submit"
									disabled={
										taskMutation.isPending ||
										values.task === ""
									}>
									Create Task
								</Button>
							</Box>
						</Form>
					)
				}}
			</Formik>
			<TodosTable data={data} loading={isPending} />
		</TableContainerWrapper>
	)
}

export default Todos
