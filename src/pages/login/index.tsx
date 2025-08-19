import React from "react"
import { SxProps, Theme } from "@mui/material"

import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import Button, { ButtonProps } from "@mui/material/Button"

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

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

const Login = () => {
	const [form, setForm] = React.useState({ username: "", password: "" })
	const [errors, setErrors] = React.useState({})
	const loginMutation = useMutation({
		retry: false,
		mutationKey: ["todos"],
		mutationFn: async () => {
			const res = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(form),
			})

			const data = await res.json()

			if (!res.ok) {
				let error = new Error("Bad request") as Error & {
					[key: string]: string
				}

				error.validation = data

				throw error
			}

			return data
		},
		onError: (error: Error & { [key: string]: string }) => {
			setErrors(error.validation)
		},
	})

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prevForm) => ({
			...prevForm,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = () => {
		loginMutation.mutate()
	}

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
		disabled: loginMutation.isPending,
		fullWidth: true,
		variant: "contained",
		size: "small",
		onClick: handleSubmit,
	}

	console.log(errors)
	return (
		<Grid sx={ContainerSx} container size={12}>
			<Grid size={{ xs: 12, sm: 6, md: 3 }}>
				<Box className="form-wrapper">
					<TextField {...usernameProps} />
					<TextField {...passwordProps} />
					<Button {...buttonProps}>Login</Button>
				</Box>
			</Grid>
		</Grid>
	)
}

export default Login
