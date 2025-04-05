import { BiSolidDonateBlood } from "react-icons/bi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Section */}
      <motion.div
        className="max-w-2xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Animated Blood Drop */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <BiSolidDonateBlood className="text-red-600 text-7xl mb-4 mx-auto drop-shadow-md" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-red-700 mb-2">
          Save a Life, Donate Blood 🩸
        </h1>

        {/* Animated Divider */}
        <motion.div
          className="h-1 w-24 mx-auto bg-red-500 rounded-full mb-6"
          animate={{
            scaleX: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />

        <p className="text-lg text-gray-700 mb-6">
          Your blood donation can help those in need. Be a hero today and make a difference!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300">
            <Link to="/register" className="hover:text-red-400 transition">Become a Donor</Link>
          </button>
          <button className="border border-red-600 text-red-600 hover:bg-red-100 font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300">
          <Link to="/request" className="hover:text-red-400 transition">Find Blood</Link>
            
          </button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {[
          { value: "500+", label: "Blood Donors" },
          { value: "1000+", label: "Successful Donations" },
          { value: "24/7", label: "Emergency Support" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="p-6 bg-white shadow-xl rounded-xl border border-red-100 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.3 }}
          >
            <h2 className="text-2xl font-bold text-red-600">{stat.value}</h2>
            <p className="text-gray-700">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* How It Works Section */}
      <div className="mt-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-red-700 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "📝 Register", desc: "Sign up and create your donor profile." },
            { step: "📍 Donate", desc: "Find the nearest blood drive or hospital." },
            { step: "❤️ Save Lives", desc: "Your donation reaches those in need." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 border border-red-100 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                {item.step}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
