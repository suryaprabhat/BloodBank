import './App.css';
import LandingPage from './pages/landingPage/LandingPage';
import Navbar from './components/navbar/navBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Donors from './pages/donors/Donors';
import RequestBlood from './pages/requestPage/requestBlood';
import Profile from './pages/profile/profile';
import Login from './pages/loginPage/login';
import Register from './pages/registerPage/register';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Donors" element={<Donors />} />
        <Route path="/request" element={<RequestBlood />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
