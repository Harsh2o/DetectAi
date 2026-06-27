import React, { useState } from 'react';

export default function TextAnalysisDiff({ results, textInput }) {
  const r = results.raw;
  const [activeChunk, setActiveChunk] = useState(null);

  // Map V4 chunks to UI chunks
  const mappedChunks = r.chunks?.map(c => ({
    text: textInput ? textInput.substring(c.start, c.end) : "",
    semantic_label: c.score > 0.55 ? 'AI' : 'Human',
    score: c.score
  })) || [];

  const aiChunks = mappedChunks.filter(c => c.semantic_label === 'AI');

  return (
    <div className="flex flex-col gap-8 animate-fade-in font-sans">
      
      {/* Refined Metric Header */}
      <div className="flex flex-wrap items-center gap-8 pb-6 border-b border-surface-container">
        
        {r.prediction === 'AI' && r.model_family && (
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-1">
              Model Signature
            </span>
            <div className="flex items-center mt-1">
              <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-[13px] flex items-center gap-1.5 border border-primary/20 shadow-sm whitespace-nowrap">
                <span className="material-symbols-outlined text-[16px]">memory</span>
                {r.model_family}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-on-surface-variant mb-1">
            Detection Reasoning
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {r.explanations?.map((exp, i) => (
              <span key={i} className="text-xs bg-surface-variant text-on-surface-variant px-2 py-1 rounded">
                {exp}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Document Map (Left) */}
        <div className="md:w-2/3 bg-surface border border-surface-container rounded-2xl overflow-hidden shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-surface-container bg-surface-variant/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="material-symbols-outlined text-primary text-[20px]">document_scanner</span>
               <h4 className="font-label-md font-bold text-on-surface">Document Map</h4>
            </div>
            <div className="flex gap-4 text-xs font-medium">
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-error"></div> AI Gen</div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-success"></div> Human</div>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[400px] leading-relaxed text-on-surface text-[15px]">
            {mappedChunks.map((chunk, idx) => (
              <span
                key={idx}
                onMouseEnter={() => setActiveChunk(chunk)}
                onMouseLeave={() => setActiveChunk(null)}
                className={`inline transition-all duration-300 cursor-help px-1 rounded-sm mx-0.5 border-b-2
                  ${chunk.semantic_label === 'AI' 
                    ? 'bg-error/10 border-error/40 hover:bg-error/20 text-error' 
                    : 'bg-success/5 border-success/30 hover:bg-success/20 text-success'}
                  ${activeChunk === chunk ? 'ring-2 ring-primary/30 shadow-sm' : ''}
                `}
              >
                {chunk.text}{" "}
              </span>
            ))}
          </div>
        </div>

        {/* Forensic Inspector (Right) */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="bg-surface border border-surface-container rounded-2xl overflow-hidden shadow-lg flex-grow relative min-h-[300px]">
            <div className="px-5 py-4 border-b border-surface-container bg-surface-variant/30">
               <h4 className="font-label-md font-bold text-on-surface flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-[20px]">manage_search</span>
                 Forensic Inspector
               </h4>
            </div>
            
            {activeChunk ? (
              <div className="p-5 animate-fade-in flex flex-col gap-4 h-full">
                <div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Selected Segment</div>
                  <p className="text-[13px] text-on-surface italic line-clamp-4 border-l-2 border-primary/50 pl-3">
                    "{activeChunk.text}"
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center bg-surface-variant/30 p-3 rounded-lg border border-surface-container/50">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase">Classification</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${activeChunk.semantic_label === 'AI' ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
                      {activeChunk.semantic_label === 'AI' ? 'AI Generated' : 'Human Written'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 bg-surface-variant/30 p-3 rounded-lg border border-surface-container/50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase">Neural Confidence</span>
                      <span className="text-sm font-bold text-on-surface">{Math.round(activeChunk.score * 100)}%</span>
                    </div>
                    <div className="w-full bg-surface-container/50 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${activeChunk.semantic_label === 'AI' ? 'bg-error' : 'bg-success'}`} style={{ width: `${activeChunk.score * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/60">
                <span className="material-symbols-outlined text-[48px] opacity-20 mb-3">mouse</span>
                <p className="text-sm font-medium">Hover over any sentence in the Document Map to see its forensic breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
