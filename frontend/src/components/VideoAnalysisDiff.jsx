export default function VideoAnalysisDiff({ results }) {
  const r = results.raw;

  const signals = [
    { key: 'vit_ensemble', label: 'Spatial Artifacts (ViT Ensemble)', desc: 'Analyzes pixel-level blending and generator artifacts.' },
    { key: 'prnu_score', label: 'Camera Noise (PRNU Signature)', desc: 'Verifies the physical authenticity of the camera sensor noise.' },
    { key: 'fft_score', label: 'Frequency Spectral (FFT Ratio)', desc: 'Detects lack of high-frequency detail common in AI diffusion.' },
    { key: 'temporal_consistency', label: 'Micro-Flicker Variance', desc: 'Measures MSE variance to catch pixel hallucination across time.' },
    { key: 'motion_physics', label: 'Optical Flow (RAFT Physics)', desc: 'Validates the physics of movement and fluid dynamics.' },
    { key: 'depth_physics', label: '3D Geometric Volume (MiDaS)', desc: 'Computes a 3D point cloud to ensure depth consistency.' },
    { key: 'semantic_drift', label: 'Semantic Drift (Meta DINOv2)', desc: 'Tracks 384-dimensional conceptual drift across frames.' },
  ];

  return (
    <div className="flex flex-col gap-8 font-body-md text-on-surface">
      
      {/* Professional 7-Branch Breakdown */}
      <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-sm">
         <div className="flex items-center gap-3 mb-8 border-b border-surface-container pb-4">
            <span className="material-symbols-outlined text-primary text-[28px]">account_tree</span>
            <div>
              <h4 className="font-headline-sm font-bold text-on-surface tracking-tight">Multi-Modal Physics Engine</h4>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Analyzing 7 distinct physical and semantic heuristics</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {signals.map((sig) => {
               const val = r.signal_breakdown?.[sig.key];
               const isPending = val === null || val === undefined;
               const score = isPending ? 0 : Math.round(val * 100);
               const isDanger = val > 0.5;
               
               return (
                  <div key={sig.key} className="flex flex-col group">
                     <div className="flex justify-between items-start mb-1.5 relative">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 cursor-help group/tooltip">
                            <span className="text-sm font-bold text-on-surface">{sig.label}</span>
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant opacity-50 transition-opacity group-hover/tooltip:opacity-100">info</span>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute left-0 top-6 z-20 w-48 p-2.5 bg-surface-variant/95 backdrop-blur-sm text-on-surface text-xs rounded-lg shadow-xl border border-surface-container opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
                              {sig.desc}
                            </div>
                          </div>
                        </div>
                        <span className={`text-sm font-black px-2 py-0.5 rounded ${isPending ? 'text-on-surface-variant bg-surface-variant' : isDanger ? 'text-error bg-error/10' : 'text-success bg-success/10'}`}>
                           {isPending ? "OFFLINE" : `${score}% AI`}
                        </span>
                     </div>
                     <div className="w-full bg-surface-container/50 rounded-full h-2 mt-2 relative overflow-hidden flex">
                        {!isPending && (
                           <>
                             {/* Indicator bar */}
                             <div 
                                className={`h-full transition-all duration-1000 relative z-10 ${isDanger ? 'bg-error' : 'bg-success'}`} 
                                style={{width: `${score}%`}}>
                                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20"></div>
                             </div>
                           </>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
      
      {/* Premium Processing Terminal */}
      {r.processing_notes && r.processing_notes.length > 0 && (
        <div className="bg-surface-variant/20 dark:bg-black/40 border border-surface-container rounded-2xl p-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-10 bg-surface border-b border-surface-container flex items-center px-4 gap-2">
             <div className="w-3 h-3 rounded-full bg-error/80"></div>
             <div className="w-3 h-3 rounded-full bg-warning/80"></div>
             <div className="w-3 h-3 rounded-full bg-success/80"></div>
             <div className="flex-grow flex justify-center">
                <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest font-bold">System_Audit_Log.sh</span>
             </div>
          </div>
          <div className="mt-10 overflow-x-auto">
            <ul className="text-xs space-y-3 font-mono text-on-surface/80">
              {r.processing_notes.filter(n => !n.includes('CRITICAL: Cloud')).map((note, i) => (
                 <li key={i} className="flex gap-3 items-start">
                   <span className="text-primary font-bold shrink-0">~%</span>
                   <span className="leading-relaxed opacity-90">{note}</span>
                 </li>
              ))}
              <li className="flex gap-3 items-start mt-4 text-on-surface-variant pt-2 border-t border-surface-container/30">
                 <span className="shrink-0 animate-pulse text-primary font-bold">_</span>
                 <span>Analysis sequence complete. EOF.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
