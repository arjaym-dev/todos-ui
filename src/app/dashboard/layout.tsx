"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import Box from "@mui/material/Box"

import Sidebar from "@/app/dashboard/sidebar"
import { DashboardWrapper } from "./styled"

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			<DashboardWrapper>
				<Box className="sidebar">
					<Sidebar />
				</Box>
				<Box className="content">{children}</Box>
			</DashboardWrapper>
		</QueryClientProvider>
	)
}
