import React from "react"
import Box from "@mui/material/Box"
import CheckBox, { CheckboxProps } from "@mui/material/Checkbox"

import {
	DataGrid,
	GridRowsProp,
	GridRenderCellParams,
	DataGridProps,
	GridColDef,
} from "@mui/x-data-grid"

import useTodoStore from "@/shared/zustand/todos"
import { requestGetRoles } from "./request"

const RenderCheckBox = (props: GridRenderCellParams) => {
	const row = props.row,
		field = props.field

	const rowPermissionsFieldName = field + "Permissions",
		permissions = row[rowPermissionsFieldName]

	const value = permissions.includes(props.value)

	const checkBoxProps: CheckboxProps = {
		size: "small",
		checked: value,
		onChange: () => {},
	}
	return <CheckBox {...checkBoxProps} />
}

const columns: GridColDef[] = [
	{ field: "permissionName", headerName: "PERMISSIONS", width: 250 },
	{
		field: "roleIdAdmin",
		headerName: "ADMIN",
		width: 100,
		renderCell: (params) => <RenderCheckBox {...params} />,
	},
	{
		field: "roleIdMember",
		headerName: "MEMBER",
		width: 100,
		renderCell: (params) => <RenderCheckBox {...params} />,
	},
]

const Roles = () => {
	const { user } = useTodoStore()

	const { data, isPending } = requestGetRoles(user.roleId)

	if (isPending) return null

	const dataGridProps: DataGridProps = {
		columns: columns,
		rows: data,

		rowHeight: 40,
		columnHeaderHeight: 40,

		disableColumnMenu: true,
		disableColumnResize: true,
		disableColumnSorting: true,
		hideFooter: true,
	}

	return (
		<Box>
			<Box>
				<DataGrid {...dataGridProps} />
			</Box>
		</Box>
	)
}

export default Roles
