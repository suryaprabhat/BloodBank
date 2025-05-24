import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import Request from "./models/Request.js";
import Donor from "./models/Donor.js";

dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI); // Log the MONGO_URI to verify it's being read

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: ["https://blood-bank-tau-plum.vercel.app", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
  credentials: true,
}));
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// Use routes
app.use("/hospitals", hospitalRoutes);
app.use("/api/donors", donorRoutes);

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
    // Make email search case-insensitive
    const user = await Donor.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    // Convert to plain object and ensure _id is included
    const userResponse = user.toObject();
    console.log("Login successful for user:", userResponse);
    res.status(200).json({ message: "Login successful", user: userResponse });
  } catch (err) {
    console.error("Login error:", err);
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

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
