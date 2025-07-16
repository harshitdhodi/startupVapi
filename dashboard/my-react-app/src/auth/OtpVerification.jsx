"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ArrowRight, RefreshCw, Shield } from "lucide-react"

const OtpVerification = ({ email, onBackToForgot, onOtpVerified, onResendOtp }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleInputChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (error) setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Simulate validation (in real app, this would be server-side)
      if (otpString === "123456") {
        onOtpVerified && onOtpVerified(email, otpString)
      } else {
        setError("Invalid OTP. Please try again.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    }, 1500)
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimeLeft(300)
    setError("")
    setOtp(["", "", "", "", "", ""])

    // Simulate resend API call
    setTimeout(() => {
      onResendOtp && onResendOtp(email)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
              {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {timeLeft > 0 ? (
                  <>
                    Code expires in <span className="font-medium text-orange-600">{formatTime(timeLeft)}</span>
                  </>
                ) : (
                  <span className="text-red-600">Code has expired</span>
                )}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Resend Code
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={onBackToForgot}
              className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Email Entry
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

export default OtpVerification
