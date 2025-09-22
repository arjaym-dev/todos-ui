"use client"

import React from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import Box from "@mui/material/Box"

import Sidebar from "@/container/sidebar"

import { DashboardWrapper } from "./styled"

// Create a client
const queryClient = new QueryClient()

export default function ContentLayout({
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

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
