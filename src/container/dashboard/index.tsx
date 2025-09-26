"use client"

import React from "react"
import Box from "@mui/material/Box"

import withAuth from "@/shared/lib/with-auth"

const Dashboard = () => {
	return (
		<Box>
			<h1> Dashboard Content</h1>
		</Box>
	)
}

export default withAuth(Dashboard)
