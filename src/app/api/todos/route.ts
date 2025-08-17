import { NextRequest as Request, NextResponse as Response } from "next/server"
import { ValidationError } from "yup"
import { MongooseError } from "mongoose"

import dbConnect from "@/shared/lib/db-connect"
import users from "@/app/models/users"
import todos from "@/app/models/todos"
import roles from "@/app/models/roles"

import { createTaskSchema, TCreateTask } from "@/shared/validation/todos"
import { decrypt } from "@/shared/lib/session"
import { JWTPayload } from "jose"
// Create task
export async function POST(req: Request) {
	try {
		await dbConnect()
		const session = req.cookies.get("session")?.value
		const sessionDecrypt = (await decrypt(session)) as JWTPayload

		const payload: TCreateTask = await req.json()

		// Validate if the session token, is really the user that creating the task
		const user = await users.findById(payload.userId)
		if (user) {
			if (user._id.toString() !== sessionDecrypt._id) {
				return Response.json(
					{
						message:
							"Session user does not match on user id, invalid action",
					},
					{ status: 401 },
				)
			}
		}

		// Validate if the user, has permission if not throw error
		const role = await roles.findById(sessionDecrypt.roleId)
		if (role) {
			const permissions = role.permissions

			if (permissions.includes("API_TODOS_CREATE") === false) {
				return Response.json(
					{
						message:
							"User does not have permission for this action",
					},
					{ status: 401 },
				)
			}
		}

		// Validate payload
		await createTaskSchema.validate(payload, { abortEarly: false })

		// Save to todos collection
		const task = await todos.create(payload)

		// Send newly created task
		return Response.json(task, { status: 200 })
	} catch (error) {
		let resError: { [key: string]: string } = {},
			status = 500

		if (error instanceof ValidationError) {
			// Validate payload send error message
			error.inner.forEach((err: ValidationError) => {
				const path = err.path as string
				const message = err.message

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
