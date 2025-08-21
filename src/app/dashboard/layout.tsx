"use client"

import Box from "@mui/material/Box"

import Sidebar from "@/app/dashboard/sidebar"
import { DashboardWrapper } from "./styled"

export default function RootLayout({
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
