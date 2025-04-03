import React, { useState } from "react";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import { Card, CardContent, CardTitle } from "../../components/card/card";
import { useNavigate } from "react-router-dom";

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

  // Blood Group Options
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Validation rules
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

    if (e.target.name === "location" && e.target.value.trim() === "") {
      setErrors({ ...errors, location: "Location is required" });
    } else {
      setErrors({ ...errors, location: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any errors exist before submitting
    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const response = await fetch("/api/request-blood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Blood request submitted successfully!");
      navigate("/thank-you");
    } else {
      alert("Error submitting request.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="p-6 w-96 shadow-lg">
        <CardTitle className="text-center">Request Blood</CardTitle>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border rounded" required>
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup}</p>}

            <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

            <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>

            <Button type="submit" className="w-full bg-red-500">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestBlood;
