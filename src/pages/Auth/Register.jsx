import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../theme/brand';
import api from '../../services/api';

const RegisterPage = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (data.success) {
        setSuccessMessage(data.message || 'Verification code sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await verifyOtp(formData.email, otp.trim());
      if (data.success) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError('');
      const { data } = await api.post('/auth/resend-otp', { email: formData.email });
      if (data.success) {
        setSuccessMessage('A fresh verification code has been dispatched.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D5] shadow-sm">
        
        {/* Brand Logo Emblem */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C8A051] bg-[#1B382B] mx-auto mb-3 shadow-md">
            <img
              src={BRAND.logo.src}
              alt={BRAND.logo.alt}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-[#1B382B] tracking-tight">
            {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
          </h1>
          <p className="text-xs text-[#556058] mt-1">
            {step === 1
              ? 'Join Cup2Eat for zero-waste edible cups.'
              : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#F4F7F5] border border-[#2A513A]/30 text-[#1B382B] text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#2A513A] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#1B382B] hover:bg-[#142B21] text-[#D4AF37] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md border border-[#C8A051]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{submitting ? 'Generating Verification...' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1 text-center uppercase tracking-wider">
                Enter 6-Digit Email Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="w-full text-center text-2xl font-mono tracking-widest py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] focus:outline-none focus:border-[#1B382B]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#C8A051] hover:bg-[#D4AF37] text-[#142B21] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Verifying...' : 'Verify OTP & Continue'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-xs font-bold text-[#8A6728] hover:underline"
              >
                Didn't receive code? Resend Email
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#F2EDE4] text-center">
          <p className="text-xs text-[#556058]">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#1B382B] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
