"use client"

import React from "react"

import Box from "@mui/material/Box"

import Sidebar from "@/container/sidebar"
import { DashboardWrapper } from "./styled"

export default function QueryWrapper({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<DashboardWrapper>
			<Sidebar />
			<Box className="content">{children}</Box>
		</DashboardWrapper>
	)
}
