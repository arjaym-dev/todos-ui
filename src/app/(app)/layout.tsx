"use client"

import React from "react"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Create a client
const queryClient = new QueryClient()

import QueryWrapper from "./query-wrapper"
export default function ContentLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			<QueryWrapper>{children}</QueryWrapper>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
