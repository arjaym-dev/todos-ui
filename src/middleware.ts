/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest as Request, NextResponse as Response } from "next/server"

export async function middleware(req: Request) {
	return Response.next({})
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
}
