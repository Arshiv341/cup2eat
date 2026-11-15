import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../theme/brand';

const LoginPage = () => {
  const { user, login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedState, setUnverifiedState] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Check if backend returned unverified status
      if (err?.response?.data?.isUnverified) {
        setUnverifiedState(true);
        setError(err.response.data.message || 'Your email is not verified yet. Please enter the OTP sent to your email.');
      } else {
        setError(err?.response?.data?.message || err.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await verifyOtp(email, otp.trim());
      if (data.success) {
        setOtpSuccessMsg('Account verified successfully! Redirecting...');
        setTimeout(() => {
          if (data.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1200);
      } else {
        setError(data.message || 'Verification failed. Please check your OTP.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setSubmitting(false);
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
            {unverifiedState ? 'Email Verification Required' : 'Welcome to Cup2Eat'}
          </h1>
          <p className="text-xs text-[#556058] mt-1">
            {unverifiedState
              ? `Enter the single-use verification code sent to ${email}`
              : 'Sign in to access your customer orders and dashboard.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {otpSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#F4F7F5] border border-[#2A513A]/30 text-[#1B382B] text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#2A513A] shrink-0" />
            <span>{otpSuccessMsg}</span>
          </div>
        )}

        {!unverifiedState ? (
          <form method="POST" action="#" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DFD1BD] bg-[#FBF9F5] text-xs font-medium text-[#1B382B] focus:outline-none focus:border-[#1B382B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1B382B] uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-[#8A6728] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Inline OTP Verification Flow */
          <form method="POST" action="#" onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F6F3ED] border border-[#DFD1BD] text-xs text-[#4A3B2A] leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-[#8A6728] mb-1 inline mr-1" />
              For your security, unverified accounts cannot sign in without entering the email OTP code.
            </div>

            <div>
              <label className="text-xs font-bold text-[#1B382B] block mb-1.5 text-center uppercase tracking-wider">
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
              <span>{submitting ? 'Verifying OTP...' : 'Verify OTP & Complete Sign In'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setUnverifiedState(false)}
              className="w-full text-center text-xs font-bold text-[#556058] hover:text-[#1B382B] pt-2"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#F2EDE4] text-center">
          <p className="text-xs text-[#556058]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-[#1B382B] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
