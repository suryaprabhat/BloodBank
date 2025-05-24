import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/axios";
import { useHospitalAuth } from "../../context/HospitalAuthContext";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card/card";
import { FaHospital, FaUserNurse, FaTint, FaExclamationTriangle } from "react-icons/fa";

const HospitalDashboard = () => {
    const { hospital, loginHospital } = useHospitalAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [bloodAvailability, setBloodAvailability] = useState({
        "A+": 0, "A-": 0,
        "B+": 0, "B-": 0,
        "AB+": 0, "AB-": 0,
        "O+": 0, "O-": 0
    });

    useEffect(() => {
        if (!hospital) {
            navigate("/hospital/login");
            return;
        }
        setBloodAvailability(hospital.bloodAvailability);
    }, [hospital, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBloodAvailability(prev => ({
            ...prev,
            [name]: Math.max(0, Number(value))
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hospital) return;
        try {
            console.log('Sending update with blood availability:', bloodAvailability);
            const res = await axiosInstance.put(
                `/hospitals/${hospital._id}`,
                { bloodAvailability }
            );
            console.log('Server response:', res.data);
            
            // Update the hospital context with new data
            const updatedHospital = {
                ...hospital,
                bloodAvailability: res.data.hospital.bloodAvailability
            };
            console.log('Updating hospital context with:', updatedHospital);
            loginHospital(updatedHospital);
            
            toast.success("Blood availability updated successfully");
            setIsEditing(false);
        } catch (err: any) {
            console.error('Update failed:', err.response || err);
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const getTotalBloodUnits = () => {
        return Object.values(bloodAvailability).reduce((sum, current) => sum + current, 0);
    };

    const getLowStockBloodGroups = () => {
        return Object.entries(bloodAvailability)
            .filter(([_, units]) => units < 5)
            .map(([group]) => group);
    };

    if (!hospital) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Blood Units</p>
                                    <h3 className="text-2xl font-bold">{getTotalBloodUnits()}</h3>
                                </div>
                                <FaTint className="text-red-500 text-3xl" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Blood Types</p>
                                    <h3 className="text-2xl font-bold">8</h3>
                                </div>
                                <FaUserNurse className="text-blue-500 text-3xl" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Low Stock Alert</p>
                                    <h3 className="text-2xl font-bold">{getLowStockBloodGroups().length}</h3>
                                </div>
                                <FaExclamationTriangle className="text-yellow-500 text-3xl" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Hospital Status</p>
                                    <h3 className="text-2xl font-bold text-green-500">Active</h3>
                                </div>
                                <FaHospital className="text-green-500 text-3xl" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Hospital Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Hospital Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-500">Name</label>
                                    <p className="font-medium">{hospital.name}</p>
                                </div>
                                <div>
                                    <label className="text-gray-500">Email</label>
                                    <p className="font-medium">{hospital.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-500">Location</label>
                                    <p className="font-medium">{hospital.location}</p>
                                </div>
                                <div>
                                    <label className="text-gray-500">Phone</label>
                                    <p className="font-medium">{hospital.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Low Stock Alert</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {getLowStockBloodGroups().length > 0 ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 font-medium">
                                            Low stock warning for blood groups:
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {getLowStockBloodGroups().map(group => (
                                                <span
                                                    key={group}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                                                >
                                                    {group}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        Please consider restocking these blood types soon.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700">All blood groups are well stocked!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Blood Availability Management */}
                <Card className="bg-white shadow-lg">
                    <CardHeader className="border-b">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold">Blood Availability Management</CardTitle>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`${isEditing ? "bg-gray-500" : "bg-blue-500"} text-white px-4 py-2 rounded-lg`}
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Object.entries(bloodAvailability).map(([group, qty]) => (
                                <div key={group} className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <FaTint className="text-red-500" />
                                        <span className="font-medium">{group}</span>
                                    </label>
                                    <Input
                                        type="number"
                                        name={group}
                                        value={qty}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        min="0"
                                        className="w-full"
                                    />
                                </div>
                            ))}
                            {isEditing && (
                                <div className="col-span-2 md:col-span-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HospitalDashboard; 