import {
	expect,
	test,
	vi,
	it,
	describe,
	beforeAll,
	afterEach,
	afterAll,
} from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import userEvent from "@testing-library/user-event"

import Login from "./index"

import ENV from "@/shared/lib/env"

// Create a client
const queryClient = new QueryClient()

const handlers = [
	http.post(ENV.NEXT_PUBLIC_REQUEST_BASE_QUERY + "/login", () => {
		return HttpResponse.json(
			{ username: "Username does not exist" },
			{ status: 400 },
		)
	}),
]

const server = setupServer(...handlers)

// Start server before all tests, close after all tests, and reset handlers after each test
beforeAll(() => server.listen())
afterEach(() => {
	server.resetHandlers()
	cleanup()
})
afterAll(() => server.close())
// ------------------------

vi.mock("next/navigation")

describe("Render Login Page", () => {
	const user = userEvent.setup()

	it("Should render login form", () => {
		// Arrange
		render(
			<QueryClientProvider client={queryClient}>
				<Login />
			</QueryClientProvider>,
		)

		const username = screen.getByTestId("username")
		const password = screen.getByTestId("password")
		const loginButton = screen.getByTestId("login-button")

		// Act

		// Assert
		expect(username).toBeTruthy()
		expect(password).toBeTruthy()
		expect(loginButton).toBeTruthy()
	})

	it("Should login and check username", async () => {
		// Arrange
		render(
			<QueryClientProvider client={queryClient}>
				<Login />
			</QueryClientProvider>,
		)

		const username = screen.getByTestId("username")
		const password = screen.getByTestId("password")
		const loginButton = screen.getByTestId("login-button")

		// Act
		await user.type(username, "admin1")
		await user.type(password, "123456")
		await user.click(loginButton)

		// Assert
		const error = screen.getByTestId("username-error")
	})

	it("Should login and check password", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<Login />
			</QueryClientProvider>,
		)

		// Fill-up form
	})
})
