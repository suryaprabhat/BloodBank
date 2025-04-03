import { BiSolidDonateBlood } from "react-icons/bi";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-6">
            {/* Hero Section */}
            <div className="max-w-2xl">
                <BiSolidDonateBlood className="text-red-600 text-6xl mb-4 mx-auto" />
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Save a Life, Donate Blood 🩸
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Your blood donation can help those in need. Be a hero today and make a difference!
                </p>

                <div className="flex justify-center gap-4">
                    
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-red-600">500+</h2>
                    <p className="text-gray-700">Blood Donors</p>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-red-600">1000+</h2>
                    <p className="text-gray-700">Successful Donations</p>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-red-600">24/7</h2>
                    <p className="text-gray-700">Emergency Support</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
