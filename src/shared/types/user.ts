export type TUser = {
	_id: string
	username: string
	roleId: string
	token: string
	navlinks: { name: string; path: string }[]
}
