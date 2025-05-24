import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "@/axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card/card";
import { Button } from "../../components/button/button";

interface BloodRequest {
    _id: string;
    hospital: string;
    bloodGroup: string;
    location: string;
    distance: number;
    urgency: string;
    createdAt: string;
    unitsNeeded: number;
}

const DonorAlerts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchAlerts = async () => {
            try {
                const response = await axiosInstance.get(`/api/donors/${user._id}/alerts`);
                setAlerts(response.data);
            } catch (error) {
                console.error("Error fetching alerts:", error);
                toast.error("Failed to fetch alerts");
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [user, navigate]);

    const getUrgencyStyle = (urgency: string) => {
        switch (urgency.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRespondToRequest = async (requestId: string) => {
        if (!user) {
            toast.error("Please log in to respond to requests");
            navigate("/login");
            return;
        }

        try {
            await axiosInstance.post(`/requests/${requestId}/respond`, {
                donorId: user._id
            });
            toast.success("Response sent successfully!");
        } catch (error) {
            toast.error("Failed to respond to request");
        }
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    if (loading) {
        return <div className="p-8">Loading alerts...</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Blood Request Alerts</h1>

            {/* Alert Preferences Summary */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Your Alert Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Alerts Status</p>
                            <p className="font-semibold">
                                {user.alertPreferences?.receiveAlerts ? "Enabled" : "Disabled"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Alert Radius</p>
                            <p className="font-semibold">{user.alertPreferences?.alertRadius || 10} km</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Urgency Level</p>
                            <p className="font-semibold">{user.alertPreferences?.urgencyLevel || "All"}</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => navigate("/profile")} 
                        className="mt-4 bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                        Update Preferences
                    </Button>
                </CardContent>
            </Card>

            {/* Alerts List */}
            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                            No blood request alerts matching your preferences at the moment.
                        </CardContent>
                    </Card>
                ) : (
                    alerts.map((alert) => (
                        <Card key={alert._id}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold">
                                                {alert.hospital}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-sm ${getUrgencyStyle(alert.urgency)}`}>
                                                {alert.urgency}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">
                                            Blood Group: <span className="font-semibold">{alert.bloodGroup}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            Units Needed: <span className="font-semibold">{alert.unitsNeeded}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            Location: <span className="font-semibold">{alert.location}</span> 
                                            ({alert.distance.toFixed(1)} km away)
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Posted: {formatDate(alert.createdAt)}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => handleRespondToRequest(alert._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Respond to Request
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default DonorAlerts; 