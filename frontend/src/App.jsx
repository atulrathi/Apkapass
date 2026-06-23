import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landingpage";
import Userdeashboard from "./pages/userdeashboard";
import ProviderProfile from "./pages/providerdeshboard";
import Providerregister from "./pages/Providerregister";
import Navbar from "./pages/Navbar";
import Providerservices from "./pages/Services"

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Userdeashboard />} />
        <Route path="/join-us" element={<Providerregister />} />

        {/* Route with Navbar */}
        <Route
          path="/provider-profile"
          element={
            <>
              
              <ProviderProfile />
            </>
          }
        />
        <Route path="/provider-services" element={<Providerservices />} />
      </Routes>
    </Router>
  );
}

export default App;