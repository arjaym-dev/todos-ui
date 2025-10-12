import { create } from "zustand"
import { persist } from "zustand/middleware"

type State = { drawerWidth: 240; sidebar: boolean }

type Action = {
	setSettingState: (payload: { [key: string]: any }) => void
	setSettingSidebar: () => void
}

const useSettingStore = create<State & Action>()(
	persist(
		(set) => ({
			drawerWidth: 240,
			sidebar: false,
			setSettingState: (state) => set(() => state),
			setSettingSidebar: () =>
				set((state) => ({ sidebar: !state.sidebar })),
		}),
		{ name: "setting", partialize: (state) => ({}) },
	),
)

export default useSettingStore
