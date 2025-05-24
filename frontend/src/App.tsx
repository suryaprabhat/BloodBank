import './App.css';
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/navBar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Donors from './pages/donors/Donors';
import RequestBlood from './pages/requestPage/requestBlood';
import Profile from './pages/profile/profile';
import Login from './pages/loginPage/login';
import LoginChoice from './pages/loginPage/LoginChoice';
import Register from './pages/registerPage/register';
import RegisterChoice from './pages/registerPage/RegisterChoice';
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalAuthContext';
import { Toaster } from 'react-hot-toast';
import RequestSuccess from './pages/requestsucess/RequestConfirmation';
import MapPage from './pages/maptest/MapTesting';
import HospitalRegister from './pages/hospitalRegisterPage/register';
import HospitalLogin from './pages/hospitalLoginPage/login';
import HospitalDashboard from './pages/hospitalDashboardPage/HospitalDashboard';
import HospitalAlerts from './pages/hospitalAlertsPage/HospitalAlerts';
import HospitalAnalytics from './pages/hospitalAnalyticsPage/HospitalAnalytics';
import { HospitalNavbar } from './components/navbar/HospitalNavbar';
import DonorAlerts from "./pages/alerts/DonorAlerts";

const NavbarWrapper = () => {
  const location = useLocation();
  const isHospitalRoute = location.pathname.startsWith("/hospital");
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {isHospitalRoute ? <HospitalNavbar /> : <Navbar />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <NavbarWrapper />
          <div className="pt-16"> {/* Add padding to account for fixed navbar */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/donors" element={<Donors />} />
              <Route path="/request" element={<RequestBlood />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<LoginChoice />} />
              <Route path="/login/donor" element={<Login />} />
              <Route path="/register" element={<RegisterChoice />} />
              <Route path="/register/donor" element={<Register />} />
              <Route path="/thank-you" element={<RequestSuccess />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/hospital/register" element={<HospitalRegister />} />
              <Route path="/hospital/login" element={<HospitalLogin />} />
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
              <Route path="/hospital/alerts" element={<HospitalAlerts />} />
              <Route path="/hospital/analytics" element={<HospitalAnalytics />} />
              <Route path="/alerts" element={<DonorAlerts />} />
            </Routes>
          </div>
        </BrowserRouter>
      </HospitalProvider>
    </AuthProvider>
  );
}

export default App;
