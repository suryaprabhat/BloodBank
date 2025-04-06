import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fixed CORS syntax
app.use(cors({
  origin: ["https://blood-bank-tau-plum.vercel.app","http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ✅ Mongoose Schema
const donorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bloodGroup: String,
  location: String,
  phone: String,
});

const Donor = mongoose.model("Donor", donorSchema);

// ✅ Register new donor
app.post("/api/donors", async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    await newDonor.save();
    res.status(201).json({ message: "Donor registered", donor: newDonor });
  } catch (err) {
    res.status(500).json({ message: "Failed to register", error: err.message });
  }
});

//Request Schema
// ✅ POST: Create a new blood request
app.post("/api/request-blood", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Request submitted", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit request", error: err.message });
  }
});


// ✅ Login route
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

// ✅ Get Profile
app.get("/api/profile/:email", async (req, res) => {
  try {
    const user = await Donor.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

// ✅ GET all donors (with optional filtering by blood group and location)
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

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
