import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';

export default function ApiDocs() {
  const [copied, setCopied] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const curlCommand = `curl -X POST "https://api.detectai.tech/v1/detect/text" \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your payload here..."}'`;

  const jsonResponse = `{
  "id": "req_8f7b2",
  "verdict": "AI",
  "probability": 0.98,
  "latency_ms": 142
}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-body-md text-[#ededed] selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <Helmet>
        <title>API — DetectAi</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto">
        
        {/* Docs Column */}
        <div className="w-full lg:w-1/2 p-8 lg:p-24 border-r border-[#222]">
          <div className="max-w-xl animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Detect API</h1>
            <p className="text-[#a1a1aa] mb-16 font-light leading-relaxed">
              Integrate world-class synthetic media detection seamlessly.
            </p>

            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">POST /v1/detect/text</h2>
              <p className="text-[#a1a1aa] font-light leading-relaxed mb-6">
                Evaluates a string of text for algorithmic predictability, returning a confidence score and a binary verdict.
              </p>
              
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#71717a] mb-4">Parameters</h3>
              <div className="border-t border-[#222] py-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-sm text-primary">text</span>
                  <span className="text-xs text-[#71717a]">string (required)</span>
                </div>
                <p className="text-sm text-[#a1a1aa] font-light">The content to be analyzed. Maximum 50,000 characters.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Column */}
        <div className="w-full lg:w-1/2 bg-black p-8 lg:p-24 flex flex-col justify-center">
          
          <div className="mb-8 relative group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-widest text-[#71717a] block">Request</span>
              <button onClick={() => handleCopy(curlCommand, 'curl')} className="text-xs text-[#71717a] hover:text-[#ededed] transition-colors flex items-center gap-1">
                {copied === 'curl' ? <><span className="material-symbols-outlined text-[14px]">check</span> Copied</> : <><span className="material-symbols-outlined text-[14px]">content_copy</span> Copy</>}
              </button>
            </div>
            <div className="bg-[#111] rounded-xl border border-[#222] p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-loose">
<span className="text-[#c678dd]">curl</span> -X POST <span className="text-[#98c379]">"https://api.detectai.tech/v1/detect/text"</span> \
  -H <span className="text-[#98c379]">"Authorization: Bearer sk_live_..."</span> \
  -H <span className="text-[#98c379]">"Content-Type: application/json"</span> \
  -d <span className="text-[#98c379]">'&#123;"text": "Your payload here..."&#125;'</span>
              </pre>
            </div>
          </div>

          <div className="relative group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-widest text-[#71717a] block">Response</span>
              <button onClick={() => handleCopy(jsonResponse, 'json')} className="text-xs text-[#71717a] hover:text-[#ededed] transition-colors flex items-center gap-1">
                {copied === 'json' ? <><span className="material-symbols-outlined text-[14px]">check</span> Copied</> : <><span className="material-symbols-outlined text-[14px]">content_copy</span> Copy</>}
              </button>
            </div>
            <div className="bg-[#111] rounded-xl border border-[#222] p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-loose text-[#abb2bf]">
&#123;
  <span className="text-[#e06c75]">"id"</span>: <span className="text-[#98c379]">"req_8f7b2"</span>,
  <span className="text-[#e06c75]">"verdict"</span>: <span className="text-[#98c379]">"AI"</span>,
  <span className="text-[#e06c75]">"probability"</span>: <span className="text-[#d19a66]">0.98</span>,
  <span className="text-[#e06c75]">"latency_ms"</span>: <span className="text-[#d19a66]">142</span>
&#125;
              </pre>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}