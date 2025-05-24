import React, { useState, useEffect } from "react";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import { Card, CardContent, CardTitle } from "../../components/card/card";
import { toast } from "react-hot-toast";
import axiosInstance from "@/axios";

interface Donor {
    name: string;
    bloodGroup: string;
    location: string;
    phone?: string;
    email: string;
    alertPreferences?: {
        receiveAlerts: boolean;
        alertRadius: number;
        urgencyLevel: string;
    };
}

const Profile = () => {
    const [donor, setDonor] = useState<Donor | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Donor>({
        name: "",
        bloodGroup: "",
        location: "",
        phone: "",
        email: "",
        alertPreferences: {
            receiveAlerts: true,
            alertRadius: 10,
            urgencyLevel: "All"
        }
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user: Donor = JSON.parse(userData);
            setDonor(user);
            setFormData(user);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name.startsWith('alertPreferences.')) {
            const prefName = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                alertPreferences: {
                    ...prev.alertPreferences!,
                    [prefName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            const response = await axiosInstance.put(
                `/api/profile/${formData.email}`,
                formData
            );
    
            const updatedDonor = response.data;
            setDonor(updatedDonor);
            setFormData(updatedDonor);
            setEditMode(false);
            localStorage.setItem("user", JSON.stringify(updatedDonor));
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("❌ Failed to update profile", err);
            toast.error("Failed to update profile");
        }
    };

    if (!donor) return <p>Please Login to See your Profile...</p>;

    return (
        <div className="min-h-screen p-6 flex justify-center items-center">
            <Card className="p-6 w-96 shadow-lg">
                <CardTitle className="text-center">My Profile</CardTitle>
                <CardContent className="space-y-4">
                    {editMode ? (
                        <>
                            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                            <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="Blood Group" />
                            <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                            <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                            
                            {/* Alert Preferences Section */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-medium mb-3">Alert Preferences</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="alertPreferences.receiveAlerts"
                                            checked={formData.alertPreferences?.receiveAlerts}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label>Receive Blood Request Alerts</label>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Alert Radius (km)</label>
                                        <Input
                                            type="number"
                                            name="alertPreferences.alertRadius"
                                            value={formData.alertPreferences?.alertRadius}
                                            onChange={handleChange}
                                            min={1}
                                            max={100}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Urgency Level</label>
                                        <select
                                            name="alertPreferences.urgencyLevel"
                                            value={formData.alertPreferences?.urgencyLevel}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="All">All Requests</option>
                                            <option value="Urgent">Urgent Only</option>
                                            <option value="Normal">Normal Only</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleSave} className="w-full bg-green-500">Save</Button>
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {donor.name}</p>
                            <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                            <p><strong>Location:</strong> {donor.location}</p>
                            <p><strong>Phone:</strong> {donor.phone || "N/A"}</p>
                            <p><strong>Email:</strong> {donor.email}</p>

                            {/* Display Alert Preferences */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-medium mb-2">Alert Preferences</h3>
                                <p><strong>Receive Alerts:</strong> {donor.alertPreferences?.receiveAlerts ? "Yes" : "No"}</p>
                                <p><strong>Alert Radius:</strong> {donor.alertPreferences?.alertRadius} km</p>
                                <p><strong>Urgency Level:</strong> {donor.alertPreferences?.urgencyLevel}</p>
                            </div>

                            <Button onClick={() => setEditMode(true)} className="w-full bg-blue-500">Edit Profile</Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
