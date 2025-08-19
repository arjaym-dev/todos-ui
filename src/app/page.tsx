/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import React from "react"
import { SxProps, Theme } from "@mui/material"

import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import Button, { ButtonProps } from "@mui/material/Button"

const ContainerSx: SxProps<Theme> = {
	"&": {
		justifyContent: "center",

		".form-wrapper": {
			display: "flex",
			flexDirection: "column",
			rowGap: "20px",
			padding: "20px",
			mt: "100px",
			border: "1px solid #0000003b",
		},
	},
}

export default function Home() {
	const [form, setForm] = React.useState({ username: "", password: "" })

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prevForm) => ({
			...prevForm,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = () => {}
	const usernameProps: TextFieldProps = {
		name: "username",
		id: "username",
		placeholder: "Username",
		size: "small",
		type: "text",
		value: form.username,
		onChange: handleOnChange,
	}

	const passwordProps: TextFieldProps = {
		name: "password",
		id: "password",
		placeholder: "Password",
		size: "small",
		type: "password",
		value: form.password,
		onChange: handleOnChange,
	}

	const buttonProps: ButtonProps = {
		fullWidth: true,
		variant: "contained",
		size: "small",
		onClick: handleSubmit,
	}

	return (
		<Grid sx={ContainerSx} container size={12}>
			<Grid size={{ xs: 3 }}>
				<Box className="form-wrapper">
					<TextField {...usernameProps} />
					<TextField {...passwordProps} />
					<Button {...buttonProps}>Login</Button>
				</Box>
			</Grid>
		</Grid>
	)
}
