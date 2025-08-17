/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only"

import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { cookies } from "next/headers"
import { JWTExpired, JWTInvalid, JWSInvalid } from "jose/errors"

import { TSessionPayload } from "../validation/users"
import ENV from "./env"

const encodedKey = new TextEncoder().encode(ENV.SESSION_SECRET_KEY)

export async function encrypt<T>(payload: JWTPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1 hr")
		.sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		})

		return payload
	} catch (error) {
		let err = ""

		if (error instanceof JWTExpired) {
			err = "JWTExpired"
		} else if (error instanceof JWSInvalid) {
			err = "JWSInvalid"
		}

		return err
	}
}

export async function createSession(payload: TSessionPayload) {
	const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hr
	// const expiresAt = new Date(Date.now() + 1 * 60 * 1000) // 1 min
	// const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min
	const session = await encrypt({ ...payload, expiresAt })
	const cookieStore = await cookies()

	cookieStore.set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	})
}

export async function updateSession() {
	const session = (await cookies()).get("session")?.value
	const payload = await decrypt(session)

	if (!session || !payload) {
		return null
	}

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

	const cookieStore = await cookies()
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: true,
		expires: expires,
		sameSite: "lax",
		path: "/",
	})
}

export async function deleteSession() {
	const cookieStore = await cookies()
	cookieStore.delete("session")
}
