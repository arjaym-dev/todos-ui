"use client"

import React from "react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"

import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AssignmentIcon from "@mui/icons-material/Assignment"
import FingerprintIcon from "@mui/icons-material/Fingerprint"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import useTodoStore from "@/shared/zustand/todos"
import useSettingStore from "@/shared/zustand/profile"

import { Drawer, DrawerHeader } from "./styled"
import { requestGetNavlinks } from "./request"

type TNavItem = { path: string; name: string; router: AppRouterInstance }

const NavItem: React.FC<TNavItem> = (props) => {
	const { sidebar, setSettingSidebar } = useSettingStore()

	let icon: React.ReactElement = <DashboardIcon />

	const handleNavigate = () => {
		if (!sidebar) setSettingSidebar()

		props.router.push(props.path)
	}

	if (props.name === "Todos") {
		icon = <AssignmentIcon />
	} else if (props.name === "Roles") {
		icon = <FingerprintIcon />
	}

	return (
		<ListItemButton onClick={handleNavigate}>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText>{props.name}</ListItemText>
		</ListItemButton>
	)
}

const SkeletonLoading = () => {
	return (
		<ListItemButton>
			<ListItemIcon>
				<Skeleton variant="rectangular" width={24} height={24} />
			</ListItemIcon>
			<ListItemText>
				<Skeleton variant="text" height={24} />
			</ListItemText>
		</ListItemButton>
	)
}

const Sidebar = () => {
	const router = useRouter()

	const { sidebar, drawerWidth, setSettingSidebar } = useSettingStore()
	const { user } = useTodoStore()

	const handleToggleSidebar = () => {
		setSettingSidebar()
	}
	const { data: navlinks = [] as TNavItem[], isPending } = requestGetNavlinks(
		user.token,
	)

	if (isPending) {
		return (
			<Box className="sidebar">
				<SkeletonLoading />
			</Box>
		)
	}

	return (
		<React.Fragment>
			<Drawer
				variant="permanent"
				open={sidebar}
				drawerWidth={drawerWidth}>
				<DrawerHeader>
					<IconButton onClick={handleToggleSidebar}>
						{sidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{navlinks.map((nav: TNavItem, index: number) => (
						<NavItem {...nav} key={index} router={router} />
					))}
				</List>
			</Drawer>
		</React.Fragment>
	)
}

export default Sidebar
