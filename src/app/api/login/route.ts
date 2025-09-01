import { NextRequest as Request, NextResponse as Response } from "next/server"
import { ValidationError } from "yup"
import { MongooseError } from "mongoose"
import bcrypt from "bcrypt"

import { TLoginUser, loginUserSchema } from "@/shared/validation/users"
import users from "@/app/models/users"
import dbConnect from "@/shared/lib/db-connect"
import { createSession } from "@/shared/lib/session"

export async function POST(req: Request) {
	try {
		await dbConnect()

		const payload: TLoginUser = await req.json()

		// Validate payload
		await loginUserSchema.validate(payload, { abortEarly: false })

		// Check if user exist
		console.log("users:", await users.find())
		const user = await users.findOne({ username: payload.username })

		if (user === null)
			return Response.json(
				{ username: "Username does not exist" },
				{ status: 400 },
			)

		// validate password
		const validPassword = await bcrypt.compare(
			payload.password,
			user.password,
		)

		if (validPassword === false)
			return Response.json(
				{ password: "Incorrect password" },
				{ status: 400 },
			)

		// create auth token
		const sessionPayload = {
			_id: user._id.toString(),
			username: user.username,
			roleId: user.roleId,
		}

		await createSession(sessionPayload)

		// Proceed to login details
		return Response.json(sessionPayload, { status: 200 })
	} catch (error) {
		let resError: { [key: string]: string } = {},
			status = 500

		if (error instanceof ValidationError) {
			// Validate payload send error message
			error.inner.forEach((err: ValidationError) => {
				const path = err.path as string
				const message = err.message as string

				resError[path] = message
			})

			status = 400
		} else if (error instanceof MongooseError) {
			resError = { message: error.message }
			status = 400
		}

		return Response.json(resError, { status: status })
	}
}
