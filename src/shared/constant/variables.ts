import ENV from "../lib/env"
type TVariables = { baseQuery: string }

export const Variables: TVariables = {
	baseQuery:
		process.env.NODE_ENV === "development"
			? ENV.REQUEST_BASE_QUERY_DEV_
			: ENV.REQUEST_BASE_QUERY_PROD_,
}
