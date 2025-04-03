import React, { useState, useEffect } from "react";
import { Input } from "../../components/inputbox/input";
import { Button } from "../../components/button/button";
import { Card, CardContent, CardTitle } from "../../components/card/card";

interface Donor {
    name: string;
    bloodGroup: string;
    location: string;
    phone: string;
    email: string;
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
    });

    // Fetch donor data (Replace with real API call)
    useEffect(() => {
        const fetchProfile = async () => {
            const data: Donor = {
                name: "John Doe",
                bloodGroup: "O+",
                location: "New York",
                phone: "123-456-7890",
                email: "johndoe@example.com",
            };
            setDonor(data);
            setFormData(data);
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Send updated data to the backend (Replace with API call)
        console.log("Updated Profile:", formData);
        setDonor(formData);
        setEditMode(false);
    };

    if (!donor) return <p>Loading profile...</p>;

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
                            <Button onClick={handleSave} className="w-full bg-green-500">Save</Button>
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {donor.name}</p>
                            <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                            <p><strong>Location:</strong> {donor.location}</p>
                            <p><strong>Phone:</strong> {donor.phone}</p>
                            <p><strong>Email:</strong> {donor.email}</p>
                            <Button onClick={() => setEditMode(true)} className="w-full bg-blue-500">Edit Profile</Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
