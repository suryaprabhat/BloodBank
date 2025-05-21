import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Log the MONGO_URI to verify it's being read

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: ["https://blood-bank-tau-plum.vercel.app", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ✅ Donor Schema
const donorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bloodGroup: String,
  location: String,
  phone: String,
});
const Donor = mongoose.model("Donor", donorSchema);

// ✅ Request Schema (with lat/lng)
const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },     // 🆕 added
  longitude: { type: Number, required: true },    // 🆕 added
  urgency: { type: String, default: "Normal" },
  createdAt: { type: Date, default: Date.now },
});
const Request = mongoose.model("Request", requestSchema);

// 🏥 Hospital Schema
const hospitalSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  phone: String,
  bloodAvailability: {
    "A+": { type: Number, default: 0 },
    "A-": { type: Number, default: 0 },
    "B+": { type: Number, default: 0 },
    "B-": { type: Number, default: 0 },
    "AB+": { type: Number, default: 0 },
    "AB-": { type: Number, default: 0 },
    "O+": { type: Number, default: 0 },
    "O-": { type: Number, default: 0 },
  },
});
const Hospital = mongoose.model("Hospital", hospitalSchema);

// ✅ POST: Register new donor
app.post("/api/donors", async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    await newDonor.save();
    res.status(201).json({ message: "Donor registered", donor: newDonor });
  } catch (err) {
    res.status(500).json({ message: "Failed to register", error: err.message });
  }
});

// ✅ POST: Submit blood request
app.post("/api/request-blood", async (req, res) => { 
  try {
    const { location } = req.body
    let [latitude, longitude] = location.split(",");
    console.log(req.body);

    // Convert strings to numbers
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    // Validate the parsed numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "latitude and longitude must be valid numbers" });
    }

    // Assign the parsed numbers back to req.body
    req.body.latitude = latitude;
    req.body.longitude = longitude;

    console.log(req.body);

    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Request submitted", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit request", error: err.message });
  }
});

// ✅ GET: All blood requests
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
});

// ✅ POST: Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Donor.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ✅ GET: Profile by email
app.put("/api/profile/:email", async (req, res) => {
  try {
    const updatedDonor = await Donor.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true } // return updated doc
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(updatedDonor);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

// ✅ GET: Donors with optional filters
app.get("/api/donors", async (req, res) => {
  try {
    const { bloodGroup, location } = req.query;
    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (location) filter.location = location;

    const donors = await Donor.find(filter);
    res.status(200).json(donors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching donors", error: err.message });
  }
});

// 🏥 POST: Hospital registration
app.post("/api/hospitals/register", async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    await newHospital.save();
    res.status(201).json({ message: "Hospital registered", hospital: newHospital });
  } catch (err) {
    res.status(500).json({ message: "Failed to register hospital", error: err.message });
  }
});

// 🏥 POST: Hospital login
app.post("/api/hospitals/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hospital = await Hospital.findOne({ email });
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    if (hospital.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful", hospital });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// 🏥 GET: Hospital profile by ID
app.get("/api/hospitals/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json(hospital);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hospital", error: err.message });
  }
});

// 🏥 PUT: Update blood availability
app.put("/api/hospitals/:id", async (req, res) => {
  try {
    const { bloodAvailability } = req.body;
    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { bloodAvailability },
      { new: true }
    );
    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json({ message: "Availability updated", hospital: updatedHospital });
  } catch (err) {
    res.status(500).json({ message: "Failed to update availability", error: err.message });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
