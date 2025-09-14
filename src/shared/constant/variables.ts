import ENV from "../lib/env"
type TVariables = { baseQuery: string }

export const Variables: TVariables = {
	baseQuery:
		process.env.NODE_ENV === "development"
			? ENV.NEXT_PUBLIC_REQUEST_BASE_QUERY_DEV
			: ENV.NEXT_PUBLIC_REQUEST_BASE_QUERY_PROD,
}
