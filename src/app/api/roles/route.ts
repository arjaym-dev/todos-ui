import { NextRequest as Request, NextResponse as Response } from "next/server"
import { ValidationError } from "yup"
import { MongooseError } from "mongoose"

import dbConnect from "@/shared/lib/db-connect"
import { payloadValidationErrors } from "@/shared/handler/payload-validation"

import permissions from "@/app/models/permissions"
import roles from "@/app/models/roles"
import { TRole } from "@/shared/types/roles"

export async function GET(req: Request) {
	const roleId = req.nextUrl.searchParams.get("roleId")

	try {
		await dbConnect()

		// Get roles
		const rolesCollection = await roles.find().lean(true)

		// Get permissions
		const permissionsCollection = await permissions.find({}, {}).lean(true)

		return Response.json(
			{ roles: rolesCollection, permissions: permissionsCollection },
			{ status: 200 },
		)
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

export async function PUT(req: Request) {
	try {
		await dbConnect()

		const payload: { roles: TRole[] } = await req.json()
		const newRoles: TRole[] = []

		for (const role of payload.roles) {
			const roleId = role._id

			const newRole = await roles.findByIdAndUpdate(
				roleId,
				{ permissions: role.permissions },
				{ new: true, select: "_id permissions roleId roleName" },
			)

			newRoles.push(newRole)
		}

		return Response.json(newRoles, { status: 200 })
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
