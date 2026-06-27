import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import ThemeToggle from "../components/ThemeToggle";
import TextAnalysisDiff from "../components/TextAnalysisDiff";
import ImageAnalysisDiff from "../components/ImageAnalysisDiff";
import AudioAnalysisDiff from "../components/AudioAnalysisDiff";
import VideoAnalysisDiff from "../components/VideoAnalysisDiff";
import html2pdf from "html2pdf.js";

export default function Dashboard() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mode, setMode] = useState("text"); // text, image, audio, video

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get("mode");
    if (urlMode && ['text', 'image', 'audio', 'video'].includes(urlMode)) {
      setMode(urlMode);
    }
  }, [location.search]);

  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState("Ready"); // Ready, Scanning, Complete
  const [results, setResults] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  async function handleLogout() {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }
  const [hfToken, setHfToken] = useState(localStorage.getItem('hf_token') || '');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setTextInput(""); // Clear text if file uploaded
      if (file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleTokenChange = (e) => {
    const token = e.target.value;
    setHfToken(token);
    localStorage.setItem('hf_token', token);
  };

  const handleAnalyze = async () => {
    if ((!textInput.trim() && !uploadedFile) || status === "Scanning" || !isTextValid) return;
    
    setStatus("Scanning");
    setResults(null);
    
    try {
      let response;
      let endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/detect/`;
      let modality = "text";
      
      const headers = {};
      if (hfToken) {
        headers['X-HF-Token'] = hfToken;
      }
      
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        
        if (uploadedFile.type.startsWith("image/")) { endpoint += "image"; modality = "image"; }
        else if (uploadedFile.type.startsWith("video/")) { endpoint += "video"; modality = "video"; }
        else if (uploadedFile.type.startsWith("audio/")) { endpoint += "audio"; modality = "audio"; }
        else throw new Error("Unsupported file type.");
        
        response = await fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: formData,
        });
      } else {
        endpoint += "text";
        headers["Content-Type"] = "application/json";
        response = await fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ text: textInput }),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
        setStatus("Ready");
        return;
      }
      
      let data = await response.json();
      
      // Polling Logic for Async Jobs
      if (data.status === "processing" && data.task_id) {
        let statusEndpoint = endpoint.endsWith('/') ? `${endpoint}status/${data.task_id}` : `${endpoint}/status/${data.task_id}`;
        
        while (true) {
          const statusRes = await fetch(statusEndpoint);
          const statusData = await statusRes.json();
          if (statusData.status === "completed") {
            data = statusData.results; // Contains {verdict: {...}, breakdown: {...}}
            // Flatten verdict so UI components find the scores at the root
            if (data.verdict) {
              data = { ...data, ...data.verdict };
            }
            break;
          } else if (statusData.status === "failed") {
            throw new Error(statusData.error || "Analysis failed");
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Also flatten for immediate cache hits
      if (data.status === "cached" && data.results) {
        data = data.results;
        if (data.verdict) {
            data = { ...data, ...data.verdict };
        }
      }
      
      setStatus("Complete");
      
      let confidenceScore = 0;
      let predictionText = "Real";
      
      if (modality === 'video') {
        confidenceScore = Math.round((data.confidence || 0) * 100);
        predictionText = confidenceScore >= 50 ? "AI" : "Real";
      } else if (modality === 'image' || modality === 'audio') {
        confidenceScore = Math.round((data.synthetic_probability || 0) * 100);
        predictionText = confidenceScore >= 50 ? "AI" : "Real";
      } else {
        confidenceScore = data.probability !== undefined ? data.probability : Math.round((data.confidence_score || 0) * 100);
        predictionText = confidenceScore >= 50 ? "AI" : "Real";
      }
      
      setResults({
        modality,
        raw: data,
        confidence: confidenceScore,
        prediction: predictionText
      });
      
      // Save to Database History
      try {
        let preview = "";
        if (uploadedFile) {
           preview = uploadedFile.name;
        } else {
           preview = textInput.substring(0, 60) + (textInput.length > 60 ? '...' : '');
        }
        
        if (user && user.id) {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/history/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              user_id: user.id,
              modality: modality,
              content_snippet: preview,
              prediction: predictionText,
              confidence: confidenceScore
            })
          });
        }
      } catch (e) {
        console.error("Failed to save history to database", e);
      }
      
    } catch (err) {
      console.error("Backend offline or failed to fetch:", err);
      setStatus("Ready");
      alert("Failed to connect to the AI engine. Please ensure your backend server is running on port 8000.");
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    const opt = {
      margin:       0.5,
      filename:     'DetectAi_Forensic_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const wordCount = textInput.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isTextValid = mode === 'text' ? (wordCount >= 40 && wordCount <= 1000) : true;

  return (
    <div className="flex min-h-screen font-body-md text-on-surface bg-background antialiased relative">
      {/* SideNav - Sliding */}
      <nav className={`fixed md:sticky top-0 h-screen bg-surface border-r border-surface-container flex-shrink-0 shadow-xl transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-[68px]'} overflow-hidden flex flex-col py-4 px-2`}>
        <div className={`mb-6 flex ${sidebarOpen ? 'justify-between px-2' : 'justify-center'} items-center`}>
          <Link to="/" className={`flex items-center gap-2 transition-opacity duration-300 whitespace-nowrap hover:opacity-80 cursor-pointer ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
            <span className="material-symbols-outlined text-[28px] text-primary">troubleshoot</span>
            <div className="font-headline-md font-bold text-primary tracking-tight text-xl">DetectAi</div>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant flex items-center justify-center tooltip" title={sidebarOpen ? "Close sidebar" : "Open sidebar"}>
            <span className="material-symbols-outlined text-[22px]">{sidebarOpen ? 'left_panel_close' : 'left_panel_open'}</span>
          </button>
        </div>
        <div className="flex flex-col gap-1 flex-grow">
          <Link to="/dashboard" className={`text-primary rounded-xl flex items-center p-3 font-label-md font-bold transition-all ${sidebarOpen ? 'bg-primary/5 border border-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5 justify-center'} whitespace-nowrap group`} title={!sidebarOpen ? "Workspace" : ""}>
            <span className={`material-symbols-outlined ${sidebarOpen ? 'mr-3' : ''}`}>grid_view</span>
            <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Workspace</span>
          </Link>
          <Link to="/dashboard/history" className={`text-on-surface-variant flex items-center p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all font-label-md whitespace-nowrap ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? "History" : ""}>
            <span className={`material-symbols-outlined ${sidebarOpen ? 'mr-3' : ''}`}>history</span>
            <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>History</span>
          </Link>
          <Link to="/dashboard/analytics" className={`text-on-surface-variant flex items-center p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all font-label-md whitespace-nowrap ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? "Analytics" : ""}>
            <span className={`material-symbols-outlined ${sidebarOpen ? 'mr-3' : ''}`}>bar_chart</span>
            <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Analytics</span>
          </Link>
          <Link to="/dashboard/settings" className={`text-on-surface-variant flex items-center p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all font-label-md whitespace-nowrap ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? "Settings" : ""}>
            <span className={`material-symbols-outlined ${sidebarOpen ? 'mr-3' : ''}`}>settings</span>
            <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Settings</span>
          </Link>
          
          {/* Hidden UI Space for future use */}
        </div>
        <div className="mt-auto flex flex-col gap-1">
          {/* User Profile Block */}
          <div className={`flex items-center p-2 rounded-xl mb-1 ${sidebarOpen ? 'bg-surface-variant/30 border border-surface-container gap-3' : 'justify-center hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.primaryEmailAddress?.emailAddress ? user.primaryEmailAddress.emailAddress.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={`flex flex-col overflow-hidden transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              <span className="text-sm font-bold text-on-surface truncate">{user?.primaryEmailAddress?.emailAddress || "Demo User"}</span>
              <span className="text-[10px] text-primary uppercase tracking-wider font-bold">Pro Plan</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className={`text-on-surface-variant flex items-center p-3 hover:bg-error/10 hover:text-error rounded-xl transition-all font-label-md text-left w-full whitespace-nowrap ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? "Log Out" : ""}>
            <span className={`material-symbols-outlined ${sidebarOpen ? 'mr-3' : ''}`}>logout</span>
            <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Log Out</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace - Scrollable */}
      <main className={`flex-grow flex flex-col w-full min-w-0 transition-all duration-300`}>
        
        <div className={`flex-grow p-xl flex ${results ? 'flex-col xl:flex-row gap-xl' : 'items-center justify-center'}`}>
        {/* Left/Center: Input Dropzone */}
        <div className={`flex flex-col glass-panel rounded-2xl overflow-hidden bg-surface min-h-[550px] transition-all duration-500 shadow-2xl border border-surface-container ${results ? 'w-full xl:w-1/3' : 'w-full max-w-3xl'}`}>
          
          {/* Feature Tabs */}
          <div className="flex border-b border-surface-container bg-surface-variant/30">
            {['text', 'image', 'audio', 'video'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setTextInput(''); setUploadedFile(null); setFilePreview(null); }}
                className={`flex-1 py-4 font-label-md capitalize transition-all border-b-2 ${mode === m ? 'border-primary text-primary font-bold bg-surface shadow-[inset_0_-2px_10px_rgba(var(--color-primary),0.05)]' : 'border-transparent text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    {m === 'text' ? 'notes' : m === 'image' ? 'image' : m === 'audio' ? 'graphic_eq' : 'movie'}
                  </span>
                  {m}
                </div>
              </button>
            ))}
          </div>
          <div className="flex-grow flex flex-col relative bg-gradient-to-b from-background to-surface">
            {mode === 'text' ? (
              <div className="flex-grow flex flex-col p-6">
                <div className="text-on-surface-variant font-label-sm flex justify-between items-center mb-2">
                  <span>Paste {mode} to analyze (40 - 1000 words)</span>
                  <div className="flex items-center gap-3">
                    <span className={textInput.length > 0 ? (isTextValid ? "text-primary font-bold" : "text-error font-bold") : ""}>
                      {wordCount} / 1000 words
                    </span>
                    {textInput.length > 0 && (
                      <button onClick={() => setTextInput('')} className="flex items-center justify-center text-error hover:bg-error/10 p-1.5 rounded-md transition-colors tooltip" title="Clear text">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
                <textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full flex-grow bg-transparent border border-surface-container rounded-xl resize-none p-6 text-on-surface font-body-lg focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/30 leading-relaxed outline-none" 
                  placeholder="Paste document text here..."
                />
              </div>
            ) : filePreview && mode === 'image' ? (
              <div className="flex-grow flex flex-col p-6">
                 <div className="text-on-surface-variant font-label-sm flex justify-between mb-4">
                  <span>Selected Image</span>
                  <button onClick={() => { setUploadedFile(null); setFilePreview(null); }} className="text-error hover:underline">Remove</button>
                </div>
                <div className="flex-grow flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl border border-surface-container overflow-hidden relative group max-h-[300px]">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            ) : uploadedFile ? (
              <div className="flex-grow flex items-center justify-center p-6">
                 {mode === 'video' && filePreview ? (
                   <div className="w-full max-w-md relative group rounded-xl overflow-hidden shadow-lg border border-surface-container bg-black/80">
                     <video src={filePreview} controls className="w-full h-auto max-h-[300px] object-contain block" />
                     <button onClick={() => { setUploadedFile(null); setFilePreview(null); }} className="absolute top-3 right-3 bg-black/60 hover:bg-error text-white w-8 h-8 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center tooltip" title="Remove video">
                       <span className="material-symbols-outlined text-[18px]">close</span>
                     </button>
                     <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                       {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                     </div>
                   </div>
                 ) : mode === 'audio' && filePreview ? (
                   <div className="w-full max-w-sm relative group p-6 rounded-xl shadow-md border border-surface-container bg-surface-variant/30 flex flex-col items-center">
                     <button onClick={() => { setUploadedFile(null); setFilePreview(null); }} className="absolute top-3 right-3 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]">close</span></button>
                     <span className="material-symbols-outlined text-[40px] text-primary mb-4">graphic_eq</span>
                     <audio src={filePreview} controls className="w-full h-10" />
                     <div className="mt-4 text-[11px] font-bold text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                   </div>
                 ) : (
                   <div className="w-full max-w-sm relative group p-8 rounded-xl shadow-md border border-surface-container bg-surface-variant/20 flex flex-col items-center text-center">
                     <button onClick={() => { setUploadedFile(null); setFilePreview(null); }} className="absolute top-3 right-3 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]">close</span></button>
                     <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                       <span className="material-symbols-outlined text-[40px] text-primary">
                         {mode === 'audio' ? 'audio_file' : 'video_file'}
                       </span>
                     </div>
                     <p className="font-headline-sm text-lg mb-2 truncate w-full px-4">{uploadedFile.name}</p>
                     <p className="text-[11px] font-bold text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                   </div>
                 )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col p-6">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept={`${mode}/*`}
                />
                <div 
                  className="flex-grow flex flex-col items-center justify-center p-12 text-center border border-surface-container/60 rounded-2xl bg-surface hover:bg-surface-variant/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 cursor-pointer group relative overflow-hidden" 
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-[24px] bg-surface-variant/50 shadow-sm border border-surface-container/50 flex items-center justify-center mb-6 group-hover:-translate-y-1 group-hover:shadow-md group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                      <span className="material-symbols-outlined text-[36px] text-on-surface-variant group-hover:text-primary transition-colors duration-500">
                        {mode === 'image' ? 'add_photo_alternate' : mode === 'audio' ? 'audio_file' : mode === 'video' ? 'video_file' : 'cloud_upload'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mb-2 tracking-tight">
                      Upload {mode}
                    </h3>
                    <p className="text-on-surface-variant/80 text-[13px] mb-8 max-w-xs leading-relaxed">
                      Click to browse or drag a file here
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 bg-surface-container/30 px-3 py-1.5 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Local Processing
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-surface-container bg-surface flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant text-xs font-light tracking-wider uppercase">
                {status === "Scanning" ? "Analyzing..." : status === "Complete" ? "Analysis Complete" : "System Ready"}
              </span>
            </div>
            <button 
              onClick={handleAnalyze} 
              disabled={status === "Scanning" || (!textInput.trim() && !uploadedFile) || !isTextValid} 
              className={`font-label-md px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-500 relative overflow-hidden group
                ${status === "Scanning" || (!textInput.trim() && !uploadedFile) || !isTextValid 
                  ? "bg-surface-container text-on-surface-variant cursor-not-allowed" 
                  : "bg-primary text-on-primary hover:-translate-y-1 hover:shadow-[0_15px_40px_-5px_rgba(var(--color-primary),0.6)] active:translate-y-0 active:scale-95 active:shadow-[0_5px_15px_-5px_rgba(var(--color-primary),0.4)]"
                }`}
            >
              {/* Subtle glass reflection / shine */}
              {!(status === "Scanning" || (!textInput.trim() && !uploadedFile) || !isTextValid) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out skew-x-12"></div>
              )}
              <span className="material-symbols-outlined text-[20px] relative z-10">{status === "Scanning" ? "hourglass_empty" : "troubleshoot"}</span>
              <span className="relative z-10">{status === "Scanning" ? "Processing" : "Analyze Now"}</span>
            </button>
          </div>
        </div>
        
        {/* Right: Forensic Results */}
        {results && (
          <div className="flex-grow xl:w-2/3 flex flex-col glass-panel rounded-2xl overflow-hidden bg-surface relative min-h-[550px] shadow-2xl border border-surface-container animate-fade-in">
            {/* Top Bar */}
            <div className="h-16 border-b border-surface-container flex items-center px-6 justify-between bg-surface-variant/30 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">policy</span>
                <span className="font-headline-md text-on-surface">Detection Report</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleExportPDF} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-on-surface-variant hover:text-primary tooltip" title="Export PDF">
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                </button>
                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-on-surface-variant hover:text-primary tooltip" title="Share Report">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            </div>
            
            {/* Content Area */}
            <div id="pdf-content" className="flex-grow overflow-y-auto p-6 bg-gradient-to-br from-background to-surface flex flex-col">
              <div className="flex justify-between items-start border-b border-surface-container pb-6 mb-6">
                 <div>
                   <h2 className="font-headline-md text-2xl mb-3 text-on-surface font-semibold">Analysis Results</h2>
                   <div className="flex items-center gap-3">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-bold tracking-wide uppercase ${results.prediction.includes('AI') ? 'bg-error/20 text-error' : results.prediction.includes('Unknown') ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                       <span className="material-symbols-outlined text-[16px] mr-1.5">{results.prediction.includes('AI') ? 'warning' : results.prediction.includes('Unknown') ? 'help' : 'verified_user'}</span>
                       {results.prediction}
                     </span>
                     <span className="text-sm text-on-surface-variant font-medium bg-surface-container/30 px-2.5 py-1 rounded border border-surface-container/50">
                       Confidence Score: {results.confidence}%
                     </span>
                   </div>
                 </div>
                 
                 {/* Clean Circular Progress Gauge */}
                 <div className="relative w-20 h-20 flex-shrink-0">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle 
                       cx="50" cy="50" r="42" 
                       className="stroke-surface-container fill-none" 
                       strokeWidth="10"
                     />
                     <circle 
                       cx="50" cy="50" r="42" 
                       className={`fill-none transition-all duration-1000 ease-out ${results.prediction === 'AI' ? 'stroke-error' : 'stroke-success'}`}
                       strokeWidth="10"
                       strokeLinecap="round"
                       strokeDasharray="264"
                       strokeDashoffset={264 - (264 * results.confidence) / 100}
                     />
                   </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                        <span className="text-xl font-display-md text-on-surface leading-none">{results.confidence}</span>
                        <span className="text-[10px] font-semibold text-on-surface-variant tracking-widest mt-0.5">CONF %</span>
                     </div>
                 </div>
              </div>
              
              {results.modality === "text" && <TextAnalysisDiff results={results} textInput={textInput} />}
              {results.modality === "image" && <ImageAnalysisDiff results={results} filePreview={filePreview} />}
              {results.modality === "audio" && <AudioAnalysisDiff results={results} />}
              {results.modality === "video" && <VideoAnalysisDiff results={results} />}
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
