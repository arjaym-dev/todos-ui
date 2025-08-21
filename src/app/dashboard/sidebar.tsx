"use client"

import { useRouter } from "next/navigation"

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
	return (
		<List component={"nav"}>
			{navlinks.map((nav, index) => (
				<NavItem key={index} {...nav} />
			))}
		</List>
	)
}

export default Sidebar
