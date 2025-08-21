import TableContainer from "@mui/material/TableContainer"

import { styled } from "@mui/material/styles"

export const TableContainerWrapper = styled(TableContainer)`
	.searchbar {
		display: flex;
		column-gap: 10px;

		.MuiButtonBase-root {
			height: 40px;
		}
	}
	.MuiTableContainer-root {
		.MuiTableHead-root {
			.MuiTableRow-root {
				.MuiTableCell-root {
					&:nth-of-type(3) {
						width: 150px;
					}
				}
			}
		}

		.MuiTableBody-root {
			.MuiTableRow-root {
				.MuiTableCell-root {
					&:nth-of-type(3) {
						display: flex;
						column-gap: 10px;
					}
				}
			}
		}
	}
`
