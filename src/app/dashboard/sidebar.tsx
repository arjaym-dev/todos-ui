"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AssignmentIcon from "@mui/icons-material/Assignment"

type TNavItem = { path: string; name: string }

const navlinks: TNavItem[] = [
	{ path: "/dashboard", name: "Dashboard" },
	{ path: "/dashboard/todos", name: "Todos" },
]

const NavItem: React.FC<TNavItem> = (props) => {
	const router = useRouter()
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	let icon: React.ReactElement = <DashboardIcon />

	const handleNavigate = () => {
		router.push(props.path)
	}

	if (props.name === "Todos") {
		icon = <AssignmentIcon />
	}

	return (
		<ListItemButton onClick={handleNavigate}>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText>{props.name}</ListItemText>
		</ListItemButton>
	)
}

const Sidebar = () => {
	const router = useRouter()
	const logoutMutation = useMutation({
		retry: false,
		mutationKey: ["logout"],
		mutationFn: async () => {
			await fetch("/api/logout", {
				method: "DELETE",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
			})
		},
		onSuccess: () => {
			router.push("/")
		},
	})

	const handleLogout = () => {
		logoutMutation.mutate()
	}

	return (
		<React.Fragment>
			<List component={"nav"}>
				{navlinks.map((nav, index) => (
					<NavItem key={index} {...nav} />
				))}
			</List>
			<ListItemButton onClick={handleLogout}>
				<ListItemIcon></ListItemIcon>
				<ListItemText>Logout</ListItemText>
			</ListItemButton>
		</React.Fragment>
	)
}

export default Sidebar
