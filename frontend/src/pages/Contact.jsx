import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>Contact — DetectAi</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[800px] mx-auto px-6 py-32">
        
        <div className="w-full animate-fade-in-up">
          <h1 className="text-6xl font-bold tracking-tighter mb-16 font-serif">
            Say Hello.
          </h1>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[40px] text-primary">check</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 font-serif">Message Sent</h2>
              <p className="text-on-surface-variant font-light">We'll get back to you as soon as possible.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 px-8 py-3 rounded-full border border-surface-container text-on-surface font-medium hover:bg-surface-variant/20 transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-12 w-full" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant/60">Your Name</label>
                <input required type="text" className="w-full bg-transparent border-b border-surface-container/50 py-4 text-2xl text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/30 font-light" placeholder="Jane Doe" disabled={status === 'submitting'} />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant/60">Email Address</label>
                <input required type="email" className="w-full bg-transparent border-b border-surface-container/50 py-4 text-2xl text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/30 font-light" placeholder="jane@example.com" disabled={status === 'submitting'} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant/60">Message</label>
                <textarea required className="w-full bg-transparent border-b border-surface-container/50 py-4 text-2xl text-on-surface focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none placeholder:text-on-surface-variant/30 font-light" placeholder="How can we help?" disabled={status === 'submitting'}></textarea>
              </div>

              <div className="pt-8">
                <button type="submit" disabled={status === 'submitting'} className="px-12 py-5 rounded-full bg-on-surface text-background font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
