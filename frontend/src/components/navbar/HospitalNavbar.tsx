import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHospitalAuth } from "../../context/HospitalAuthContext";
import { BiSolidDonateBlood } from "react-icons/bi";
import { FaUserCircle, FaBell, FaChartLine, FaHospital } from "react-icons/fa";
import { Button } from "../button/button";
import toast from "react-hot-toast";

export const HospitalNavbar = () => {
    const { hospital, logoutHospital } = useHospitalAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutHospital();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const isActive = (path: string) => {
        return location.pathname === path ? "text-red-500" : "text-gray-300 hover:text-white";
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Always redirects to landing page */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 text-xl font-bold hover:text-red-500 transition"
                    >
                        <BiSolidDonateBlood className="text-red-500 text-2xl" />
                        <span>Blood Bank</span>
                    </Link>

                    {/* Navigation Links */}
                    {hospital && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                to="/hospital/dashboard"
                                className={`flex items-center gap-2 ${isActive('/hospital/dashboard')} transition`}
                            >
                                <FaHospital />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/hospital/alerts"
                                className={`flex items-center gap-2 ${isActive('/hospital/alerts')} transition`}
                            >
                                <FaBell />
                                <span>Blood Alerts</span>
                            </Link>
                            <Link
                                to="/hospital/analytics"
                                className={`flex items-center gap-2 ${isActive('/hospital/analytics')} transition`}
                            >
                                <FaChartLine />
                                <span>Analytics</span>
                            </Link>
                        </div>
                    )}

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {hospital ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <FaUserCircle className="text-2xl" />
                                    <span className="hidden md:inline font-medium">{hospital.name}</span>
                                </div>
                                <Button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Button asChild>
                                    <Link to="/hospital/login">Login</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link to="/hospital/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}; 