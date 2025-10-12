import React from "react"
import { useRouter } from "next/navigation"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"

import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MenuIcon from "@mui/icons-material/Menu"

import useSettingStore from "@/shared/zustand/profile"
import useTodoStore from "@/shared/zustand/todos"

import { AppBar } from "./styled"
import { requestDeleteLogout } from "./request"

const AvatarMenu = () => {
	const router = useRouter()
	const { user } = useTodoStore()

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const handleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => setAnchorEl(null)

	const handleLogout = () => {
		logoutMutation.mutate()
	}

	const handleOnSuccess = () => {
		router.push("/")
	}

	const logoutMutation = requestDeleteLogout(
		{ onSuccess: handleOnSuccess },
		user.token,
	)

	return (
		<React.Fragment>
			<IconButton className="avatar-menu" onClick={handleMenu}>
				<Avatar sx={{ width: 24, height: 24 }} />
			</IconButton>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>
		</React.Fragment>
	)
}

const NavBar = () => {
	const { drawerWidth, sidebar, setSettingSidebar } = useSettingStore()

	const handleToggleSidebar = () => {
		setSettingSidebar()
	}
	return (
		<AppBar open={sidebar} drawerWidth={drawerWidth}>
			<Toolbar>
				<IconButton
					color="inherit"
					className="menu"
					onClick={handleToggleSidebar}
					edge="start">
					<MenuIcon />
				</IconButton>
				<AvatarMenu />
			</Toolbar>
		</AppBar>
	)
}

export default NavBar
