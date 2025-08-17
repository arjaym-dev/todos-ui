import mongoose from "mongoose"

export interface Todos extends mongoose.Document {
	userId: string
	task: string
}

const TodosSchema = new mongoose.Schema<Todos>({
	userId: { type: String, required: [true, "UserID is required"] },
	task: { type: String, required: [true, "Task is required"] },
})

export default mongoose.models.Todos ||
	mongoose.model<Todos>("Todos", TodosSchema)
