import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Products() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>Suite — DetectAi</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 py-32 lg:py-48">
        
        <div className="w-full max-w-5xl mb-32 animate-fade-in-up">
          <h1 className="text-[12vw] md:text-[6rem] font-bold leading-[0.9] tracking-tighter mb-8 font-serif">
            Truth, <br />
            <span className="text-on-surface-variant">Uncovered.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
            Four specialized engines. One unified platform. Uncompromising accuracy across every medium.
          </p>
        </div>

        <div className="w-full max-w-5xl flex flex-col gap-32">
          
          {/* Text */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12 group">
            <div className="w-full md:w-1/2">
              <div className="text-sm font-bold tracking-widest uppercase text-primary mb-6">01 / Linguistics</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Text Engine</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8 font-light">
                Analyzes perplexity and burstiness at the token level. Instantly flags synthetic patterns from GPT-4o, Claude 3.5, and Gemini with near-perfect confidence.
              </p>
              <Link to="/ai-text-detector" className="inline-flex items-center gap-2 border-b border-primary text-primary pb-1 font-medium hover:opacity-70 transition-opacity">
                Try Text Scanner <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="w-full md:w-1/2 h-[400px] bg-gradient-to-br from-surface to-background rounded-3xl border border-surface-container/30 shadow-2xl relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
               
               {/* UI Mockup for Text Engine */}
               <div className="w-[80%] h-[70%] bg-background rounded-xl border border-surface-container shadow-2xl flex flex-col overflow-hidden relative z-10 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(var(--color-primary),0.1)] transition-all duration-500">
                 <div className="flex px-4 py-3 border-b border-surface-container gap-2 items-center">
                   <div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
                   <div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
                   <div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
                 </div>
                 <div className="p-6 flex flex-col gap-4">
                   <div className="w-3/4 h-3 bg-surface-container-highest rounded"></div>
                   <div className="w-full h-3 bg-surface-container-highest rounded"></div>
                   <div className="w-5/6 h-3 bg-primary/40 rounded relative overflow-hidden">
                     <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                   </div>
                   <div className="w-full h-3 bg-surface-container-highest rounded"></div>
                   <div className="w-1/2 h-3 bg-surface-container-highest rounded"></div>
                 </div>
                 <div className="absolute bottom-6 right-6 bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                   <span className="material-symbols-outlined text-[14px]">warning</span> 99% Synthetic
                 </div>
               </div>

            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-12 group">
            <div className="w-full md:w-1/2">
              <div className="text-sm font-bold tracking-widest uppercase text-tertiary mb-6">02 / Vision</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Image Forensics</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8 font-light">
                Examines spectral artifacts, pixel inconsistencies, and noise distribution invisible to the human eye. Exposes Midjourney v6 and Stable Diffusion instantly.
              </p>
              <Link to="/ai-image-detector" className="inline-flex items-center gap-2 border-b border-tertiary text-tertiary pb-1 font-medium hover:opacity-70 transition-opacity">
                Try Image Scanner <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="w-full md:w-1/2 h-[400px] bg-gradient-to-br from-surface to-background rounded-3xl border border-surface-container/30 shadow-2xl relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-tertiary/5 via-transparent to-transparent"></div>
               
               {/* UI Mockup for Image Forensics */}
               <div className="w-[80%] h-[70%] bg-background rounded-xl border border-surface-container shadow-2xl overflow-hidden relative z-10 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(var(--color-tertiary),0.1)] transition-all duration-500 flex items-center justify-center">
                 <span className="material-symbols-outlined text-[64px] text-surface-container-highest absolute">face</span>
                 <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/10 to-transparent"></div>
                 
                 {/* Bounding box with corners */}
                 <div className="w-32 h-32 relative flex items-center justify-center">
                   <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-tertiary/70"></div>
                   <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-tertiary/70"></div>
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-tertiary/70"></div>
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-tertiary/70"></div>
                   <div className="absolute inset-0 bg-tertiary/10 animate-pulse"></div>
                 </div>

                 <div className="absolute bottom-6 left-6 bg-tertiary/20 text-tertiary border border-tertiary/30 px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                   <span className="material-symbols-outlined text-[14px]">frame_inspect</span> Pixels Analyzed
                 </div>
               </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
