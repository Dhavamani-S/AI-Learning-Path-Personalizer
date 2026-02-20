import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Contact from "./pages/Contact";
import LoginModal from "./components/LoginModal";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user) => {
    console.log("User logged in:", user);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Navbar
  onLoginClick={() => {
    setAuthMode("login");
    setShowLogin(true);
  }}
  onSignupClick={() => {
    setAuthMode("signup");
    setShowLogin(true);
  }}
/>


      <Routes>
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} onRequireLogin={() => setShowLogin(true)} />}
        />
        <Route
          path="/progress"
          element={<Progress />}
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </Router>
  );
}

export default App;
