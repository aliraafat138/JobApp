import mongoose, {model, Schema, Types} from "mongoose";
import {generateHash} from "../../Utilis/security/hash.js";
import {
  generateDecryption,
  generateEncryption,
} from "../../Utilis/security/encryption.js";
export const genderTypes = {male: "male", female: "female"};
export const roleTypes = {user: "user", admin: "admin"};
export const providerTypes = {google: "google", system: "system"};
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: function (data) {
        data?.provider === providerTypes.google ? false : true;
      },
    },
    lastName: {
      type: String,
      required: function (data) {
        data?.provider === providerTypes.google ? false : true;
      },
    },
    email: {type: String, required: true, unique: true},
    password: {
      type: String,
      required: function (data) {
        data?.provider === providerTypes.google ? false : true;
      },
    },
    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    DOB: {
      type: Date,
      required: function (data) {
        data?.provider === providerTypes.google ? false : true;
      },
      validate: {
        validator: function (value) {
          const currentDate = Date.now();
          const age = currentDate - 18 * 365 * 24 * 60 * 60 * 1000;
          return value <= age && value < currentDate;
        },
        message: "User must be greater Than 18 years",
      },
    },
    mobileNumber: {
      type: String,
      required: function (data) {
        data?.provider === providerTypes.google ? false : true;
      },
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    isConfirmed: {type: Boolean, default: false},
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: [{type: Types.ObjectId, ref: "User"}],
    changeCredentialTime: Date,
    profilePic: [{type: {secure_url: String, public_id: String}}],
    coverPic: [{type: {secure_url: String, public_id: String}}],
    OTP: [
      {
        code: {type: String},
        type: {type: String, enum: ["confirmEmail", "resetPassword"]},
        expiresIn: {type: Date},
      },
    ],
  },

  {timestamps: true}
);
userSchema
  .virtual("userName")
  .set(function (value) {
    this.firstName = value.split(" ")[0];
    this.lastName = value.split(" ")[1];
  })
  .get(function () {
    return this.firstName + "" + this.lastName;
  });
userSchema.pre("save", function (next, doc) {
  this.password = generateHash({plainText: this.password});
  next();
});
userSchema.pre("save", function (next, doc) {
  this.mobileNumber = generateEncryption({plainText: this.mobileNumber});
  next();
});
userSchema.post("findOne", function (doc) {
  if (doc) {
    doc.mobileNumber = generateDecryption({cypherText: doc.mobileNumber});
  }
});
export const userModel = mongoose.models.User || model("User", userSchema);
