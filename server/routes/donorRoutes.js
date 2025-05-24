import express from "express";
import Donor from "../models/Donor.js";
import Request from "../models/Request.js";

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

// GET: Fetch alerts for a specific donor
router.get("/:id/alerts", async (req, res) => {
  try {
    console.log("Fetching alerts for donor ID:", req.params.id);
    
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      console.log("Donor not found with ID:", req.params.id);
      return res.status(404).json({ message: "Donor not found" });
    }

    console.log("Found donor:", donor.name, "Alert preferences:", donor.alertPreferences);

    // Only fetch alerts if the donor has enabled them
    if (!donor.alertPreferences?.receiveAlerts) {
      console.log("Alerts disabled for donor:", donor.name);
      return res.json([]);
    }

    // Fetch blood requests based on donor preferences
    const query = {
      bloodGroup: donor.bloodGroup
    };

    // Filter by urgency if donor has specific preference
    if (donor.alertPreferences.urgencyLevel !== "All") {
      query.urgency = donor.alertPreferences.urgencyLevel;
    }

    console.log("Fetching requests with query:", query);
    const requests = await Request.find(query);
    console.log("Found", requests.length, "matching requests");

    // Filter requests by distance and add distance field
    const alertRadius = donor.alertPreferences.alertRadius;
    const alertsWithDistance = requests
      .map(request => {
        // Calculate distance (this is a simplified version, you might want to use actual geolocation)
        const distance = Math.random() * alertRadius * 2; // Temporary random distance for demo
        return {
          ...request.toObject(),
          distance
        };
      })
      .filter(request => request.distance <= alertRadius)
      .sort((a, b) => a.distance - b.distance);

    console.log("Returning", alertsWithDistance.length, "alerts within radius", alertRadius);
    res.json(alertsWithDistance);
  } catch (error) {
    console.error("Error fetching alerts:", error.message);
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

export default router;
