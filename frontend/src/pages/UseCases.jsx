import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';

export default function UseCases() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>Use Cases — DetectAi</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto px-6 py-32 lg:py-48">
        
        <div className="w-full max-w-4xl mb-32 animate-fade-in-up">
          <h1 className="text-[10vw] md:text-[5rem] font-bold leading-[1] tracking-tighter mb-8 font-serif">
            Built for <br />
            <span className="text-on-surface-variant">Certainty.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
            From academic institutions to enterprise security, absolute truth is not optional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full">
          {[
            { role: "Academia", desc: "Preserve academic integrity. Identify AI-assisted essays and assignments instantly with transparent sentence-level highlighting.", num: "01" },
            { role: "Publishing", desc: "Protect your domain authority. Ensure freelance submissions are 100% human-crafted to avoid algorithmic SEO penalties.", num: "02" },
            { role: "Security", desc: "Defend against synthetic identity fraud. Detect deepfake video and cloned audio in real-time verification pipelines.", num: "03" }
          ].map((useCase, i) => (
            <div key={i} className="flex flex-col border-t border-surface-container/50 pt-8 group cursor-default">
              <span className="text-xs font-mono text-on-surface-variant/50 mb-8">{useCase.num}</span>
              <h2 className="text-3xl font-bold mb-6 tracking-tight group-hover:text-primary transition-colors">{useCase.role}</h2>
              <p className="text-on-surface-variant leading-relaxed font-light text-lg">{useCase.desc}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}