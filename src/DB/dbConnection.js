import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log("DB Connected");
    })
    .catch((error) => {
      console.error("Fail To Connect To DB");
    });
};
