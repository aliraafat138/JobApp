import mongoose, {model, Schema, Types} from "mongoose";

export const companySchema = new Schema(
  {
    companyName: {type: String, required: true},
    description: {type: String, required: true},
    industry: {type: String, required: true},
    address: {type: String, required: true},
    numberOfEmployees: {type: String, enum: ["11-20"]},
    companyEmail: {type: String, unique: true, required: true},
    createdBy: [{type: Types.ObjectId, ref: "User"}],
    Logo: [{secure_url: String, public_id: String}],
    coverPic: [{secure_url: String, public_id: String}],
    HRs: [{type: Types.ObjectId, ref: "User"}],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: [{secure_url: String, public_id: String}],
    approvedByAdmin: Boolean,
  },
  {timestamps: true}
);
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
});

export const companyModel =
  mongoose.models.Company || model("Company", companySchema);
