import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import UploadMagazine from "./pages/UploadMagazine";
import BrowseMagazines from "./pages/BrowseMagazines";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload-magazine" element={<UploadMagazine />} />
      <Route path="/browse-magazines" element={<BrowseMagazines />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
      {/* Added new route for forgot password */}
    </Routes>
  );
}

export default App;
