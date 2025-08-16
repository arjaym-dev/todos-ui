/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextRequest as Request, NextResponse as Response } from "next/server"
import { ValidationError } from "yup"
import { MongooseError } from "mongoose"
import bcrypt from "bcrypt"

import Role, { Roles } from "@/app/models/roles"
import Users from "@/app/models/users"

import { TCreateUser, createUserSchema } from "@/shared/validation/users"
import dbConnect from "@/shared/lib/db-connect"

export async function POST(request: Request) {
	try {
		await dbConnect()

		const payload: TCreateUser = await request.json()

		// Validate payload
		await createUserSchema.validate(payload, { abortEarly: false })

		// Validate if user already exist
		const userExist = await Users.findOne({ username: payload.username })

		if (userExist)
			return Response.json(
				{ username: "Username already exist" },
				{ status: 400 },
			)

		// Check assign roles & Validate if user allow for creating user account
		const roleById = await Role.findById(payload.roleId)

		if (roleById == null)
			return Response.json(
				{ message: "Role does not exist" },
				{ status: 400 },
			)

		if (roleById.roleId != "ADMIN")
			return Response.json({ message: "Unauthorized" }, { status: 401 })

		// Hash password
		const hashPassword = await bcrypt.hash(payload.password, 10)

		// Save user into collection
		await Users.create({
			username: payload.username,
			password: hashPassword,
			roleId: payload.roleId,
		})

		return Response.json(
			{ message: "Successfully created user" },
			{ status: 201, statusText: "Created" },
		)
	} catch (error) {
		let resError: { [key: string]: string } = {},
			status = 500

		if (error instanceof ValidationError) {
			// Validate payload send error message
			error.inner.forEach((err: any) => {
				const path = err.path
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
