import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { SxProps, Theme } from "@mui/material"

import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import Button, { ButtonProps } from "@mui/material/Button"
import { Formik, Form } from "formik"

import { TLoginUser, loginUserSchema } from "@/shared/validation/users"
import useTodoStore from "@/shared/zustand/todos"

import { requestLogin } from "./request"
import { TUser } from "@/shared/types/user"

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
	const innerRef = useRef(null)
	const router = useRouter()
	const { setUser } = useTodoStore()

	const handleOnError = (error: Error & { [key: string]: string }) => {
		const current = innerRef.current as any
		if (current) {
			current.setErrors(error.validation)
		}
	}

	const handleOnSuccess = (data: TUser) => {
		setUser(data)
		router.push("/dashboard")
	}

	const handleOnSubmit = (values: TLoginUser) => {
		loginMutation.mutate(values)
	}

	const loginMutation = requestLogin({
		onError: handleOnError,
		onSuccess: handleOnSuccess,
	})

	const form = { username: "", password: "" }

	return (
		<Grid sx={ContainerSx} container size={12}>
			<Grid size={{ xs: 12, sm: 6, md: 3 }}>
				<Formik
					innerRef={innerRef}
					initialValues={form}
					validationSchema={loginUserSchema}
					onSubmit={handleOnSubmit}>
					{({ errors, values, handleChange }) => {
						const usernameProps: TextFieldProps = {
							error: errors && errors.username ? true : false,
							helperText: errors && errors.username,
							name: "username",
							id: "username",
							placeholder: "Username",
							size: "small",
							type: "text",
							value: values.username,
							onChange: handleChange,
						}

						const passwordProps: TextFieldProps = {
							error: errors && errors.password ? true : false,
							helperText: errors && errors.password,
							name: "password",
							id: "password",
							placeholder: "Password",
							size: "small",
							type: "password",
							value: values.password,
							onChange: handleChange,
						}

						const buttonProps: ButtonProps = {
							disabled: loginMutation.isPending,
							fullWidth: true,
							variant: "contained",
							size: "small",
							type: "submit",
						}

						return (
							<Form>
								<Box className="form-wrapper">
									<TextField {...usernameProps} />
									<TextField {...passwordProps} />
									<Button {...buttonProps}>Login</Button>
								</Box>
							</Form>
						)
					}}
				</Formik>
			</Grid>
		</Grid>
	)
}

export default Login
