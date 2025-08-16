import { NextRequest as Request, NextResponse as Response } from "next/server"

export async function apiAuthMiddleware(req: Request) {
	const pathname = req.nextUrl.pathname
	const session = req.cookies.get("session")?.value

	// If start with api do middleware auth checking
	if (pathname.startsWith("/api")) {
		if (pathname !== "/api/login") {
			// Check if the session is expired & if expired or no session throw session error

			if (session == undefined) {
				return Response.json(
					{ message: "Authentication failed, no session" },
					{
						status: 401,
						statusText: "Authentication failed, no session",
					},
				)
			} else {
			}
		} else {
			console.log("session:", session)
		}
	}

	return Response.next()
}
