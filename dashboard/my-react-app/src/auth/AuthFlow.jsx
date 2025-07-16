"use client"

import { useState } from "react"
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import OtpVerification from "./OtpVerification"
import ResetPassword from "./ResetPassword"

const AuthFlow = ({ onAuthSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState("login")
  const [userEmail, setUserEmail] = useState("")

  const handleLogin = (credentials) => {
    console.log("Login attempt:", credentials)
    // In a real app, you would validate credentials here
    onAuthSuccess && onAuthSuccess(credentials)
  }

  const handleForgotPassword = () => {
    setCurrentScreen("forgot-password")
  }

  const handleOtpSent = (email) => {
    setUserEmail(email)
    setCurrentScreen("otp-verification")
  }

  const handleOtpVerified = (email, otp) => {
    console.log("OTP verified:", { email, otp })
    setCurrentScreen("reset-password")
  }

  const handlePasswordReset = () => {
    console.log("Password reset successful")
    setCurrentScreen("login")
  }

  const handleBackToLogin = () => {
    setCurrentScreen("login")
    setUserEmail("")
  }

  const handleBackToForgot = () => {
    setCurrentScreen("forgot-password")
  }

  const handleResendOtp = (email) => {
    console.log("Resending OTP to:", email)
    // In a real app, you would call the API to resend OTP
  }

  switch (currentScreen) {
    case "login":
      return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />

    case "forgot-password":
      return <ForgotPassword onBackToLogin={handleBackToLogin} onOtpSent={handleOtpSent} />

    case "otp-verification":
      return (
        <OtpVerification
          email={userEmail}
          onBackToForgot={handleBackToForgot}
          onOtpVerified={handleOtpVerified}
          onResendOtp={handleResendOtp}
        />
      )

    case "reset-password":
      return <ResetPassword email={userEmail} onPasswordReset={handlePasswordReset} onBackToLogin={handleBackToLogin} />

    default:
      return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
  }
}

export default AuthFlow
