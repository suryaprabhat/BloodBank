import mongoose from "mongoose";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the MONGO_URI from the .env file
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Test route to check if server is working
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true }
});

const Donor = mongoose.model('Donor', donorSchema);

// Route to create a new donor
app.post('/api/donors', async (req, res) => {
  try {
    const { name, email, password, bloodGroup, location } = req.body;

    // Log the request body to check if fields are coming in correctly
    console.log("Request Body:", req.body);

    if (!name || !email || !password || !bloodGroup || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newDonor = new Donor({
      name,
      email,
      password,
      bloodGroup,
      location
    });

    await newDonor.save();
    res.status(201).json({ message: 'Donor registered successfully', donor: newDonor });
  } catch (error) {
    console.error("Error creating donor:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to fetch all donors
app.get('/api/donors', async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: 'Failed to fetch donors', error: error.message });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
