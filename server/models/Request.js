import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  urgency: { type: String, default: "Normal" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Request", requestSchema); 