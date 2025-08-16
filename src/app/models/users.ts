import mongoose from "mongoose"

export interface Users extends mongoose.Document {
	username: string
	password: string
	roleId: string
}

const UsersSchema = new mongoose.Schema<Users>({
	username: { type: String, required: [true, "Username is required"] },
	password: {
		type: String,
		minLength: [6, "Password is min. of 6 chars."],
		required: [true, "Password is required"],
	},
	roleId: { type: String, required: [true, "Role is required"] },
})

export default mongoose.models.Users ||
	mongoose.model<Users>("Users", UsersSchema)
