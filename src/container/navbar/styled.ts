import MuiAppBar, { AppBarProps } from "@mui/material/AppBar"
import { styled } from "@mui/material/styles"

type CustomAppBarProps = AppBarProps & { open?: boolean; drawerWidth: number }

export const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<CustomAppBarProps>(({ theme, drawerWidth }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				marginLeft: drawerWidth,
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(["width", "margin"], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
		},
	],
}))
