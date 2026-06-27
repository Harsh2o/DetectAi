import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="bg-background w-full sticky top-0 z-50 transition-all duration-300 border-b border-surface-container/30">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        {/* Brand */}
        <Link to="/" className="font-headline-md text-primary font-bold flex items-center gap-2 tracking-tight text-2xl hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-[28px]">troubleshoot</span>
          DetectAi
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 bg-surface-variant/40 px-6 py-2 rounded-full border border-surface-container/50">
          <Link to="/products" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Products</Link>
          <Link to="/use-cases" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Use Cases</Link>
          <Link to="/pricing" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Pricing</Link>
          <Link to="/api" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">API</Link>
          <Link to="/blog" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Blog</Link>
          <Link to="/contact" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Contact</Link>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          {isSignedIn ? (
            <Link to="/dashboard" className="bg-primary text-on-primary font-label-md font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all whitespace-nowrap">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-flex text-on-surface font-label-md font-semibold hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-primary text-on-primary font-label-md font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all whitespace-nowrap">Start writing</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
