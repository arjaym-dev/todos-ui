import { NextRequest as Request, NextResponse as Response } from "next/server"
import { ValidationError } from "yup"
import { MongooseError } from "mongoose"
import { JWTPayload } from "jose"

import dbConnect from "@/shared/lib/db-connect"
import users from "@/app/models/users"
import todos from "@/app/models/todos"
import roles from "@/app/models/roles"

import {
	createTaskSchema,
	deleteTaskSchema,
	editTaskSchema,
	TEditTask,
	TCreateTask,
	TDeleteTask,
} from "@/shared/validation/todos"
import { payloadValidationErrors } from "@/shared/handler/payload-validation"
import { decrypt } from "@/shared/lib/session"

// Get todos
export async function GET(req: Request) {
	try {
		await dbConnect()
		const session = req.cookies.get("session")?.value
		const sessionDecrypt = (await decrypt(session)) as JWTPayload

		const userId = req.nextUrl.searchParams.get("userId")

		// Validate if the session token, is really the user that creating the task

		const user = await users.findById(userId)
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

			if (permissions.includes("API_TODOS_VIEW") === false) {
				return Response.json(
					{
						message:
							"User does not have permission for this action",
					},
					{ status: 401 },
				)
			}
		}

		// Get all task by userId
		const tasks = await todos.find({ userId: userId })

		return Response.json(tasks, { status: 200 })
	} catch (error) {
		let resError: { [key: string]: string } = {},
			status = 500
		console.log(error)
		if (error instanceof MongooseError) {
			resError = { message: error.message }
			status = 400
		}

		return Response.json(resError, { status: status })
	}
}
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
			resError = payloadValidationErrors(error)

			status = 400
		} else if (error instanceof MongooseError) {
			resError = { message: error.message }
			status = 400
		}

		return Response.json(resError, { status: status })
	}
}

// Delete task
export async function DELETE(req: Request) {
	try {
		await dbConnect()
		const session = req.cookies.get("session")?.value
		const sessionDecrypt = (await decrypt(session)) as JWTPayload

		const payload: TDeleteTask = await req.json()

		// Validate payload
		await deleteTaskSchema.validate(payload, { abortEarly: false })

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

			if (permissions.includes("API_TODOS_DELETE") === false) {
				return Response.json(
					{
						message:
							"User does not have permission for this action",
					},
					{ status: 401 },
				)
			}
		}

		// Delete task
		await todos.findByIdAndDelete(payload.taskId)

		return Response.json({}, { status: 202 })
	} catch (error) {
		let resError: { [key: string]: string } = {},
			status = 500

		if (error instanceof ValidationError) {
			// Validate payload send error message
			resError = payloadValidationErrors(error)
			status = 400
		} else if (error instanceof MongooseError) {
			resError = { message: error.message }
			status = 400
		}

		return Response.json(resError, { status: status })
	}
}

// Update task
export async function PUT(req: Request) {
	try {
		await dbConnect()
		const session = req.cookies.get("session")?.value
		const sessionDecrypt = (await decrypt(session)) as JWTPayload

		const payload: TEditTask = await req.json()

		// Validate payload
		await editTaskSchema.validate(payload, { abortEarly: false })

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

			if (permissions.includes("API_TODOS_DELETE") === false) {
				return Response.json(
					{
						message:
							"User does not have permission for this action",
					},
					{ status: 401 },
				)
			}
		}

		// Update the task
		const task = await todos.findByIdAndUpdate(
			payload.taskId,
			{ task: payload.task },
			{ lean: true, new: true, select: "_id userId task" },
		)

		return Response.json(task, { status: 200 })
	} catch (error) {
		let resError: { [key: string]: string } = {},
			status = 500

		if (error instanceof ValidationError) {
			// Validate payload send error message
			resError = payloadValidationErrors(error)
			status = 400
		} else if (error instanceof MongooseError) {
			resError = { message: error.message }
			status = 400
		}

		return Response.json(resError, { status: status })
	}
}
