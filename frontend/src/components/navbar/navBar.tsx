import { Link } from "react-router-dom";
import { Button } from "../button/button";
import { BiSolidDonateBlood } from "react-icons/bi";

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        <BiSolidDonateBlood className="text-red-500 text-2xl" />
        <h1 className="text-xl font-bold">Blood Donation</h1>
      </div>

      <div className="hidden md:flex gap-6 text-lg">
        <Link to="/" className="hover:text-red-400 transition">Home</Link>
        <Link to="/donors" className="hover:text-red-400 transition">Donors</Link>
        <Link to="/request" className="hover:text-red-400 transition">Request Blood</Link>
        <Link to="/profile" className="hover:text-red-400 transition">Profile</Link>
        <Link to="/register" className="hover:text-red-400 transition">Register</Link>

      </div>

      <Button asChild className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-medium rounded-lg shadow">
        <Link to="/login">Login</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
