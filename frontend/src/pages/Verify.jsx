import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  
  // Clerk defaults to a 6-digit code
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const { isLoaded, signUp, setActive } = useSignUp();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    const val = element.value;
    setOtp([...otp.map((d, idx) => (idx === index ? val : d))]);
    
    // Focus next input
    if (val !== "") {
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).split("");
    
    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      newOtp[index] = value;
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }
    });
    setOtp(newOtp);
    if (inputRefs.current[5]) inputRefs.current[5].focus();
  };

  const handleConfirm = async (e) => {
    e?.preventDefault();
    const token = otp.join("");
    
    if (token.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    
    if (!isLoaded) return;
    
    try {
      setError("");
      setLoading(true);
      
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: token,
      });
      
      if (completeSignUp.status !== 'complete') {
        console.log(JSON.stringify(completeSignUp, null, 2));
        setError("Invalid code. Please try again.");
      }
      
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Invalid code. Please try again.");
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;
    try {
      setError("");
      setLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      alert("Code resent to your email!");
    } catch (err) {
      setError("Failed to resend code: " + (err.errors?.[0]?.longMessage || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[560px] bg-surface/50 rounded-2xl p-10 shadow-2xl border border-surface-container">
        
        <h1 className="text-3xl font-bold text-on-surface mb-2">Verify Your Account</h1>
        <p className="text-on-surface-variant mb-8">Almost there! We just need to verify your account.</p>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="text-center mb-8">
          <p className="text-on-surface-variant text-[15px] leading-relaxed">
            We have sent a verification code to<br />
            <span className="text-primary font-medium">{email}</span>. Please check your inbox and<br />
            spam folder, and enter the code below.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
          {otp.map((data, index) => (
            <input
              className="w-10 h-12 sm:w-12 sm:h-14 bg-background border border-surface-container text-on-surface text-center text-xl font-bold rounded-lg focus:outline-none focus:border-primary transition-colors"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => inputRefs.current[index] = el}
            />
          ))}
        </div>

        <button 
          onClick={handleConfirm}
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-primary text-on-primary hover:bg-primary/90 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined">verified</span>
          )}
          Verify Account
        </button>

        <div className="text-center">
          <p className="text-on-surface-variant text-sm mb-2">Didn't receive the code?</p>
          <button 
            onClick={handleResend}
            disabled={loading}
            className="text-primary font-bold hover:underline disabled:opacity-50"
          >
            Resend Email
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors">
            ← Back to sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;