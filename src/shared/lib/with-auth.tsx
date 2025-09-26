import React from "react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

import useTodoStore from "@/shared/zustand/todos"
import { requestGetNavlinks } from "@/container/sidebar/request"

const withAuth = (Content: React.ComponentType) => {
	const Component = (props: any) => {
		const router = useRouter()
		const { user } = useTodoStore()

		const { data: navlinks, isPending } = requestGetNavlinks(user.token)

		let content = null

		React.useEffect(() => {
			if (isPending === false) {
				const navSet = new Set(
						navlinks.map(
							(nav: { name: string; path: string }) => nav.path,
						),
					) as Set<string>,
					hasNavlinks = navSet.has("/dashboard")

				console.log(hasNavlinks)
				if (hasNavlinks === false) {
					router.push(navlinks[0].path)
				}
			}
		}, [isPending, navlinks])

		if (isPending)
			return (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</Box>
			)

		return <Content {...props} />
	}

	return Component
}

export default withAuth
