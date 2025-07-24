"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from 'react-toastify';
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type SignUpState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [form, setForm] = useState<SignUpState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<Partial<SignUpState>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpState> = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email address";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof SignUpState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    await signUpUser(form);
    setLoading(false);
  };

  const signUpUser = async (data: Omit<SignUpState, "confirmPassword">) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const responseData = await res.json();
      toast.success("Account created successfully! Welcome aboard!");
      // Redirect to dashboard or login page
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-purple-200 mt-2">Join our community of creators</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Password (min 6 characters)"
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition`}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition`}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 text-gray-600 text-sm">
              I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="px-8 pb-6 text-center border-t border-gray-100 pt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/signIn" 
              className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;