"use client"

import React from "react"

import Box from "@mui/material/Box"

import Sidebar from "@/container/sidebar"
import NavBar from "@/container/navbar"
import { DrawerHeader } from "@/container/sidebar/styled"
import { DashboardWrapper } from "./styled"

export default function QueryWrapper({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<DashboardWrapper>
			<NavBar />
			<Sidebar />
			<Box className="content">
				<DrawerHeader />
				{children}
			</Box>
		</DashboardWrapper>
	)
}
