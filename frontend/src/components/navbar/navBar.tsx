import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button/button";
import { BiSolidDonateBlood } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useHospitalAuth } from "../../context/HospitalAuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { hospital, logoutHospital } = useHospitalAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleHospitalLogout = () => {
    logoutHospital();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const renderDonorLinks = () => (
    <div className="hidden md:flex gap-6 text-lg">
      <Link to="/" className="hover:text-red-400 transition">Home</Link>
      <Link to="/donors" className="hover:text-red-400 transition">Donors</Link>
      <Link to="/request" className="hover:text-red-400 transition">Request Blood</Link>
      <Link to="/alerts" className="hover:text-red-400 transition">Alerts</Link>
      <Link to="/profile" className="hover:text-red-400 transition">Profile</Link>
      <Link to="/map" className="hover:text-red-400 transition">Map</Link>
    </div>
  );

  const renderHospitalLinks = () => (
    <div className="hidden md:flex gap-6 text-lg">
      <Link to="/hospital/dashboard" className="hover:text-red-400 transition">Dashboard</Link>
      <Link to="/hospital/alerts" className="hover:text-red-400 transition">Blood Alerts</Link>
      <Link to="/hospital/requests" className="hover:text-red-400 transition">Blood Requests</Link>
      <Link to="/map" className="hover:text-red-400 transition">Map</Link>
    </div>
  );

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <FaUserCircle
              className="text-2xl cursor-pointer hover:text-red-400"
              onClick={() => navigate("/profile")}
            />
            <span className="hidden md:inline">{user.name}</span>
          </span>
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium rounded-lg shadow"
          >
            Logout
          </Button>
        </div>
      );
    }
    
    if (hospital) {
      return (
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <FaUserCircle
              className="text-2xl cursor-pointer hover:text-red-400"
              onClick={() => navigate("/hospital/dashboard")}
            />
            <span className="hidden md:inline">{hospital.name}</span>
          </span>
          <Button
            onClick={handleHospitalLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium rounded-lg shadow"
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-4">
        <Button asChild className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium rounded-lg shadow">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 font-medium rounded-lg shadow">
          <Link to="/register">Register</Link>
        </Button>
      </div>
    );
  };

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-lg">
      {/* Logo - Always redirects to landing page */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-red-500 transition">
        <BiSolidDonateBlood className="text-red-500 text-2xl" />
        <span>Blood Bank</span>
      </Link>

      {/* Links based on user type */}
      {user && renderDonorLinks()}
      {hospital && renderHospitalLinks()}

      {/* Auth Buttons */}
      {renderAuthButtons()}
    </nav>
  );
};

export default Navbar;
