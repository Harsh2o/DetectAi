import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { useParams, Link } from 'react-router-dom';

export default function BlogPost() {
  const { slug } = useParams();
  
  // Create a readable title from the slug
  const title = slug 
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "The Evolution of AI Detection";

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>{title} — DetectAi</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-1 flex flex-col w-full max-w-[800px] mx-auto px-6 py-24 lg:py-32">
        <Link to="/blog" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-16 font-mono text-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Journal
        </Link>
        
        <article className="animate-fade-in-up">
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8 font-serif">
              {title}
            </h1>
            <div className="flex gap-4 text-sm font-mono text-on-surface-variant/60">
              <span>Oct 12, 2026</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none text-on-surface-variant font-light leading-relaxed space-y-8">
            <p className="text-xl md:text-2xl leading-relaxed text-on-surface">
              Generative models have become incredibly sophisticated, but they are still fundamentally mathematical. Where there is math, there is pattern. Where there is pattern, there is detection.
            </p>
            
            <p>
              When evaluating synthetic media—whether it's an essay written by Claude 3.5 or an image synthesized by Midjourney v6—the human eye is increasingly unreliable. We are biologically wired to trust what looks and sounds authentic. But algorithms do not "create" in a vacuum; they predict, optimize, and generate based on weighted probabilities. 
            </p>
            
            <h2 className="text-3xl font-bold text-on-surface mt-16 mb-8 tracking-tight">The Illusion of Randomness</h2>
            <p>
              One of the most profound markers of synthetic text is its lack of true burstiness. Human writers are chaotic. We write long, meandering sentences followed by a punchy fragment. We use highly improbable words in strange contexts because we are drawing on lived experience, not statistical likelihood. 
            </p>
            <p>
              LLMs, by design, gravitate toward the mean. Even when prompted to "act human" or "increase temperature," the underlying architecture is still solving an optimization problem. Our forensic engines don't look for what is wrong with the text; they look for what is too perfect.
            </p>
            
            <div className="my-12 p-8 border-l-2 border-primary bg-primary/5 text-primary italic font-serif text-2xl">
              "We don't look for what is wrong with the text; we look for what is too perfect."
            </div>
            
            <h2 className="text-3xl font-bold text-on-surface mt-16 mb-8 tracking-tight">The Future of Verification</h2>
            <p>
              As deepfakes and synthetic audio continue to proliferate, the need for deterministic, highly accurate detection systems will only grow. At DetectAi, we are constantly evolving our quad-modal architecture to stay ahead of the curve, ensuring that absolute truth remains accessible to everyone.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
