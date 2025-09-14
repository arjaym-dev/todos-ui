import { create } from "zustand"
import { persist } from "zustand/middleware"

import { TEditTask } from "../types/todos"
import { TUser } from "../types/user"

type State = {
	formMode: "CREATE" | "EDIT" | "DELETE" | ""
	edit: TEditTask

	user: TUser
	initialState: {
		formMode: "CREATE" | "EDIT" | "DELETE" | ""
		edit: TEditTask
		user: TUser
	}
}

type Action = {
	setFormMode: (payload: "CREATE" | "EDIT" | "DELETE" | "") => void
	setEditTask: (payload: TEditTask) => void
	setUser: (payload: TUser) => void
}

const useTodoStore = create<State & Action>()(
	persist(
		(set) => ({
			initialState: {
				formMode: "CREATE",
				edit: { userId: "", _id: "", task: "" },
				user: { _id: "", username: "", roleId: "" },
			},
			formMode: "CREATE",
			edit: { userId: "", _id: "", task: "" },
			user: { _id: "", username: "", roleId: "" },
			setFormMode: (payload) => set(() => ({ formMode: payload })),
			setEditTask: (payload: TEditTask) =>
				set(() => ({ edit: { ...payload } })),
			setUser: (payload: TUser) => set(() => ({ user: payload })),
		}),
		{ name: "todos", partialize: (state) => ({ user: state.user }) },
	),
)

export default useTodoStore
