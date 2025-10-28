import React, { useEffect, useState } from "react";
import { Eye, EyeOff, HeartPulse, RefreshCw, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// import dotenv from 'dotenv';
// dotenv.config(); 
// --- Configuration ---
const Api =  process.env.REACT_APP_API_URL;


const LoginCard = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobileNo: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Captcha Logic ---
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // --- Handlers ---
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // --- Step 1: Password Login & Send OTP ---
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${Api}/loginUserShdefgbf`, {
        mobileNo: form.mobileNo,
        password: form.password
      });
      console.log('cdce');
      setStep(2); // Move to OTP step on success
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Verify OTP & Final Login ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setError("Captcha mismatch. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    setIsLoading(true);
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${Api}/verifyLoginOtp`, {
        mobileNo: form.mobileNo,
        otp: otpString
      });
      console.log('cdce2');
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/patient');

    } catch (err) {
      const errorMessage = err.response?.data?.message || "OTP verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-3">
              <HeartPulse className="h-12 w-12 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Arogya Connect</h1>
                <p className="text-xs text-gray-500">Your Health, Connected</p>
              </div>
            </Link>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Patient Login</h2>
              <p className="text-center text-gray-500 text-sm mt-2 mb-6">Welcome back! Please sign in to your account.</p>
              <form onSubmit={handleCredentialsSubmit}>
                <div className="mb-4">
                  <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input type="text" value={form.mobileNo} onChange={handleFormChange} name="mobileNo" id="mobileNo" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} id="password" value={form.password} onChange={handleFormChange} name="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-blue-400">
                  {isLoading ? <LoaderCircle className="animate-spin" /> : "Proceed to OTP Verification"}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Two-Step Verification</h2>
              <p className="text-center text-gray-500 text-sm mt-2 mb-6">An OTP has been sent to your registered mobile number. Please enter it below.</p>
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <div className="flex justify-center space-x-2">{otp.map((digit, index) => (<input key={index} id={`otp-${index}`} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(e.target.value, index)} onKeyDown={(e) => handleOtpKeyDown(e, index)} className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />))}</div>
                </div>
                <div className="mb-6">
                  <label htmlFor="captcha-input" className="block text-sm font-medium text-gray-700 mb-1">Enter Captcha</label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md border">
                    <span className="flex-grow select-none text-gray-700 font-mono tracking-widest text-lg font-bold line-through" style={{ transform: "skew(-10deg)" }}>{captcha}</span>
                    <button type="button" onClick={generateCaptcha} className="p-1 text-gray-600 hover:text-blue-600"><RefreshCw className="h-5 w-5" /></button>
                  </div>
                  <input type="text" id="captcha-input" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2" required />
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-blue-400">
                   {isLoading ? <LoaderCircle className="animate-spin" /> : "Verify & Login"}
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 pt-6 border-t text-center text-sm">
            <p className="text-gray-500">Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Register Now</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginCard;
