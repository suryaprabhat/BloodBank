import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHospitalAuth } from "../../context/HospitalAuthContext";
import axiosInstance from "@/axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card/card";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";

interface Donor {
    _id: string;
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
}

interface BloodRequest {
    _id: string;
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    urgency: string;
    createdAt: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["All", "Urgent", "Normal"];

const HospitalAlerts = () => {
    const { hospital } = useHospitalAuth();
    const navigate = useNavigate();
    const [nearbyDonors, setNearbyDonors] = useState<Donor[]>([]);
    const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
    const [selectedUrgency, setSelectedUrgency] = useState("All");

    useEffect(() => {
        if (!hospital) {
            navigate("/hospital/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch nearby donors based on blood availability needs
                const donorsResponse = await axiosInstance.get("/donors", {
                    params: {
                        location: hospital.location,
                    },
                });
                setNearbyDonors(donorsResponse.data);

                // Fetch blood requests
                const requestsResponse = await axiosInstance.get("/requests");
                setBloodRequests(requestsResponse.data);
            } catch (error) {
                toast.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hospital, navigate]);

    // Filter functions
    const filteredRequests = bloodRequests.filter((request) => {
        const matchesBloodGroup = selectedBloodGroup === "All" || request.bloodGroup === selectedBloodGroup;
        const matchesUrgency = selectedUrgency === "All" || request.urgency === selectedUrgency;
        return matchesBloodGroup && matchesUrgency;
    });

    const filteredDonors = nearbyDonors.filter((donor) => {
        return selectedBloodGroup === "All" || donor.bloodGroup === selectedBloodGroup;
    });

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold mb-6">Blood Bank Alerts</h1>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Blood Group
                            </label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedBloodGroup}
                                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                            >
                                <option value="All">All Blood Groups</option>
                                {bloodGroups.map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Urgency Level
                            </label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedUrgency}
                                onChange={(e) => setSelectedUrgency(e.target.value)}
                            >
                                {urgencyLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Blood Requests Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Blood Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredRequests.length === 0 ? (
                            <p>No blood requests match your filters.</p>
                        ) : (
                            filteredRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className="p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">
                                                {request.name} - {request.bloodGroup}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {request.location}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Phone: {request.phone}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                request.urgency === "Urgent"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}>
                                                {request.urgency}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Nearby Donors Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Donors Nearby</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredDonors.length === 0 ? (
                            <p>No donors match your filters.</p>
                        ) : (
                            filteredDonors.map((donor) => (
                                <div
                                    key={donor._id}
                                    className="p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <h3 className="font-semibold">
                                        {donor.name} - {donor.bloodGroup}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {donor.location}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Phone: {donor.phone}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HospitalAlerts; 