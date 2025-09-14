"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import Login from "@/container/login"

// Create a client
const queryClient = new QueryClient()

export default function Home() {
	return (
		<QueryClientProvider client={queryClient}>
			<Login />
		</QueryClientProvider>
	)
}
