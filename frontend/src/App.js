import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Contact from "./pages/Contact";
import ModulesPage from "./pages/ModulesPage";

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user) => {
    console.log("User logged in:", user);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              isLoggedIn={isLoggedIn}
              onRequireLogin={() => setShowLogin(true)}
            />
          }
        />
        <Route path="/progress" element={<Progress />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/modules" element={<ModulesPage />} />
      </Routes>

      {/* ✅ Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      {/* ✅ Signup Modal */}
      <SignupModal
      isOpen={showSignup}
      onClose={() => setShowSignup(false)}
      onSignup={handleLogin}
      />
    </Router>
  );
}

export default App;