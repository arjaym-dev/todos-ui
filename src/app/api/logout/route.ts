import { deleteSession } from "@/shared/lib/session"
import { NextRequest as Request, NextResponse as Response } from "next/server"

export async function DELETE(req: Request) {
	try {
		await deleteSession()
		return Response.json({}, { status: 201 })
	} catch (error) {
		console.log("logging out error:", error)

		return Response.json({ message: error })
	}
}
