import React, { useState } from "react";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import { Card, CardContent, CardTitle } from "../../components/card/card";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios";
import LeafletMap from "../../components/leaflet/LeafletMap";
import { hospitalMockData } from "@/data/hospitalMockData";

const RequestBlood = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    location: "",
    urgency: "Normal",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    location: "",
  });

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  console.log("selectedLocation", selectedLocation);
  const [showMap, setShowMap] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "phone" && !/^\d{10}$/.test(e.target.value)) {
      setErrors({ ...errors, phone: "Phone number must be exactly 10 digits" });
    } else {
      setErrors({ ...errors, phone: "" });
    }

    if (e.target.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
      setErrors({ ...errors, email: "Enter a valid email address" });
    } else {
      setErrors({ ...errors, email: "" });
    }

    if (e.target.name === "bloodGroup" && !bloodGroups.includes(e.target.value.toUpperCase())) {
      setErrors({ ...errors, bloodGroup: "Invalid blood group" });
    } else {
      setErrors({ ...errors, bloodGroup: "" });
    }

    if (e.target.name === "name" && e.target.value.trim() === "") {
      setErrors({ ...errors, name: "Name is required" });
    } else {
      setErrors({ ...errors, name: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location) {
      alert("Please select a location from the map.");
      return;
    }

    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      await axiosInstance.post("/request-blood", formData);
      alert("Blood request submitted successfully!");
      navigate("/thank you");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      const message = error.response?.data?.message || "Error submitting request.";
      alert(message);
    }
  };

  const handleMapSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    const formatted = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
    setFormData({ ...formData, location: formatted });
    setShowMap(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <Card className="p-6 w-[95%] md:w-[400px] shadow-lg">
        <CardTitle className="text-center">Request Blood</CardTitle>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup}</p>}

            <div>
              <Button type="button" onClick={() => setShowMap(!showMap)} className="mb-2 bg-blue-600 text-white w-full">
                {selectedLocation ? "Change Location on Map" : "Select Location on Map"}
              </Button>
              {selectedLocation && (
                <p className="text-green-600 text-sm">
                  Location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}
            </div>

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>

            <Button type="submit" className="w-full bg-red-500 text-white">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      {showMap && (
        <div className="w-full md:w-[600px] h-[400px] mt-8 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <LeafletMap
            onSelectLocation={handleMapSelect}
            hospitalLocations={hospitalMockData}
          />
        </div>
      )}
    </div>
  );
};

export default RequestBlood;
