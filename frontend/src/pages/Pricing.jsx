import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function Pricing() {
  const { isSignedIn } = useAuth();
  const checkoutLink = isSignedIn ? "/dashboard" : "/register";

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>Pricing — DetectAi</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 py-32 lg:py-48">
        
        <div className="w-full max-w-5xl mb-24 animate-fade-in-up text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-8 font-serif">
            One Plan. <br />
            <span className="text-on-surface-variant">Infinite Clarity.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative">
          
          {/* Free Tier */}
          <div className="bg-transparent border-t md:border-t-0 md:border-l border-surface-container/30 p-12 flex flex-col opacity-60 hover:opacity-100 transition-opacity">
            <h2 className="text-xl font-bold mb-4 tracking-wide uppercase text-on-surface-variant">Basic</h2>
            <div className="text-5xl font-light mb-12 font-serif">$0 <span className="text-lg text-on-surface-variant font-sans">/ forever</span></div>
            <ul className="space-y-6 mb-12 flex-1 text-on-surface-variant font-light">
              <li>3 Free scans daily</li>
              <li>Text analysis</li>
              <li>Standard confidence scoring</li>
            </ul>
            <Link to={checkoutLink} className="w-full text-center py-4 rounded-full border border-surface-container text-on-surface font-medium hover:bg-surface-variant/20 transition-colors">{isSignedIn ? "Go to Dashboard" : "Start Free"}</Link>
          </div>

          {/* Pro Tier (Floating effect) */}
          <div className="bg-surface/50 backdrop-blur-xl border border-surface-container/30 rounded-3xl p-12 flex flex-col relative shadow-[0_0_80px_rgba(255,255,255,0.02)]">
            <h2 className="text-xl font-bold mb-4 tracking-wide uppercase text-primary">Pro</h2>
            <div className="text-5xl font-light mb-12 font-serif">$15 <span className="text-lg text-on-surface-variant font-sans">/ month</span></div>
            <ul className="space-y-6 mb-12 flex-1 text-on-surface font-light">
              <li>Unlimited scans</li>
              <li>Quad-modal engine (Text, Audio, Video, Image)</li>
              <li>Explainable AI heatmaps</li>
              <li>Developer API Access</li>
            </ul>
            <Link to={checkoutLink} className="w-full text-center py-4 rounded-full bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">{isSignedIn ? "Upgrade to Pro" : "Subscribe Now"}</Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}