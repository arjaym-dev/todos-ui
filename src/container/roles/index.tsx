import React from "react"
import Box from "@mui/material/Box"

import useTodoStore from "@/shared/zustand/todos"
import { requestGetRoles } from "./request"

const Roles = () => {
	const { user } = useTodoStore()

	const { data, isPending } = requestGetRoles(user.roleId)

	if (isPending) return null
	console.log(data)
	return <Box></Box>
}

export default Roles
