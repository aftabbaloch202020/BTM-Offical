import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle, 
  Award, 
  Clock, 
  MapPin, 
  CreditCard,
  UserPlus,
  HelpCircle,
  LogOut,
  ChevronRight,
  Gift,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { Order, Notification } from '../types';

interface AccountPageProps {
  orders: Order[];
  notifications: Notification[];
  onAddNotification: (title: string, message: string, type: any) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  orders: globalOrders,
  notifications,
  onAddNotification
}) => {
  // Global auth states
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('btm_logged_in_user'));
  const [userAccountTab, setUserAccountTab] = useState('dashboard');

  // Forms Mode: 'login' | 'register' | 'forgot' | 'reset'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  // Input fields - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Input fields - Register
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [registerConfirmPass, setRegisterConfirmPass] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Input fields - Forgot & Reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Loaded Dashboard data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // Load dashboard data if logged in
  const fetchDashboardSummary = async () => {
    const token = localStorage.getItem('btm_auth_token');
    if (!token) return;

    setIsLoadingDashboard(true);
    try {
      const res = await fetch('/api/user/dashboard-summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        // Token might have expired
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardSummary();
    }
  }, [isLoggedIn]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!loginEmail || !loginPass) {
      setAuthError('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed.');
        return;
      }

      // Store in storage
      localStorage.setItem('btm_auth_token', data.token);
      localStorage.setItem('btm_logged_in_user', data.user.email);
      localStorage.setItem('btm_user_name', data.user.name);
      localStorage.setItem('btm_user_phone', data.user.phone);

      setIsLoggedIn(true);
      window.dispatchEvent(new Event('btm_auth_change'));
      onAddNotification('Login Success ✅', `Logged in successfully as ${data.user.name}`, 'order');
    } catch (err) {
      setAuthError('Connection failed. Please try again.');
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!registerName || !registerEmail || !registerPhone || !registerPass || !registerConfirmPass) {
      setAuthError('All registration fields are required.');
      return;
    }

    if (registerPass !== registerConfirmPass) {
      setAuthError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          password: registerPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed.');
        return;
      }

      setRegisterSuccess(true);
      onAddNotification('Registration Successful 👑', `Welcome ${registerName}! Account created successfully.`, 'promo');
      
      setTimeout(() => {
        setAuthMode('login');
        setLoginEmail(registerEmail);
        setRegisterSuccess(false);
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPhone('');
        setRegisterPass('');
        setRegisterConfirmPass('');
      }, 2000);
    } catch (err) {
      setAuthError('Connection failed. Please try again.');
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!forgotEmail) {
      setAuthError('Please enter your email.');
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Failed to request reset token.');
        return;
      }

      setForgotSuccess(true);
      onAddNotification('Reset Code Generated 🔑', `Password reset token is displayed inside your notifications!`, 'promo');
      
      // Auto fill token into reset mode
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      
      setTimeout(() => {
        setAuthMode('reset');
        setForgotSuccess(false);
        setForgotEmail('');
      }, 2500);
    } catch (err) {
      setAuthError('Connection failed. Please try again.');
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!resetToken || !resetPassword) {
      setAuthError('Reset token and new password are required.');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: resetPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Failed to reset password.');
        return;
      }

      setResetSuccess(true);
      onAddNotification('Password Updated 🔑', `Your password was successfully updated.`, 'order');
      
      setTimeout(() => {
        setAuthMode('login');
        setResetSuccess(false);
        setResetToken('');
        setResetPassword('');
      }, 2000);
    } catch (err) {
      setAuthError('Connection failed. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('btm_auth_token');
    localStorage.removeItem('btm_logged_in_user');
    localStorage.removeItem('btm_user_name');
    localStorage.removeItem('btm_user_phone');
    setIsLoggedIn(false);
    setDashboardData(null);
    window.dispatchEvent(new Event('btm_auth_change'));
    onAddNotification('Logout Alert 🚪', 'Logged out of account.', 'promo');
  };

  // Helper values
  const profile = dashboardData?.profile || {
    name: localStorage.getItem('btm_user_name') || 'BTM Customer',
    email: localStorage.getItem('btm_logged_in_user') || '',
    phone: localStorage.getItem('btm_user_phone') || '',
    rewardsPoints: 0,
    createdAt: new Date().toISOString()
  };

  const userOrders = dashboardData?.orders || [];
  const userSpins = dashboardData?.spins || [];
  const userDrawEntries = dashboardData?.drawEntries || [];
  const userRewardsHistory = dashboardData?.rewardsHistory || [];
  const userActivity = dashboardData?.activity || { eligible: false, hasSpun: false, hasEnteredLuckyDraw: false };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-stone-100 min-h-screen">
      
      {/* Page Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-widest text-amber-500 uppercase flex items-center justify-center gap-3">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-pulse" />
          {isLoggedIn ? 'User Account Hub' : 'Authentication Portal'}
          <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
        </h1>
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase mt-2">
          Secure logins, profit transfers, and delivery progress tracking
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {!isLoggedIn ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Column A: Information / Brand Value Card */}
            <div className="md:col-span-5 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-amber-500/10 rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display uppercase text-amber-500 tracking-wider">
                  BTM Member Perks
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-200">Earn Reward Points</h4>
                      <p className="text-stone-400 text-[11px] leading-relaxed">Collect 1 point for every Rs. 100 spent, redeemable on checkout.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-200">Track Invoices Live</h4>
                      <p className="text-stone-400 text-[11px] leading-relaxed">Save address books and follow courier routes easily.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-200">Fast Refund System</h4>
                      <p className="text-stone-400 text-[11px] leading-relaxed">Direct profit extraction for wholesalers and resellers.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-amber-500/5 text-[10px] text-stone-500 font-mono text-center">
                🔒 AES 256-Bit Encrypted Secure Server Link
              </div>
            </div>

            {/* Column B: Forms Panel */}
            <div className="md:col-span-7 bg-zinc-950 border border-amber-500/25 rounded-xl p-6 gold-glow flex flex-col justify-center">
              
              {/* Auth Form Header */}
              <div className="flex gap-4 border-b border-amber-500/10 pb-4 mb-6 text-xs uppercase font-bold font-display tracking-wider">
                <button 
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className={`pb-2 transition-all ${authMode === 'login' ? 'text-amber-500 border-b-2 border-amber-500 font-black' : 'text-stone-500'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className={`pb-2 transition-all ${authMode === 'register' ? 'text-amber-500 border-b-2 border-amber-500 font-black' : 'text-stone-500'}`}
                >
                  Register
                </button>
                {authMode === 'forgot' && (
                  <button className="pb-2 text-amber-500 border-b-2 border-amber-500 font-black">
                    Forgot Password
                  </button>
                )}
                {authMode === 'reset' && (
                  <button className="pb-2 text-amber-500 border-b-2 border-amber-500 font-black">
                    Reset Password
                  </button>
                )}
              </div>

              {authError && (
                <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs text-center">
                  ⚠️ {authError}
                </div>
              )}

              {/* 1. Login Mode */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Email or Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="name@email.com or WhatsApp number"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-3 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-3 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <label className="flex items-center gap-1.5 text-stone-400 cursor-pointer">
                      <input type="checkbox" className="accent-amber-500" defaultChecked />
                      Keep me logged in
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('forgot'); setAuthError(''); }}
                      className="text-amber-500 hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold h-11 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center font-display"
                  >
                    Log In Securely
                  </button>

                  <div className="text-center text-[10px] text-stone-500 pt-2 border-t border-zinc-900">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('register'); setAuthError(''); }}
                      className="text-amber-500 font-bold hover:underline"
                    >
                      Sign Up Now
                    </button>
                  </div>
                </form>
              )}

              {/* 2. Register Mode */}
              {authMode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  {registerSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs text-center">
                      ✓ Registration Successful! Redirecting to login...
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Rajab Dawood"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-2.5 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="rajab@gmail.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-2.5 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">WhatsApp Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="03001234567"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-2.5 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={registerPass}
                        onChange={(e) => setRegisterPass(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs px-3 py-2.5 rounded outline-none h-11"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Confirm</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={registerConfirmPass}
                        onChange={(e) => setRegisterConfirmPass(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs px-3 py-2.5 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-[10px] text-stone-400 mt-2 cursor-pointer">
                    <input type="checkbox" required className="accent-amber-500" defaultChecked />
                    I agree to the BTM Store Terms & Return Policies
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold h-11 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center font-display mt-2"
                  >
                    Create Free Account
                  </button>

                  <div className="text-center text-[10px] text-stone-500 pt-2 border-t border-zinc-900">
                    Already registered?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
                      className="text-amber-500 font-bold hover:underline"
                    >
                      Login Here
                    </button>
                  </div>
                </form>
              )}

              {/* 3. Forgot Password Mode */}
              {authMode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs text-center">
                      ✓ Password reset token generated! Moving to Reset Password...
                    </div>
                  )}

                  <p className="text-xs text-stone-400 leading-relaxed">
                    Enter the email associated with your account. We will generate a secure reset token displayed instantly inside your notification alerts to update your key immediately.
                  </p>

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Registered Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="rajab@gmail.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-3 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
                      className="flex-1 bg-zinc-900 border border-amber-500/10 hover:bg-zinc-800 text-stone-300 font-bold h-11 rounded text-xs uppercase cursor-pointer"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold h-11 rounded text-xs uppercase tracking-wider cursor-pointer font-display"
                    >
                      Generate Token
                    </button>
                  </div>
                </form>
              )}

              {/* 4. Reset Password Mode */}
              {authMode === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {resetSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs text-center">
                      ✓ Password updated successfully! Moving to login...
                    </div>
                  )}

                  <p className="text-xs text-stone-400 leading-relaxed">
                    Check your BTM alerts panel for your reset token, paste it below, and choose a new secure password.
                  </p>

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">Reset Token</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <KeyIcon className="w-4 h-4 text-stone-500" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Paste Reset Token from alerts"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-3 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-stone-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full bg-zinc-900 border border-amber-500/10 focus:border-amber-500 text-stone-200 text-xs pl-9 pr-3 py-3 rounded outline-none h-11"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
                      className="flex-1 bg-zinc-900 border border-amber-500/10 hover:bg-zinc-800 text-stone-300 font-bold h-11 rounded text-xs uppercase cursor-pointer"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold h-11 rounded text-xs uppercase tracking-wider cursor-pointer font-display"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        ) : (
          /* Full scale My Account Dashboard (when logged in) */
          <div className="bg-zinc-950 border border-amber-500/25 rounded-xl p-6 gold-glow space-y-6">
            
            {/* User Profile Banner Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-amber-500/15 justify-between">
              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center text-amber-500 font-extrabold font-display text-2xl uppercase">
                  {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'US'}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-stone-100 font-display">{profile.name}</h4>
                  <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start mt-1 font-mono text-[10px]">
                    <span className="text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">Registered Customer</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400">Status: Verified Connected</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-zinc-950 border border-red-500/30 hover:bg-red-500/10 text-red-500 h-10 px-4 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout Portal
              </button>
            </div>

            {/* Menu Buttons Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs uppercase font-bold tracking-wider font-display">
              {[
                { tab: 'dashboard', label: '📊 Dashboard Overview' },
                { tab: 'orders', label: '📦 My Purchase Orders' },
                { tab: 'rewards', label: '👑 Rewards & Spins' },
                { tab: 'profile', label: '👤 Account Profile' }
              ].map((b) => (
                <button
                  key={b.tab}
                  onClick={() => setUserAccountTab(b.tab)}
                  className={`py-3.5 px-3 min-h-[44px] flex items-center justify-center rounded-lg border text-center transition-colors ${
                    userAccountTab === b.tab
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 font-extrabold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : 'bg-zinc-900 border-amber-500/5 text-stone-300 hover:border-amber-500/20 font-medium'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Tab Contents Panel */}
            <div className="bg-zinc-900/60 p-6 rounded-xl border border-amber-500/10 text-stone-300">
              
              {/* Dashboard Tab */}
              {userAccountTab === 'dashboard' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
                    <span className="font-bold text-amber-500 text-xs uppercase tracking-widest font-mono">My Account Metrics</span>
                    <span className="text-[10px] text-stone-500 font-mono">Last updated: Just now</span>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-400">
                    Welcome back, {profile.name}! Access your secure customer portal, track live delivery progression updates automatically, and participate in BTM loyalty reward activities.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-zinc-950 p-4 rounded-lg border border-amber-500/5 text-center">
                      <span className="text-stone-500 text-[10px] uppercase font-mono block">Loyalty Points</span>
                      <span className="text-lg font-bold text-amber-500 block mt-1">{(profile.rewardsPoints || 0).toLocaleString()} PTS</span>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-lg border border-amber-500/5 text-center">
                      <span className="text-stone-500 text-[10px] uppercase font-mono block">Total Orders placed</span>
                      <span className="text-lg font-bold text-amber-500 block mt-1">{userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}</span>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-lg border border-amber-500/5 text-center">
                      <span className="text-stone-500 text-[10px] uppercase font-mono block">Active Spin wheels</span>
                      <span className="text-lg font-bold text-amber-500 block mt-1">{userActivity.eligible ? '1 Spun Today' : 'Place Order to unlock'}</span>
                    </div>
                  </div>

                  {/* Daily Activity Status List */}
                  <div className="bg-zinc-950 border border-amber-500/10 p-4 rounded-lg mt-4 space-y-3">
                    <h5 className="text-xs font-bold font-display uppercase text-amber-500 tracking-wider">🎯 My Daily Activities & Rewards Eligibility</h5>
                    
                    {!userActivity.eligible ? (
                      <div className="text-xs text-stone-400 bg-amber-500/5 p-3 rounded border border-amber-500/15">
                        ⚠️ <strong>Note:</strong> You must place at least one order to unlock daily activities (Spin Wheel and Lucky Draw entries)! Place an order today to activate your daily reward plays.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex items-center justify-between">
                          <div>
                            <span className="block font-bold">Daily Spin Wheel</span>
                            <span className="text-[10px] text-stone-400">{userActivity.hasSpun ? '✓ Played' : '◯ Ready'}</span>
                          </div>
                          {userActivity.hasSpun ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">Completed</span>
                          ) : (
                            <button onClick={() => window.location.hash = 'spin'} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-2.5 py-1 rounded text-[10px] font-bold uppercase">Spin Now</button>
                          )}
                        </div>

                        <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex items-center justify-between">
                          <div>
                            <span className="block font-bold">Daily Lucky Draw Entry</span>
                            <span className="text-[10px] text-stone-400">{userActivity.hasEnteredLuckyDraw ? '✓ Entered' : '◯ Ready'}</span>
                          </div>
                          {userActivity.hasEnteredLuckyDraw ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">Entered</span>
                          ) : (
                            <button onClick={() => window.location.hash = 'lucky'} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-2.5 py-1 rounded text-[10px] font-bold uppercase">Join Draw</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Purchase Orders History Tab */}
              {userAccountTab === 'orders' && (
                <div className="space-y-4">
                  <span className="font-bold text-amber-500 text-xs uppercase tracking-widest font-mono block border-b border-zinc-800 pb-2">My Active Purchase Orders ({userOrders.length})</span>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {userOrders.length > 0 ? (
                      userOrders.map((o: Order) => (
                        <div key={o.id} className="bg-zinc-950 p-4 rounded-lg border border-amber-500/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-stone-200 flex items-center gap-2 font-mono">
                              <span>Invoice {o.id}</span>
                              <span className="text-[10px] font-normal text-stone-500">({o.date})</span>
                            </h5>
                            <p className="text-[11px] text-stone-400">Amount Paid: Rs. {o.total.toLocaleString()} • Payment Method: {o.paymentMethod}</p>
                            <p className="text-[10px] text-stone-500">Items: {o.items?.map(it => `${it.product.name} (x${it.quantity})`).join(', ')}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              o.status === 'Delivered' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                                : o.status === 'Shipped'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/10 animate-pulse'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/10'
                            }`}>
                              {o.status}
                            </span>
                            <button 
                              onClick={() => {
                                window.location.hash = `order-tracking`;
                                // Set tracking ID via dispatching hash parameters or local helper
                                localStorage.setItem('btm_tracking_id_search', o.id);
                                window.dispatchEvent(new Event('hashchange'));
                              }} 
                              className="text-amber-500 hover:underline text-[11px] font-bold uppercase tracking-wider"
                            >
                              Track Live
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-stone-500 text-xs italic text-center py-4">No order history available. Place an order to track it here!</p>
                    )}
                  </div>
                </div>
              )}

              {/* Rewards Tab */}
              {userAccountTab === 'rewards' && (
                <div className="space-y-4">
                  <span className="font-bold text-amber-500 text-xs uppercase tracking-widest font-mono block border-b border-zinc-800 pb-2">My Rewards & Daily Game Logs</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Points ledger history */}
                    <div className="space-y-2">
                      <h5 className="text-[11px] font-bold font-display uppercase tracking-wider text-amber-400">💎 Loyalty Points ledger</h5>
                      <div className="bg-zinc-950 p-3 rounded border border-zinc-800 max-h-52 overflow-y-auto space-y-2">
                        {userRewardsHistory.length > 0 ? (
                          userRewardsHistory.map((r: any) => (
                            <div key={r.id} className="text-xs border-b border-zinc-900 pb-1.5 last:border-0 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-stone-300">{r.description}</p>
                                <span className="text-[9px] text-stone-500">{new Date(r.timestamp).toLocaleDateString()}</span>
                              </div>
                              <span className="text-amber-400 font-bold font-mono">+{r.points} pts</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-stone-500 text-[10px] italic py-2">No points transactions recorded yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Spins and Draws */}
                    <div className="space-y-2">
                      <h5 className="text-[11px] font-bold font-display uppercase tracking-wider text-amber-400">🎡 Spin & Lucky Draw Entry History</h5>
                      <div className="bg-zinc-950 p-3 rounded border border-zinc-800 max-h-52 overflow-y-auto space-y-2">
                        {userSpins.length === 0 && userDrawEntries.length === 0 ? (
                          <p className="text-stone-500 text-[10px] italic py-2">No spin results or draw submissions yet.</p>
                        ) : (
                          <>
                            {userSpins.map((s: any) => (
                              <div key={s.id} className="text-xs border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-stone-300">Wheel Spin: <span className="text-amber-500">{s.prize}</span></p>
                                  <span className="text-[9px] text-stone-500">{new Date(s.timestamp).toLocaleDateString()}</span>
                                </div>
                                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">Spin Win</span>
                              </div>
                            ))}
                            {userDrawEntries.map((l: any) => (
                              <div key={l.id} className="text-xs border-b border-zinc-900 pb-1.5 flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-stone-300">Lucky Draw Ticket: <span className="text-amber-500 font-mono">{l.ticketId}</span></p>
                                  <span className="text-[9px] text-stone-500">{new Date(l.timestamp).toLocaleDateString()}</span>
                                </div>
                                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">Pool Entry</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile details tab */}
              {userAccountTab === 'profile' && (
                <div className="space-y-4">
                  <span className="font-bold text-amber-500 text-xs uppercase tracking-widest font-mono block border-b border-zinc-800 pb-2">Personal Profile Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="space-y-1">
                      <span className="text-stone-500 block uppercase text-[10px] font-mono">Full Name</span>
                      <span className="text-stone-200 font-bold">{profile.name}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-500 block uppercase text-[10px] font-mono">Email Contact</span>
                      <span className="text-stone-200 font-bold">{profile.email}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-500 block uppercase text-[10px] font-mono">WhatsApp Number</span>
                      <span className="text-stone-200 font-bold">{profile.phone}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-500 block uppercase text-[10px] font-mono">Join Date</span>
                      <span className="text-stone-200 font-bold font-mono">{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

// Simple KeyIcon definition since it is missing from imports
const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
