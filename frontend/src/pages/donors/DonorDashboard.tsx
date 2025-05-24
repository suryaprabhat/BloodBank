import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "@/axios";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card/card";
import { Button } from "../../components/button/button";

interface DonationHistory {
  date: string;
  hospital: string;
  bloodGroup: string;
  units: number;
}

interface NearbyRequest {
  hospital: string;
  bloodGroup: string;
  unitsNeeded: number;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
}

const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [nearbyRequests, setNearbyRequests] = useState<NearbyRequest[]>([]);
  const [nextDonationDate, setNextDonationDate] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch donation history
    axiosInstance
      .get(`/api/donors/${user._id}/donations`)
      .then((res) => {
        setDonationHistory(res.data.donations);
        // Calculate next donation date (3 months from last donation)
        if (res.data.donations.length > 0) {
          const lastDonation = new Date(res.data.donations[0].date);
          const nextDate = new Date(lastDonation);
          nextDate.setMonth(nextDate.getMonth() + 3);
          setNextDonationDate(nextDate.toLocaleDateString());
        }
      })
      .catch(() => {
        toast.error("Failed to fetch donation history");
      });

    // Fetch nearby blood requests
    axiosInstance
      .get(`/api/donors/${user._id}/nearby-requests`)
      .then((res) => {
        setNearbyRequests(res.data.requests);
      })
      .catch(() => {
        toast.error("Failed to fetch nearby requests");
      });
  }, [user, navigate]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Donor Dashboard</h1>
      
      {/* Donor Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
          <p><strong>Next Eligible Donation Date:</strong> {nextDonationDate || "You can donate now!"}</p>
        </CardContent>
      </Card>

      {/* Donation History Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {donationHistory.length > 0 ? (
            <div className="space-y-4">
              {donationHistory.map((donation, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium">{new Date(donation.date).toLocaleDateString()}</p>
                  <p>Hospital: {donation.hospital}</p>
                  <p>Units: {donation.units}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No donation history yet</p>
          )}
        </CardContent>
      </Card>

      {/* Nearby Blood Requests */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Nearby Blood Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {nearbyRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyRequests.map((request, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{request.hospital}</p>
                      <p>Blood Group: {request.bloodGroup}</p>
                      <p>Units Needed: {request.unitsNeeded}</p>
                      <p>Distance: {request.distance.toFixed(1)} km</p>
                    </div>
                    <span className={`font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/request/${request.hospital}`)}
                    className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Respond to Request
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No nearby blood requests at the moment</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard; 