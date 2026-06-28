import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, useAuth, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "./context/ThemeContext";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import UseCases from "./pages/UseCases";
import ApiDocs from "./pages/ApiDocs";
import Company from "./pages/Company";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Protected Route Component using Clerk
const PrivateRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) return null; // Wait for Clerk to load
  
  return isSignedIn ? children : <Navigate to="/login" />;
};

// SSO Callback UI Component
const SSOCallback = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      <h2 className="mt-6 text-xl font-bold text-on-surface">Securely logging you in...</h2>
      <p className="mt-2 text-on-surface-variant">Please wait a moment.</p>
      <AuthenticateWithRedirectCallback 
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </div>
  );
};

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <HelmetProvider>
        <ThemeProvider>
          <Router>
            <VercelAnalytics />
            <Routes>
              {/* Dedicated SEO Landing Pages */}
              <Route path="/" element={<LandingPage toolType="default" />} />
              <Route path="/ai-text-detector" element={<LandingPage toolType="text" />} />
              <Route path="/ai-image-detector" element={<LandingPage toolType="image" />} />
              <Route path="/ai-audio-detector" element={<LandingPage toolType="audio" />} />
              <Route path="/ai-video-detector" element={<LandingPage toolType="video" />} />
              
              {/* Long-Tail SEO Landing Pages */}
              <Route path="/chatgpt-detector-for-teachers" element={<LandingPage toolType="chatgpt_detector_for_teachers" />} />
              <Route path="/midjourney-image-checker" element={<LandingPage toolType="midjourney_image_checker" />} />
              <Route path="/sora-deepfake-detector" element={<LandingPage toolType="sora_deepfake_detector" />} />
              <Route path="/detect-ai-generated-essay" element={<LandingPage toolType="detect_ai_generated_essay" />} />
              <Route path="/elevenlabs-voice-detector" element={<LandingPage toolType="elevenlabs_voice_detector" />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/api" element={<ApiDocs />} />
              <Route path="/company" element={<Company />} />
              <Route path="/products" element={<Products />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sso-callback" element={<SSOCallback />} />
              
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/dashboard/history" element={<PrivateRoute><History /></PrivateRoute>} />
              <Route path="/dashboard/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ClerkProvider>
  );
}

export default App;