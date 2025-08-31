/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import Box from "@mui/material/Box"
import CheckBox, { CheckboxProps } from "@mui/material/Checkbox"
import Button, { ButtonProps } from "@mui/material/Button"

import {
	DataGrid,
	GridRowsProp,
	GridRenderCellParams,
	DataGridProps,
	GridColDef,
	useGridApiContext,
	useGridApiRef,
} from "@mui/x-data-grid"

import useTodoStore from "@/shared/zustand/todos"
import { requestEditRoles, requestGetRoles } from "./request"
import { TRole, TRolesRow } from "@/shared/types/roles"

import { RolesWrapperSx } from "./styled"
import Error from "next/error"

const valueGetter = (value: string, row: any, column: GridColDef) => {
	const field = column.field,
		fieldPermissions = `${field}Permissions`

	const permissions = row[fieldPermissions]

	return permissions.includes(value)
}

const RenderCheckBox = (props: GridRenderCellParams) => {
	const apiRef = useGridApiContext()

	const row = props.row,
		field = props.field

	const rowPermissionsFieldName = field + "Permissions",
		permissions = row[rowPermissionsFieldName]

	let dupPermissions = [...permissions]

	const checkBoxProps: CheckboxProps = {
		size: "small",
		checked: props.value,
		onChange: () => {
			const rowIds = apiRef.current.getAllRowIds()
			const newRows = []

			if (dupPermissions.includes(row[field])) {
				dupPermissions = dupPermissions.filter(
					(perm) => perm != row[field],
				)
			} else {
				dupPermissions.push(row[field])
			}

			for (let i = 0; i < rowIds.length; i++) {
				const row = { ...apiRef.current.getRow(rowIds[i]) }

				row[rowPermissionsFieldName] = dupPermissions

				newRows.push(row)
			}

			apiRef.current.setRows(newRows)
		},
	}
	return <CheckBox {...checkBoxProps} />
}

const columns: GridColDef[] = [
	{ field: "permissionName", headerName: "PERMISSIONS", width: 250 },
	{
		field: "roleIdAdmin",
		headerName: "ADMIN",
		align: "center",
		headerAlign: "center",
		width: 100,
		renderCell: (params) => <RenderCheckBox {...params} />,
		valueGetter: valueGetter,
	},
	{
		field: "roleIdMember",
		headerName: "MEMBER",
		align: "center",
		headerAlign: "center",
		width: 100,
		renderCell: (params) => <RenderCheckBox {...params} />,
		valueGetter: valueGetter,
	},
]

const Roles = () => {
	const apiRef = useGridApiRef()
	const { user } = useTodoStore()
	const getRolesQuery = requestGetRoles(user.roleId)
	const editRolesMutation = requestEditRoles()

	const error = getRolesQuery.error as unknown as Error & {
		[key: string]: any
	}

	if (getRolesQuery.isLoading) return null

	if (error && error.statusCode === 401) return <Box>401</Box>

	const {
		rows = [],
		roles = [],
		duplicateRows = [],
	} = getRolesQuery.data as {
		rows: TRolesRow[]
		roles: TRole[]
		duplicateRows: TRolesRow[]
	}

	const handleSave = () => {
		if (apiRef.current) {
			const rowIds = apiRef.current.getAllRowIds()[0]
			const row = apiRef.current.getRow(rowIds)

			const updatedRoles = roles.map((role) => {
				const permissionsField = `roleId${role.roleName}Permissions`

				return { ...role, permissions: row[permissionsField] }
			})

			editRolesMutation.mutate(updatedRoles)
		}
	}

	const handleCancel = () => {
		if (apiRef.current) apiRef.current.setRows(duplicateRows)
	}

	const dataGridProps: DataGridProps = {
		apiRef: apiRef,
		columns: columns,
		rows: rows,

		rowHeight: 40,
		columnHeaderHeight: 40,

		disableColumnMenu: true,
		disableColumnResize: true,
		disableColumnSorting: true,
		hideFooter: true,
	}

	const buttonCancelProps: ButtonProps = {
			size: "small",
			variant: "outlined",
			color: "primary",
			onClick: handleCancel,
		},
		buttonSaveProps: ButtonProps = {
			size: "small",
			variant: "contained",
			color: "success",
			onClick: handleSave,
		}

	return (
		<Box sx={RolesWrapperSx}>
			<Box>
				<DataGrid {...dataGridProps} />
			</Box>
			<Box className="action-wrapper">
				<Button {...buttonCancelProps}>Cancel</Button>
				<Button {...buttonSaveProps}>Save</Button>
			</Box>
		</Box>
	)
}

export default Roles
