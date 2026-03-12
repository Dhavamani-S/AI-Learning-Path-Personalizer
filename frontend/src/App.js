import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./Navbar";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Contact from "./pages/Contact";
import ModulesPage from "./pages/ModulesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GeneratePage from "./pages/GeneratePage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    // ✅ Check if token is expired
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
});

  const handleLogin = (user) => {
    console.log("User logged in:", user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId="306306559882-fepiqes47m770e1moahap1kiar29de88.apps.googleusercontent.com">
      <Router>
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />

        <Routes>
          {/* ✅ Main Pages */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
         <Route
  path="/generate"
  element={
    <ProtectedRoute isLoggedIn={isLoggedIn}>
      <GeneratePage isLoggedIn={isLoggedIn} />
    </ProtectedRoute>
  }
/>

<Route
  path="/progress"
  element={
    <ProtectedRoute isLoggedIn={isLoggedIn}>
      <Progress />
    </ProtectedRoute>
  }
/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/modules" element={<ModulesPage />} />

          {/* ✅ Auth Pages — redirect to home if already logged in */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <SignupPage onLogin={handleLogin} />}
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;