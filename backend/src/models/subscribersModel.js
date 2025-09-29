import mongoose from "mongoose";

const subscribersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const subscribersModel = mongoose.model("subscribers", subscribersSchema);
export default subscribersModel;
