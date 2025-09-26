import axios, { AxiosInstance, CreateAxiosDefaults } from "axios"

type TExtra = { withAuth?: boolean; token?: string }

const instance = (token?: string): AxiosInstance => {
	const obj: CreateAxiosDefaults = {
		baseURL: process.env.NEXT_PUBLIC_REQUEST_BASE_QUERY,
	}

	if (token !== "") obj.headers = { Authorization: `Bearer ${token}` }

	return axios.create(obj)
}

const request = {
	get: async (url: string, { token }: TExtra = { token: "" }) => {
		return await instance(token).get(url)
	},
	post: async <T>(
		url: string,
		payload: T,
		{ token }: TExtra = { token: "" },
	) => {
		return await instance(token).post(url, payload)
	},
	put: async <T>(
		url: string,
		payload: T,
		{ token }: TExtra = { token: "" },
	) => {
		return await instance(token).put(url, payload)
	},
	delete: async <T>(
		url: string,
		payload = {},
		{ token }: TExtra = { token: "" },
	) => {
		return await instance(token).delete(url, { data: payload })
	},
}

export default request
