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

import { TEditTask, TTask } from "@/shared/types/todos"
import useTodoStore from "@/shared/zustand/todos"

const TRow: React.FC<TTask> = (row) => {
	const { formMode, edit, setFormMode, setEditTask } = useTodoStore()
	const [error, setError] = useState("")

	const handleEdit = () => {
		setFormMode("EDIT")
		setEditTask({ userId: row.userId, taskId: row._id, task: row.task })
	}

	const handleCancel = () => {
		setFormMode("")
		setEditTask({ userId: "", taskId: "", task: "" })
		setError("")
	}

	const handleSave = () => {}

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditTask({ ...edit, [e.target.name]: e.target.value })

		if (e.target.value.length === 0) {
			setError("Task is required")
		} else {
			setError("")
		}
	}

	const editInputProps: TextFieldProps = {
		error: edit.taskId === row._id && error.length > 0,
		helperText: error,
		size: "small",
		name: "task",
		value: edit.task,
		onChange: handleOnChange,
	}

	const isEdit = formMode === "EDIT" && edit.taskId === row._id

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
							<Button
								size="small"
								variant="contained"
								color="success"
								onClick={handleEdit}>
								Edit
							</Button>
							<Button
								size="small"
								variant="contained"
								color="error">
								Delete
							</Button>
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
