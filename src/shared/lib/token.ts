import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { JWTExpired, JWSInvalid } from "jose/errors"

import ENV from "./env"

const encodedKey = new TextEncoder().encode(ENV.NEXT_PUBLIC_SESSION_SECRET_KEY)

export async function encrypt(payload: JWTPayload) {
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

		console.log(error)
		return err
	}
}
