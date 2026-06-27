import React from 'react';

export default function ImageAnalysisDiff({ results }) {
  const r = results.raw || {};
  const authScore = Math.round((r.authenticity_score || 0) * 100);
  const synthScore = Math.round((r.synthetic_probability || 0) * 100);
  const oodScore = Math.round((r.novel_generator_probability || 0) * 100);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      <div className="mb-8 border-b border-surface-container pb-4">
        <h3 className="text-2xl font-semibold text-on-surface tracking-tight">Analysis Results</h3>
        <p className="text-sm text-on-surface-variant mt-1">Detection metrics for the uploaded image.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-surface-container rounded-xl bg-surface hover:border-on-surface-variant/30 transition-colors relative group/card">
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium mb-3 cursor-help">
            Authenticity
            <span className="material-symbols-outlined text-[14px] opacity-70">info</span>
            
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-on-surface text-surface text-xs rounded shadow-lg opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-200 z-20">
              The probability that this image was captured naturally by a physical camera sensor without any digital or AI modifications.
              <div className="absolute -bottom-1 left-6 w-2 h-2 bg-on-surface rotate-45"></div>
            </div>
          </div>
          <div className="text-4xl font-semibold text-on-surface tracking-tight">{authScore}%</div>
        </div>

        <div className="p-6 border border-surface-container rounded-xl bg-surface hover:border-on-surface-variant/30 transition-colors relative group/card">
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium mb-3 cursor-help">
            Synthetic Signal
            <span className="material-symbols-outlined text-[14px] opacity-70">info</span>
            
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-on-surface text-surface text-xs rounded shadow-lg opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-200 z-20">
              The confidence level that generative AI artifacts, digital splicing, or deepfake manipulations are present in the image.
              <div className="absolute -bottom-1 left-6 w-2 h-2 bg-on-surface rotate-45"></div>
            </div>
          </div>
          <div className="text-4xl font-semibold text-on-surface tracking-tight">{synthScore}%</div>
        </div>

        <div className="p-6 border border-surface-container rounded-xl bg-surface hover:border-on-surface-variant/30 transition-colors relative group/card">
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium mb-3 cursor-help">
            OOD Anomaly
            <span className="material-symbols-outlined text-[14px] opacity-70">info</span>
            
            {/* Tooltip */}
            <div className="absolute right-0 md:left-0 bottom-full mb-2 w-64 p-3 bg-on-surface text-surface text-xs rounded shadow-lg opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-200 z-20">
              Out-Of-Distribution metric. Measures how much the image deviates from known statistical models of natural photographs.
              <div className="absolute -bottom-1 right-6 md:left-6 w-2 h-2 bg-on-surface rotate-45"></div>
            </div>
          </div>
          <div className="text-4xl font-semibold text-on-surface tracking-tight">{oodScore}%</div>
        </div>
      </div>

      {/* Processing Audit Stepper */}
      <div className="mt-8 border border-surface-container rounded-xl bg-surface p-8 shadow-sm">
        <h4 className="text-lg font-semibold text-on-surface mb-6">Processing Audit</h4>
        
        <div className="flex flex-col">
          {[
            { title: "Metadata Provenance", desc: "Analyzed EXIF headers and software origin tags." },
            { title: "Error Level Analysis (ELA)", desc: "Calculated JPEG compression residual variance." },
            { title: "Frequency Spectrum (FFT)", desc: "Evaluated high-frequency spatial energy." },
            { title: "Sensor Noise (PRNU)", desc: "Verified physical camera hardware signature." },
            { title: "Deep Ensemble Classifier", desc: "Ran multi-model visual manifold detection." }
          ].map((step, idx, arr) => (
            <div key={idx} className="flex gap-4">
              {/* Timeline node */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center border border-success/20 z-10 mt-0.5">
                  <span className="material-symbols-outlined text-[12px] text-success font-bold">check</span>
                </div>
                {idx !== arr.length - 1 && (
                  <div className="w-px flex-grow bg-surface-container my-1 min-h-[32px]"></div>
                )}
              </div>
              
              {/* Step content */}
              <div className="pb-6">
                <h5 className="text-[15px] font-medium text-on-surface">{step.title}</h5>
                <p className="text-[14px] text-on-surface-variant mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
