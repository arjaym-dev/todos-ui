import MuiDrawer, { DrawerProps } from "@mui/material/Drawer"

import { Theme, CSSObject, styled } from "@mui/material/styles"
type CustomDrawerProps = DrawerProps & { drawerWidth: number; open: boolean }

const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: { width: `calc(${theme.spacing(8)} + 1px)` },
})

export const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}))

export const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<CustomDrawerProps>(({ theme, drawerWidth }) => {
	return {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		boxSizing: "border-box",
		variants: [
			{
				props: ({ open }) => open,
				style: {
					...openedMixin(theme, drawerWidth),
					"& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
				},
			},
			{
				props: ({ open }) => !open,
				style: {
					...closedMixin(theme),
					"& .MuiDrawer-paper": closedMixin(theme),
				},
			},
		],
	}
})
