import mongoose from "mongoose";

export interface Permissions extends mongoose.Document {
  name: string;
}

const PermissionsSchema = new mongoose.Schema<Permissions>({
  name: {
    type: String,
    required: [true, "Permissions is required"],
  },
});

export default mongoose.models.Permissions ||
  mongoose.model<Permissions>("Permissions", PermissionsSchema);
