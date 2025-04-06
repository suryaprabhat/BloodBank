import { useState } from "react";
import "./register.scss"; // Import the SCSS file
import axiosInstance from "@/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the form data before sending the request
    console.log("Form Data being sent:", formData);

    try {
      const response = await axiosInstance.post("/donors", formData);
    
      // Axios throws on non-2xx responses, so no need for manual `if (response.ok)`
      alert(response.data.message); // Success message
    } catch (error: any) {
      console.error("Error connecting to the server:", error);
    
      // Show error message if available from backend
      const message = error.response?.data?.message || "Something went wrong.";
      alert(message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register as a Donor</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <select name="bloodGroup" onChange={handleChange} required>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location (City, State)"
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
