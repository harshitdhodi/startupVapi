"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, CheckCircle, ArrowRight } from "lucide-react"

const ResetPassword = ({ email, onPasswordReset, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const passwordRequirements = [
    { text: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { text: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { text: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { text: "One number", test: (pwd) => /\d/.test(pwd) },
    { text: "One special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else {
      const failedRequirements = passwordRequirements.filter((req) => !req.test(formData.password))
      if (failedRequirements.length > 0) {
        newErrors.password = "Password doesn't meet all requirements"
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <button
              onClick={onBackToLogin}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
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
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Create a new password for <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Password must contain:</p>
              <div className="space-y-1">
                {passwordRequirements.map((requirement, index) => {
                  const isValid = formData.password && requirement.test(formData.password)
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isValid ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        {isValid && <CheckCircle className="h-3 w-3 text-green-600" />}
                      </div>
                      <span className={`text-sm ${isValid ? "text-green-600" : "text-gray-500"}`}>
                        {requirement.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Startup Vapi. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
