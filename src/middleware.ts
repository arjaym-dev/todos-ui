import { NextRequest as Request, NextResponse as Response } from "next/server"

import { apiAuthMiddleware } from "./app/api/middleware"

export async function middleware(req: Request) {
	const apiAuthResponse = await apiAuthMiddleware(req)

	if (apiAuthResponse.status === 401) {
		return Response.json(
			{ message: apiAuthResponse.statusText },
			{ status: apiAuthResponse.status },
		)
	}

	return Response.next({})
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
}
