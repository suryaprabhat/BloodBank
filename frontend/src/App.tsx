import './App.css';
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/navBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Donors from './pages/donors/Donors';
import RequestBlood from './pages/requestPage/requestBlood';
import Profile from './pages/profile/profile';
import Login from './pages/loginPage/login';
import Register from './pages/registerPage/register';
import { AuthProvider } from './context/AuthContext'; 
import { Toaster } from 'react-hot-toast';// 👈 import the provider
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AuthProvider> {/* 👈 wrap everything */}
      <Toaster position="top-center" />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/request" element={<RequestBlood />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
