import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/card/card";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 👈 Get auth context
import toast from "react-hot-toast";
import axiosInstance from "@/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Use login from AuthContext

  const handleLogin = async () => {
    // Basic validation
    if (!email.includes("@") || password.length < 6) {
      setError(
        "Invalid email or password must be at least 6 characters long."
      );
      return;
    }

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      const user = response.data.user;

      console.log("✅ Login Success:", user);

      // Save user to global context
      login(user);

      // ✅ Show welcome message
      toast.success(`Welcome, ${user.name}!`);

      // Redirect to homepage
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Login</CardTitle>
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

export default Login;
