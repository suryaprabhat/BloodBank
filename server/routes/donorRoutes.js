const express = require("express");
const Donor = require("../models/Donor");

const router = express.Router();

// GET: Fetch all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error.message);
    res.status(500).json({ error: "Server error, please try again!" });
  }
});

// POST: Register a new donor
router.post("/", async (req, res) => {
  try {
    const { name, email, password, bloodGroup, location } = req.body;

    if (!name || !email || !password || !bloodGroup || !location) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newDonor = new Donor({ name, email, password, bloodGroup, location });
    await newDonor.save();

    res.status(201).json({ message: "Donor registered successfully!", donor: newDonor });
  } catch (err) {
    console.error("Error creating donor:", err.message);
    res.status(500).json({ error: "Server error, please try again!" });
  }
});

module.exports = router;
