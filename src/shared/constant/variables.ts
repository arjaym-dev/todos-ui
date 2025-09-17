import ENV from "../lib/env"
type TVariables = { baseQuery: string }

export const Variables: TVariables = {
	baseQuery: ENV.NEXT_PUBLIC_REQUEST_BASE_QUERY,
}
