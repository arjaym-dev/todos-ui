import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"

export const DashboardWrapper = styled(Box)`
	display: flex;
	height: 100vh;

	.sidebar {
		width: 200px;
		border-right: 1px solid #333;
		padding: 20px 10px;
	}

	.content {
		padding: 30px;
		width: 100%;
	}
`
