/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { TEditTask } from "../types/todos"

type State = { formMode: "CREATE" | "EDIT" | "DELETE" | ""; edit: TEditTask }

type Action = {
	setFormMode: (payload: "CREATE" | "EDIT" | "DELETE" | "") => void
	setEditTask: (payload: TEditTask) => void
}

const useTodoStore = create<State & Action>((set) => ({
	formMode: "CREATE",
	edit: { userId: "", taskId: "", task: "" },
	setFormMode: (payload) => set(() => ({ formMode: payload })),
	setEditTask: (payload: TEditTask) => set(() => ({ edit: { ...payload } })),
}))

export default useTodoStore
