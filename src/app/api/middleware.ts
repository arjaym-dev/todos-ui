import { NextRequest as Request, NextResponse as Response } from "next/server"

import { decrypt } from "@/shared/lib/session"

const createAuthError = (message: string) => {
	return Response.json(
		{ message: `Authentication failed, ${message}` },
		{ status: 401, statusText: `Authentication failed, ${message}` },
	)
}

export async function apiAuthMiddleware(req: Request) {
	const pathname = req.nextUrl.pathname
	const session = req.cookies.get("session")?.value

	// If start with api do middleware auth checking
	if (pathname.startsWith("/api")) {
		/**
		 * Auth middleware will work unless its not the ff route
		 * /login
		 */

		if (pathname !== "/api/login") {
			let sessionDecrypt = await decrypt(session)
			// Check if the session is expired & if expired or no session throw session error
			if (session == undefined) return createAuthError("no session")

			// Decrypt session & Check if session is expired or being invalidated
			if (sessionDecrypt === "JWTExpired") {
				return createAuthError("expired session")
			} else if (sessionDecrypt === "JWSInvalid") {
				return createAuthError("session is invalid")
			}
		} else {
			console.log("api auth middleware:")
		}
	}

	return Response.next()
}
