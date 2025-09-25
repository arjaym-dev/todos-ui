"use client"

import React from "react"
import { useRouter, usePathname, notFound } from "next/navigation"

import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"

import DashboardIcon from "@mui/icons-material/Dashboard"
import AssignmentIcon from "@mui/icons-material/Assignment"
import FingerprintIcon from "@mui/icons-material/Fingerprint"
import LogoutIcon from "@mui/icons-material/Logout"

import useTodoStore from "@/shared/zustand/todos"

import { requestDeleteLogout, requestGetNavlinks } from "./request"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type TNavItem = { path: string; name: string; router: AppRouterInstance }

const NavItem: React.FC<TNavItem> = (props) => {
	let icon: React.ReactElement = <DashboardIcon />

	const handleNavigate = () => {
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
	const router = useRouter(),
		pathname = usePathname()

	const { user } = useTodoStore()

	const handleLogout = () => {
		logoutMutation.mutate()
	}

	const handleOnSuccess = () => {
		router.push("/")
	}

	const { data: navlinks = [] as TNavItem[], isPending } = requestGetNavlinks(
		user.token,
	)

	const logoutMutation = requestDeleteLogout(
		{ onSuccess: handleOnSuccess },
		user.token,
	)

	if (isPending) {
		return (
			<Box className="sidebar">
				<SkeletonLoading />
			</Box>
		)
	} else {
		// const navSet = new Set(
		// 		navlinks.map((nav: TNavItem) => nav.path),
		// 	) as Set<string>,
		// 	hasNavlinks = navSet.has(pathname)
		// if (!hasNavlinks) {
		// 	console.log("navlinks", navlinks)
		// 	router.push(navlinks[0].path)
		// }
	}

	return (
		<Box className="sidebar">
			<List component={"nav"}>
				{navlinks.map((nav: TNavItem, index: number) => (
					<NavItem {...nav} key={index} router={router} />
				))}
			</List>
			<ListItemButton onClick={handleLogout}>
				<ListItemIcon>
					<LogoutIcon />
				</ListItemIcon>
				<ListItemText>Logout</ListItemText>
			</ListItemButton>
		</Box>
	)
}

export default Sidebar
