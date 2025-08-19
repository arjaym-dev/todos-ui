/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import Login from "@/pages/login"

// Create a client
const queryClient = new QueryClient()

export default function Home() {
	return (
		<QueryClientProvider client={queryClient}>
			<Login />
		</QueryClientProvider>
	)
}
