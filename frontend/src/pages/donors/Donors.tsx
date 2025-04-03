import { useEffect, useState } from "react";

type Donor = {
  name: string;
  bloodGroup: string;
  location: string;
};

const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/donors")
      .then((res) => res.json())
      .then((data) => setDonors(data))
      .catch((error) => console.error("Error fetching donors:", error));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Available Donors</h1>
      {donors.length === 0 ? (
        <p className="text-center text-gray-500">No donors available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {donors.map((donor, index) => (
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
