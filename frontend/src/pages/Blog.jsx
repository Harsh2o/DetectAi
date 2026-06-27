import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>Journal — DetectAi</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-[1000px] mx-auto px-6 py-32 lg:py-48">
        
        <div className="mb-32 animate-fade-in-up">
          <h1 className="text-[12vw] md:text-[6rem] font-bold leading-[0.9] tracking-tighter mb-8 font-serif">
            Journal
          </h1>
        </div>

        <div className="w-full flex flex-col">
          {[
            { title: "Bypassing the un-bypassable: Why generative artifacts always leave a trace.", date: "Oct 12, 2026", readTime: "8 min read", slug: "bypassing-the-un-bypassable" },
            { title: "The geometry of deepfakes.", date: "Sep 28, 2026", readTime: "12 min read", slug: "the-geometry-of-deepfakes" },
            { title: "GPT-4o vs Claude 3: A forensic benchmark.", date: "Sep 15, 2026", readTime: "5 min read", slug: "gpt-4o-vs-claude-3-benchmark" },
            { title: "When algorithms lie: The ethics of zero-trust media.", date: "Sep 01, 2026", readTime: "9 min read", slug: "when-algorithms-lie" },
          ].map((post, i) => (
            <Link key={i} to={`/blog/${post.slug}`} className="group border-t border-surface-container/40 py-12 flex flex-col md:flex-row md:items-baseline justify-between gap-6 hover:bg-surface-variant/5 transition-colors px-4 -mx-4 rounded-xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl group-hover:text-primary transition-colors">{post.title}</h2>
              <div className="flex md:flex-col gap-4 md:gap-1 text-sm font-mono text-on-surface-variant/60 md:text-right">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
