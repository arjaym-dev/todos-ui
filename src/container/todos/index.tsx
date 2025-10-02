import React, { useRef } from "react"
import { AxiosError } from "axios"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import TextField, { TextFieldProps } from "@mui/material/TextField"

import { Formik, Form } from "formik"

import useTodoStore from "@/shared/zustand/todos"

import { TCreateTask } from "@/shared/types/todos"
import { createTaskSchema } from "@/shared/validation/todos"
import withAuth from "@/shared/lib/with-auth"

import TodosTable from "./table"
import { requestCreateTask, requestGetTasks } from "./request"
import { TableContainerWrapper } from "./styled"
import { TStringIndex } from "@/shared/types/misc"

const Todos = () => {
	const innerRef = useRef(null)
	const { formMode, user } = useTodoStore()

	const form = { userId: user._id, task: "" }

	const handleOnError = (error: TStringIndex) => {
		const current = innerRef.current as any
		if (current) {
			current.setErrors(error.validation)
		}
	}
	const handleOnSubmit = (values: TCreateTask) => {
		taskMutation.mutate(values)
	}

	const taskMutation = requestCreateTask({
		onError: handleOnError,
		token: user.token,
	})
	const {
		data = [],
		isPending,
		error,
	} = requestGetTasks(user._id, user.token)

	const err = error as AxiosError

	if (isPending) return <p>Loading...</p>

	if (err && err.status === 401) return <Box>401</Box>

	return (
		<TableContainerWrapper>
			<Formik
				innerRef={innerRef}
				initialValues={form}
				validationSchema={createTaskSchema}
				onSubmit={handleOnSubmit}>
				{({ errors, values, handleChange }) => {
					const taskInputProps: TextFieldProps = {
						error: errors && errors.task ? true : false,
						helperText: errors && errors.task,
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
										values.task === "" ||
										formMode === "EDIT"
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

export default withAuth(Todos)
