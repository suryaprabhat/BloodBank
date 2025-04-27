import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button/button";
import { BiSolidDonateBlood } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BiSolidDonateBlood className="text-red-500 text-2xl" />
        <h1 className="text-xl font-bold">Blood Donation</h1>
      </div>

      {/* Links */}
      <div className="hidden md:flex gap-6 text-lg">
        <Link to="/" className="hover:text-red-400 transition">Home</Link>
        <Link to="/donors" className="hover:text-red-400 transition">Donors</Link>
        <Link to="/request" className="hover:text-red-400 transition">Request Blood</Link>
        <Link to="/profile" className="hover:text-red-400 transition">Profile</Link>
        <Link to="/register" className="hover:text-red-400 transition">Register</Link>
        <Link to="/map" className="hover:text-red-400 transition">Map</Link>

      </div>

      {/* Auth Buttons */}
      {user ? (
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
      ) : (
        <Button asChild className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium rounded-lg shadow">
          <Link to="/login">Login</Link>
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
