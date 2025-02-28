import mongoose, {model, Schema, Types} from "mongoose";
export const statusTypes = {
  pending: "pending",
  accepted: "accepted",
  viewed: "viewed",
  inConsideration: "inConsideration",
  rejected: "rejected",
};
export const applicationSchema = new Schema(
  {
    jobId: {type: Types.ObjectId, ref: "Job"},
    userId: {type: Types.ObjectId, ref: "User"},
    userCV: {secure_url: String, public_id: String},
    status: {
      type: String,
      enum: Object.values(statusTypes),
      default: statusTypes.pending,
    },
  },
  {timestamps: true}
);
export const applicationModel =
  mongoose.models.Application || model("Application", applicationSchema);
