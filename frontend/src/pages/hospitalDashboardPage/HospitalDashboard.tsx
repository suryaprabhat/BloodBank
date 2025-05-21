import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/axios";
import { useHospitalAuth, BloodAvailability, Hospital } from "../../context/HospitalAuthContext";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";

const HospitalDashboard = () => {
    const { hospital, loginHospital } = useHospitalAuth();
    const navigate = useNavigate();
    const [availability, setAvailability] = useState<BloodAvailability>({
        "A+": 0,
        "A-": 0,
        "B+": 0,
        "B-": 0,
        "AB+": 0,
        "AB-": 0,
        "O+": 0,
        "O-": 0,
    });

    useEffect(() => {
        if (!hospital) {
            navigate("/hospital/login");
            return;
        }
        // Fetch latest hospital data
        axiosInstance
            .get<Hospital>(`/hospitals/${hospital._id}`)
            .then((res) => {
                const data = res.data;
                setAvailability(data.bloodAvailability);
            })
            .catch((err) => {
                toast.error("Failed to fetch hospital data");
            });
    }, [hospital, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAvailability((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hospital) return;
        try {
            const res = await axiosInstance.put(
                `/hospitals/${hospital._id}`,
                { bloodAvailability: availability }
            );
            toast.success(res.data.message);
            // Update context
            loginHospital(res.data.hospital);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    if (!hospital) {
        return null; // or a loader
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Hospital Dashboard</h1>
            <div className="space-y-2">
                <p><strong>Name:</strong> {hospital.name}</p>
                <p><strong>Email:</strong> {hospital.email}</p>
                <p><strong>Location:</strong> {hospital.location}</p>
                <p><strong>Phone:</strong> {hospital.phone}</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {Object.entries(availability).map(([group, qty]) => (
                    <div key={group} className="flex items-center gap-4">
                        <label className="w-16 font-medium">{group}</label>
                        <Input
                            type="number"
                            name={group}
                            value={qty}
                            onChange={handleChange}
                            className="w-24"
                        />
                    </div>
                ))}
                <Button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-medium rounded-lg">
                    Update Availability
                </Button>
            </form>
        </div>
    );
};

export default HospitalDashboard; 