import axios, { AxiosInstance, CreateAxiosDefaults } from "axios"

type TExtra = { withAuth?: boolean; token?: string }

const instance = (withAuth?: boolean, token?: string): AxiosInstance => {
	const obj: CreateAxiosDefaults = {
		baseURL: process.env.NEXT_PUBLIC_REQUEST_BASE_QUERY,
	}

	if (withAuth) obj.headers = { Authorization: `Bearer ${token}` }

	return axios.create(obj)
}

const request = {
	get: async (
		url: string,
		{ withAuth, token }: TExtra = { withAuth: false, token: "" },
	) => {
		return await instance(withAuth, token).get(url)
	},
	post: async <T>(
		url: string,
		payload: T,
		{ withAuth, token }: TExtra = { withAuth: false, token: "" },
	) => {
		return await instance(withAuth, token).post(url, payload)
	},
}

export default request
