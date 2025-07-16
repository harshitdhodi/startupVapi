"use client"

import { useState } from "react"
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

const ForgotPassword = ({ onBackToLogin, onOtpSent }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      if (onOtpSent) {
        onOtpSent(email)
      }
    }, 2000)
  }

  const handleInputChange = (value) => {
    setEmail(value)
    if (error) {
      setError("")
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
            </p>

            <div className="space-y-4">
              <button
                onClick={() => onOtpSent && onOtpSent(email)}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
              >
                Continue to OTP Verification
              </button>

              <button onClick={onBackToLogin} className="w-full text-orange-600 hover:text-orange-700 font-medium py-2">
                Back to Login
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button onClick={handleSubmit} className="text-orange-600 hover:text-orange-700 font-medium">
                resend the email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">SV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Startup Vapi. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
