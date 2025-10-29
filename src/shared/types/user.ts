export type TUser = {
	_id: string
	username: string
	roleId: string
	token: string
	navlinks: { name: string; path: string }[]
}

export type TLink = { method: string; href: string; rel: string; name: string }
export type TLinks = TLink[]
