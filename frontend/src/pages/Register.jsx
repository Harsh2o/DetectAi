import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp, useAuth } from '@clerk/clerk-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoaded, signUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Password validation checks
  const hasLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecialOrNumber = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const score = [hasLength, hasCapital, hasSpecialOrNumber].filter(Boolean).length;
  const isPasswordValid = score === 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard'
      });
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Failed to register with Google');
      setLoading(false);
    }
  };

  if (isSignedIn) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-surface/50 border border-surface-container rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Start Writing Faster</h1>
        <p className="text-on-surface-variant mb-6">
          Register securely below. <Link to="/login" className="text-primary hover:underline font-medium">Already have an account?</Link>
        </p>
        
        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-surface-container rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-background border rounded-xl px-4 py-3 text-on-surface focus:outline-none transition-colors mb-3 ${password.length > 0 ? (isPasswordValid ? 'border-success focus:border-success' : 'border-error focus:border-error') : 'border-surface-container focus:border-primary'}`}
              placeholder="••••••••"
            />
            
            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex gap-1.5 h-1.5">
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${score >= 1 ? (score === 3 ? 'bg-success' : 'bg-error') : 'bg-surface-container'}`}></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${score >= 2 ? (score === 3 ? 'bg-success' : 'bg-warning') : 'bg-surface-container'}`}></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${score === 3 ? 'bg-success' : 'bg-surface-container'}`}></div>
                </div>
                <div className="text-xs space-y-1.5">
                  <div className={`flex items-center gap-2 transition-colors duration-300 ${hasLength ? 'text-success font-medium' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[14px]">{hasLength ? 'check_circle' : 'radio_button_unchecked'}</span>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 transition-colors duration-300 ${hasCapital ? 'text-success font-medium' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[14px]">{hasCapital ? 'check_circle' : 'radio_button_unchecked'}</span>
                    One capital letter
                  </div>
                  <div className={`flex items-center gap-2 transition-colors duration-300 ${hasSpecialOrNumber ? 'text-success font-medium' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[14px]">{hasSpecialOrNumber ? 'check_circle' : 'radio_button_unchecked'}</span>
                    One number or special character
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); setAgreed(!agreed); }}>
              <input type="checkbox" required checked={agreed} readOnly className="hidden" />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors mt-0.5 shrink-0 ${agreed ? 'border-primary bg-primary/10' : 'border-surface-container bg-background group-hover:border-primary/50'}`}>
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${agreed ? 'bg-primary' : 'bg-transparent'}`}></div>
              </div>
              <span className="text-on-surface text-sm">
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>
          </div>
          
          <div id="clerk-captcha"></div>

          <button disabled={loading || !isLoaded || !isPasswordValid || !agreed} className="w-full bg-primary text-on-primary font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          
          <button type="button" onClick={handleGoogleLogin} disabled={loading || !isLoaded} className="w-full bg-background border border-surface-container text-on-surface font-bold rounded-xl py-3.5 flex items-center justify-center gap-3 hover:bg-surface-variant/50 transition-colors mt-4 disabled:opacity-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;