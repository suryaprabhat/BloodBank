import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHospitalAuth } from "../../context/HospitalAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import axiosInstance from "@/axios";
import toast from "react-hot-toast";

interface BloodRequest {
    bloodGroup: string;
    urgency: string;
    createdAt: string;
}

interface DonationTrend {
    month: string;
    donations: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const HospitalAnalytics = () => {
    const { hospital } = useHospitalAuth();
    const navigate = useNavigate();
    const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!hospital) {
            navigate("/hospital/login");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/requests");
                setBloodRequests(response.data);
            } catch (error) {
                toast.error("Failed to fetch analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hospital, navigate]);

    // Prepare data for blood availability chart
    const bloodAvailabilityData = Object.entries(hospital?.bloodAvailability || {}).map(([group, units]) => ({
        name: group,
        units: units
    }));

    // Mock data for donation trends (replace with real data when available)
    const donationTrends: DonationTrend[] = [
        { month: "Jan", donations: 45 },
        { month: "Feb", donations: 52 },
        { month: "Mar", donations: 48 },
        { month: "Apr", donations: 70 },
        { month: "May", donations: 65 },
        { month: "Jun", donations: 58 }
    ];

    const bloodGroupDistribution = bloodRequests.reduce((acc: { [key: string]: number }, request) => {
        acc[request.bloodGroup] = (acc[request.bloodGroup] || 0) + 1;
        return acc;
    }, {});

    const bloodGroupData = Object.entries(bloodGroupDistribution).map(([group, count]) => ({
        name: group,
        value: count
    }));

    // Remove unused entry parameter
    const pieChartData = bloodGroupData.map(({ name, value }) => ({
        name,
        value
    }));

    if (loading) {
        return <div className="p-8">Loading analytics...</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold mb-6">Hospital Analytics</h1>

            {/* Blood Availability Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Blood Group Availability</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bloodAvailabilityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="units" fill="#8884d8" name="Units Available" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Requests by Urgency */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requests by Urgency Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieChartData.map((_, i) => (
                                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Donation Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Donation Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={donationTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="donations"
                                        stroke="#8884d8"
                                        name="Donations"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Total Blood Units</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {Object.values(hospital?.bloodAvailability || {}).reduce((a, b) => a + b, 0)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Total Requests</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {bloodRequests.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-600">Critical Requests</h3>
                            <p className="text-3xl font-bold text-red-600">
                                {bloodRequests.filter(req => req.urgency === "Urgent").length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HospitalAnalytics; 