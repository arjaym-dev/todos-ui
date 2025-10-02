import React from "react"
import { useRouter, usePathname } from "next/navigation"

import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

import useTodoStore from "@/shared/zustand/todos"
import { decrypt } from "./token"

import { requestGetNavlinks } from "@/container/sidebar/request"

const withAuth = (Content: React.ComponentType) => {
	const Component = (props: any) => {
		const router = useRouter()
		const pathname = usePathname()

		const [render, setRender] = React.useState(false)

		const { user } = useTodoStore()

		const { data: navlinks = [], isPending } = requestGetNavlinks(
			user.token,
		)

		React.useLayoutEffect(() => {
			if (!isPending) {
				const navSet = new Set(
						navlinks.map(
							(nav: { name: string; path: string }) => nav.path,
						),
					) as Set<string>,
					hasNavlinks = navSet.has(pathname)

				if (!hasNavlinks && navlinks.length > 0) {
					router.push(navlinks[0].path)

					return
				}

				async function isAuth() {
					const token = await decrypt(user.token)

					if (token === "JWTExpired") router.push("/")
					return
				}

				isAuth()

				setRender(true)
			}
		}, [isPending])

		if (isPending) {
			return (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</Box>
			)
		}

		if (!render) return null

		return <Content {...props} />
	}

	return Component
}

export default withAuth
