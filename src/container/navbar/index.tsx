import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"

import MenuIcon from "@mui/icons-material/Menu"

import useSettingStore from "@/shared/zustand/profile"

import { AppBar } from "./styled"
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
					aria-label="open drawer"
					onClick={handleToggleSidebar}
					edge="start"
					sx={[{ marginRight: 5 }, sidebar && { display: "none" }]}>
					<MenuIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}

export default NavBar
