import mongoose, {model, Schema, Types} from "mongoose";

export const chatSchema = new Schema(
  {
    Sender: {type: Types.ObjectId, ref: "User", required: true},
    Receiver: {type: Types.ObjectId, ref: "User", required: true},
    messages: [
      {
        message: {type: String, required: true},
        senderId: {type: Types.ObjectId, ref: "User", required: true},
      },
    ],
  },
  {timestamps: true}
);

export const chatModel =
  mongoose.models.chatModel || model("chatModel", chatSchema);
