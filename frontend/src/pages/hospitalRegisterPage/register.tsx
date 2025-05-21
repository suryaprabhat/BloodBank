import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/axios";
import "../registerPage/register.scss";

const HospitalRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        location: "",
        phone: "",
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/hospitals/register", formData);
            toast.success(response.data.message);
            navigate("/hospital/login");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Registration failed";
            toast.error(message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Hospital Registration</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Hospital Name"
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
                    <input
                        type="text"
                        name="location"
                        placeholder="Location (City, State)"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default HospitalRegister; 