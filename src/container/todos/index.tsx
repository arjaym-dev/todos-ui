import React, { useState } from "react"

import Table from "@mui/material/Table"
import TableContainer from "@mui/material/TableContainer"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import TextField, { TextFieldProps } from "@mui/material/TextField"

import { TTask } from "@/shared/types/todos"

import { TableContainerWrapper } from "./styled"

const TRow: React.FC<TTask> = (row) => {
	return (
		<TableRow>
			<TableCell>{row._id}</TableCell>
			<TableCell>{row.task}</TableCell>
			<TableCell>
				<Button size="small" variant="contained" color="success">
					Edit
				</Button>
				<Button size="small" variant="contained" color="error">
					Delete
				</Button>
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
const Todos = () => {
	const [task, setTask] = useState("")

	const rows: TTask[] = [{ _id: "1", userId: "2", task: "Test" }]

	let elem: React.ReactElement | React.ReactElement[] = <TRowNoData />

	if (rows.length > 0) {
		elem = rows.map((row, index) => <TRow key={index} {...row} />)
	}

	const handleTaskOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTask(e.target.value)
	}

	const taskInputProps: TextFieldProps = {
		size: "small",
		name: "task",
		placeholder: "Enter task...",
		value: task,
		onChange: handleTaskOnchange,
	}

	return (
		<TableContainerWrapper>
			<Box className="searchbar">
				<TextField {...taskInputProps} />
				<Button size="small" variant="contained" color="success">
					Create Task
				</Button>
			</Box>
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
		</TableContainerWrapper>
	)
}

export default Todos
