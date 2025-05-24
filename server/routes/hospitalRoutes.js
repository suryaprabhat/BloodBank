import express from "express";
import bcrypt from "bcryptjs";
import Hospital from "../models/Hospital.js";

const router = express.Router();

// Hospital Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Hospital Login Attempt:", email);

  try {
    // Make email search case-insensitive
    const hospital = await Hospital.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!hospital) {
      console.log("Hospital not found");
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Since the password in DB is not hashed, do a direct comparison
    if (password !== hospital.password) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Don't send password in response
    const hospitalResponse = hospital.toObject();
    delete hospitalResponse.password;

    console.log("Hospital login successful:", hospitalResponse);
    res.status(200).json({ message: "Login successful", hospital: hospitalResponse });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Hospital Registration
router.post("/register", async (req, res) => {
  const { name, email, password, location, phone } = req.body;

  try {
    let hospital = await Hospital.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    if (hospital) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    hospital = new Hospital({
      name,
      email,
      password, // Store password as is for now
      location,
      phone,
      bloodAvailability: {
        "A+": 0, "A-": 0,
        "B+": 0, "B-": 0,
        "AB+": 0, "AB-": 0,
        "O+": 0, "O-": 0
      }
    });

    await hospital.save();

    // Don't send password in response
    const hospitalResponse = hospital.toObject();
    delete hospitalResponse.password;

    res.status(201).json({ message: "Hospital registered successfully", hospital: hospitalResponse });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update blood availability
router.put("/:id", async (req, res) => {
  const { bloodAvailability } = req.body;
  console.log('Updating blood availability for hospital:', req.params.id);
  console.log('New blood availability:', bloodAvailability);
  
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { bloodAvailability },
      { new: true }
    );

    if (!hospital) {
      console.log('Hospital not found:', req.params.id);
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Don't send password in response
    const hospitalResponse = hospital.toObject();
    delete hospitalResponse.password;

    console.log('Update successful. New hospital data:', hospitalResponse);
    res.json({ message: "Blood availability updated", hospital: hospitalResponse });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get hospital by ID
router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Don't send password in response
    const hospitalResponse = hospital.toObject();
    delete hospitalResponse.password;

    res.json(hospitalResponse);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router; 