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
    alertPreferences: {
      receiveAlerts: true,
      alertRadius: 10,
      urgencyLevel: "All"
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('alertPreferences.')) {
      const prefName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        alertPreferences: {
          ...prev.alertPreferences,
          [prefName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

          {/* Alert Preferences Section */}
          <div className="alert-preferences">
            <h3>Alert Preferences</h3>
            <div className="preference-item">
              <input
                type="checkbox"
                name="alertPreferences.receiveAlerts"
                checked={formData.alertPreferences.receiveAlerts}
                onChange={handleChange}
                id="receiveAlerts"
              />
              <label htmlFor="receiveAlerts">Receive Blood Request Alerts</label>
            </div>
            <div className="preference-item">
              <label>Alert Radius (km)</label>
              <input
                type="number"
                name="alertPreferences.alertRadius"
                value={formData.alertPreferences.alertRadius}
                onChange={handleChange}
                min={1}
                max={100}
              />
            </div>
            <div className="preference-item">
              <label>Urgency Level</label>
              <select
                name="alertPreferences.urgencyLevel"
                value={formData.alertPreferences.urgencyLevel}
                onChange={handleChange}
              >
                <option value="All">All Requests</option>
                <option value="Urgent">Urgent Only</option>
                <option value="Normal">Normal Only</option>
              </select>
            </div>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
