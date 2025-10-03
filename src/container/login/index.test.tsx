import { expect, test, vi, it, describe } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

import Login from "./index"

vi.mock("next/navigation")

describe("Render Login Page", () => {
	it("Login Form", () => {
		// Arrange
		render(
			<QueryClientProvider client={queryClient}>
				<Login />
			</QueryClientProvider>,
		)

		// Act

		// Assert

		expect(screen.getByTestId("username")).toBeTruthy()
		expect(screen.getByTestId("password")).toBeTruthy()
		expect(screen.getByTestId("login-button")).toBeTruthy()
	})
})
