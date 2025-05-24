import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true },
  alertPreferences: {
    receiveAlerts: { type: Boolean, default: true },
    alertRadius: { type: Number, default: 10 }, // in kilometers
    urgencyLevel: { type: String, enum: ['All', 'Urgent', 'Normal'], default: 'All' }
  }
});

export default mongoose.model("Donor", donorSchema);
