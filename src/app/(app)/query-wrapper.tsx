"use client"

import React from "react"
import { useQueryClient } from "@tanstack/react-query"

import Box from "@mui/material/Box"

import Sidebar from "@/container/sidebar"
import { DashboardWrapper } from "./styled"

export default function QueryWrapper({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<DashboardWrapper>
			<Box className="sidebar">
				<Sidebar />
			</Box>
			<Box className="content">{children}</Box>
		</DashboardWrapper>
	)
}
