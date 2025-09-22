"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"

import DashboardIcon from "@mui/icons-material/Dashboard"
import AssignmentIcon from "@mui/icons-material/Assignment"
import FingerprintIcon from "@mui/icons-material/Fingerprint"

import useTodoStore from "@/shared/zustand/todos"

import { requestDeleteLogout, requestGetNavlinks } from "./request"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type TNavItem = { path: string; name: string }

const NavItem: React.FC<TNavItem> = (props) => {
	const router = useRouter()
	let icon: React.ReactElement = <DashboardIcon />

	const handleNavigate = () => {
		router.push(props.path)
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
	const { user } = useTodoStore()

	const handleLogout = () => {
		logoutMutation.mutate()
	}

	const handleOnSuccess = () => {
		router.push("/")
	}

	const { data: navlinks = [] as TNavItem[], isLoading } = requestGetNavlinks(
		user.token,
	)
	const logoutMutation = requestDeleteLogout(
		{ onSuccess: handleOnSuccess },
		user.token,
	)

	if (isLoading) return <SkeletonLoading />

	return (
		<React.Fragment>
			<List component={"nav"}>
				{navlinks.map((nav: TNavItem, index: number) => (
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
