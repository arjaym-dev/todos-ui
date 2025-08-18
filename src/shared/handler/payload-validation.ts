import { ValidationError } from "yup"

export const payloadValidationErrors = (errors: ValidationError) => {
	let errs: { [key: string]: string } = {}

	errors.inner.forEach((err: ValidationError) => {
		const path = err.path as string
		const message = err.message

		errs[path] = message
	})

	return errs
}
