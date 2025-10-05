import {
	expect,
	vi,
	it,
	describe,
	beforeAll,
	afterEach,
	afterAll,
} from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import userEvent from "@testing-library/user-event"

import Login from "./index"

// Create a client
const queryClient = new QueryClient()
const loginUrl = "/api/login"

const server = setupServer()

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

		const username = screen.getByTestId("usernamee")
		const password = screen.getByTestId("passwordd")
		const loginButton = screen.getByTestId("login-buttonn")

		// Act

		// Assert
		expect(username).toBeTruthy()
		expect(password).toBeTruthy()
		expect(loginButton).toBeTruthy()
	})

	it("Should login and check username", async () => {
		server.use(
			http.post(loginUrl, () => {
				return HttpResponse.json(
					{ username: "Username does not exist" },
					{ status: 400 },
				)
			}),
		)

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
		vi.waitFor(() =>
			expect(screen.findByTestId("username-error")).toBeTruthy(),
		)
	})

	it("Should login and check password", async () => {
		server.use(
			http.post(loginUrl, () => {
				return HttpResponse.json(
					{ username: "Incorrect password" },
					{ status: 400 },
				)
			}),
		)
		render(
			<QueryClientProvider client={queryClient}>
				<Login />
			</QueryClientProvider>,
		)

		const username = screen.getByTestId("username")
		const password = screen.getByTestId("password")
		const loginButton = screen.getByTestId("login-button")

		// Act
		await user.type(username, "admin")
		await user.type(password, "invalid")
		await user.click(loginButton)

		// Assert
		vi.waitFor(() =>
			expect(screen.findByTestId("password-error")).toBeTruthy(),
		)
	})

	it("Should login successfully", async () => {
		server.use(
			http.post(loginUrl, () => {
				return HttpResponse.json(
					{
						_id: "68a073a519f1b86322b4af3c",
						username: "admin",
						roleId: "689de94faf2b60744cf395ff",
						token: "eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2OGEwNzNhNTE5ZjFiODYzMjJiNGFmM2MiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZUlkIjoiNjg5ZGU5NGZhZjJiNjA3NDRjZjM5NWZmIiwiZXhwaXJlc0F0IjoiMjAyNS0xMC0wNVQwNDoyODozNS43NThaIiwiaWF0IjoxNzU5NjM0OTE1LCJleHAiOjE3NTk2Mzg1MTV9.Y0Pwf-hN3u7asKy7t3Zn6dinfUIjYh6aBSptrgwTdWM",
					},
					{ status: 200 },
				)
			}),
		)

		render(
			<QueryClientProvider client={queryClient}>
				<Login />
			</QueryClientProvider>,
		)

		const username = screen.getByTestId("username")
		const password = screen.getByTestId("password")
		const loginButton = screen.getByTestId("login-button")

		// Act
		await user.type(username, "admin")
		await user.type(password, "invalid")
		await user.click(loginButton)
	})
})
