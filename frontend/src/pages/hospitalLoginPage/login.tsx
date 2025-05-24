import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/card/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHospitalAuth } from "../../context/HospitalAuthContext";
import toast from "react-hot-toast";
import axiosInstance from "@/axios";

const HospitalLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loginHospital } = useHospitalAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email.includes("@") || password.length < 6) {
            setError("Invalid email or password (min 6 characters).");
            return;
        }
        try {
            const response = await axiosInstance.post("/hospitals/login", { email, password });
            const hospital = response.data.hospital;
            loginHospital(hospital);
            toast.success(`Welcome, ${hospital.name}!`);
            navigate("/hospital/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Login failed";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-[350px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-center">Hospital Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button className="w-full" onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HospitalLogin; 