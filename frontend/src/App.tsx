import './App.css';
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/navBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Donors from './pages/donors/Donors';
import RequestBlood from './pages/requestPage/requestBlood';
import Profile from './pages/profile/profile';
import Login from './pages/loginPage/login';
import LoginChoice from './pages/loginPage/LoginChoice';
import Register from './pages/registerPage/register';
import RegisterChoice from './pages/registerPage/RegisterChoice';
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalAuthContext';
import { Toaster } from 'react-hot-toast';// 👈 import the provider
import RequestSuccess from './pages/requestsucess/RequestConfirmation';
import MapPage from './pages/maptest/MapTesting';
import HospitalRegister from './pages/hospitalRegisterPage/register';
import HospitalLogin from './pages/hospitalLoginPage/login';
import HospitalDashboard from './pages/hospitalDashboardPage/HospitalDashboard';

function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/request" element={<RequestBlood />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginChoice />} />
            <Route path="/login/donor" element={<Login />} />
            <Route path="/register" element={<RegisterChoice />} />
            <Route path="/register/donor" element={<Register />} />
            <Route path="/thank you" element={<RequestSuccess />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/hospital/register" element={<HospitalRegister />} />
            <Route path="/hospital/login" element={<HospitalLogin />} />
            <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          </Routes>
        </BrowserRouter>
      </HospitalProvider>
    </AuthProvider>
  );
}

export default App;
