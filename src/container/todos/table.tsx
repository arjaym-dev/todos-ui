import React, { useState } from "react"

import Table from "@mui/material/Table"
import TableContainer from "@mui/material/TableContainer"
import TableBody from "@mui/material/TableBody"
import TableHead from "@mui/material/TableHead"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField, { TextFieldProps } from "@mui/material/TextField"

import { TTask } from "@/shared/types/todos"
import useTodoStore from "@/shared/zustand/todos"

import { requestEditTask, requestDeleteTaskMutation } from "./request"
import ArrayCollect from "@/shared/lib/array-collect"

const TRow: React.FC<TTask> = (row) => {
	const { formMode, edit, user, initialState, setFormMode, setEditTask } =
		useTodoStore()
	const [error, setError] = useState("")

	const onSuccess = () => {
		setFormMode("")
		setEditTask(initialState.edit)
	}

	const handleEdit = () => {
		setFormMode("EDIT")
		setEditTask(row)
	}

	const handleCancel = () => {
		setFormMode("")
		setEditTask(initialState.edit)
		setError("")
	}

	const handleSave = () => editTaskMutation.mutate(edit)
	const handleDelete = () =>
		deleteTaskMutation.mutate({ _id: row._id, userId: row.userId })

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditTask({ ...edit, [e.target.name]: e.target.value })

		if (e.target.value.length === 0) {
			setError("Task is required")
		} else {
			setError("")
		}
	}

	const editInputProps: TextFieldProps = {
		error: edit._id === row._id && error.length > 0,
		helperText: error,
		size: "small",
		name: "task",
		value: edit.task,
		onChange: handleOnChange,
	}

	const isEdit = formMode === "EDIT" && edit._id === row._id

	const editTaskMutation = requestEditTask({
		onSuccess: onSuccess,
		token: user.token,
	})
	const deleteTaskMutation = requestDeleteTaskMutation({ token: user.token })
	const rowLinks = row.links
	const updateTodosPerm = ArrayCollect.getObjByKey(
		rowLinks,
		"rel",
		"edit-todos",
	)
	const deleteTodosPerm = ArrayCollect.getObjByKey(
		rowLinks,
		"rel",
		"delete-todos",
	)

	return (
		<TableRow>
			<TableCell>{row._id}</TableCell>
			<TableCell>
				{isEdit ? <TextField {...editInputProps} /> : row.task}
			</TableCell>
			<TableCell>
				<Box className="action-wrapper">
					{isEdit ? (
						<React.Fragment>
							<Button
								size="small"
								variant="contained"
								color="success"
								onClick={handleSave}
								disabled={error.length > 0}>
								Save
							</Button>
							<Button
								size="small"
								variant="contained"
								color="error"
								onClick={handleCancel}>
								Cancel
							</Button>
						</React.Fragment>
					) : (
						<React.Fragment>
							{updateTodosPerm && (
								<Button
									size="small"
									variant="contained"
									color="success"
									onClick={handleEdit}>
									Edit
								</Button>
							)}
							{deleteTodosPerm && (
								<Button
									size="small"
									variant="contained"
									color="error"
									onClick={handleDelete}>
									Delete
								</Button>
							)}
						</React.Fragment>
					)}
				</Box>
			</TableCell>
		</TableRow>
	)
}

const TRowNoData = () => {
	return (
		<TableRow>
			<TableCell align="center" component="th" scope="row" colSpan={3}>
				No data to display
			</TableCell>
		</TableRow>
	)
}

type TTodosTable = { data: TTask[]; loading: boolean }

const TodosTable: React.FC<TTodosTable> = ({ data, loading }) => {
	let elem: React.ReactElement | React.ReactElement[] = <TRowNoData />

	if (loading) return null
	if (data.length > 0) {
		elem = data.map((row, index) => <TRow key={index} {...row} />)
	}

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>TASK ID</TableCell>
						<TableCell>TASK</TableCell>
						<TableCell>ACTION</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{elem}</TableBody>
			</Table>
		</TableContainer>
	)
}

export default TodosTable
