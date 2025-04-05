import { useEffect, useState } from "react";

type Donor = {
  name: string;
  bloodGroup: string;
  location: string;
};

const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    fetch("api/donors")
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);
        setFilteredDonors(data); // Default: show all
      })
      .catch((error) => console.error("Error fetching donors:", error));
  }, []);

  useEffect(() => {
    let updated = donors;

    if (selectedBloodGroup) {
      updated = updated.filter((donor) => donor.bloodGroup === selectedBloodGroup);
    }

    if (selectedLocation) {
      updated = updated.filter((donor) =>
        donor.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredDonors(updated);
  }, [selectedBloodGroup, selectedLocation, donors]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Available Donors</h1>

      <div className="flex gap-4 mb-6 w-full max-w-4xl justify-center">
        <select
          value={selectedBloodGroup}
          onChange={(e) => setSelectedBloodGroup(e.target.value)}
          className="p-2 border rounded w-48"
        >
          <option value="">All Blood Groups</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by Location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="p-2 border rounded w-48"
        />
      </div>

      {filteredDonors.length === 0 ? (
        <p className="text-center text-gray-500">No donors match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {filteredDonors.map((donor, index) => (
            <div key={index} className="p-4 border rounded shadow-md bg-white">
              <p><strong>Name:</strong> {donor.name}</p>
              <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
              <p><strong>Location:</strong> {donor.location}</p>
              <button className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
                Request Contact
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Donors;
