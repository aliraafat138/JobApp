import mongoose, {model, Schema, Types} from "mongoose";
export const locationTypes = {
  onSite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};
export const seniorLevelTypes = {
  fresh: "fresh",
  junior: "junior",
  midLevel: "mid-level",
  senior: "senior",
  teamLead: "team-lead",
  cto: "cto",
};
export const workingTimeTypes = {
  partTime: "part-time",
  fullTime: "full-time",
};
export const jobSchema = new Schema(
  {
    jobTitle: {type: String, required: true},
    jobLocation: {
      type: String,
      enum: Object.values(locationTypes),
      required: true,
    },
    workingTime: {
      type: String,
      required: true,
      enum: Object.values(workingTimeTypes),
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: Object.values(seniorLevelTypes),
    },
    jobDescription: {type: String, required: true},
    technicalSkills: [{type: String, required: true}],
    softSkills: [{type: String, required: true}],
    addedBy: [{type: Types.ObjectId, ref: "User"}],
    updatedBy: [{type: Types.ObjectId, ref: "User"}],
    closed: {type: Boolean, default: false},
    companyId: {type: Types.ObjectId, ref: "Company"},
  },
  {timestamps: true}
);
jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});
export const jobModel = mongoose.models.Job || model("Job", jobSchema);
