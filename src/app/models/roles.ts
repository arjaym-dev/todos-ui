import mongoose from "mongoose"

export interface Roles extends mongoose.Document {
	roleId: string
	roleName: string
	permissions: string[]
}

const RolesSchema = new mongoose.Schema<Roles>({
	roleId: { type: String, required: [true, "Role ID is required"] },
	roleName: { type: String, required: [true, "Role name is required"] },
	permissions: { type: [], required: [true, "Permissions is required"] },
})

export default mongoose.models.Roles || mongoose.model<Roles>("Roles", RolesSchema)
