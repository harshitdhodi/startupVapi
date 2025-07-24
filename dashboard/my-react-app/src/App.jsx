import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from './AuthContext';
import { useContext } from 'react';
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Users from "./pages/Users";
import StartupStar from "./pages/StartupStar";
import Jury from "./pages/Jury";
import Learning from "./pages/Learning";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AuthFlow from "./auth/AuthFlow";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import OtpVerification from "./auth/OtpVerification";
import ResetPassword from "./auth/ResetPassword";
import "./App.css";
import UserProfileDetails from "./components/userDetails/UserProfileDetails";
import UserProfileList from "./components/userDetails/UserProfileList";
import DashboardLayout from './layouts/DashboardLayout';
import UserForm from "./components/userDetails/UserForm";
// Component to handle route rendering based on auth state
const AppRoutes = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route path="/auth" element={<AuthFlow />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/users-list" element={<Users />} />
          <Route path="/user-form" element={<UserForm />} />
         
          <Route path="/startupstar" element={<StartupStar />} />
          <Route path="/jury" element={<Jury />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UserProfileList />} />
          <Route path="/user/:id" element={<UserProfileDetails />} />
          </Route>
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route path="/auth" element={<Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={<Navigate to="/dashboard" />} />
          <Route path="/otp-verification" element={<Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <main>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;