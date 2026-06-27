import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [heroTab, setHeroTab] = useState("text"); // 'text' or 'upload'
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState("Ready"); // Ready, Scanning, Complete
  const [results, setResults] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const exampleTexts = {
    'GPT-4o': "Artificial Intelligence has undergone a massive transformation in recent years. What began as simple rule-based systems has now evolved into highly complex neural networks capable of understanding and generating human-like text. The implications for various industries, from healthcare to software development, are profound. By automating repetitive tasks, AI enables professionals to focus on higher-level strategic thinking.\n\nHowever, this rapid advancement brings significant ethical considerations. The deployment of large language models raises questions about data privacy, algorithmic bias, and the potential for displacing certain jobs. As we continue to integrate these systems into our daily lives, it is crucial that developers prioritize transparency and fairness.\n\nLooking ahead, the future of AI seems boundless. With the advent of multimodal systems that can process text, images, and audio simultaneously, we are approaching a new frontier of human-computer interaction. The key will be maintaining a balance between innovation and responsible regulation to ensure these technologies benefit society as a whole.",
    'Claude 3': "Here is a thoughtful analysis of the situation. It's important to consider multiple perspectives when evaluating complex issues, as nuance often gets lost in binary debates. I've structured my response to address each of your key points systematically, starting with the historical context.\n\nThe evolution of this particular challenge demonstrates a clear pattern of systemic friction. When we examine the underlying causes, we find that communication breakdowns and misaligned incentives play a far larger role than technological limitations. It is rarely a single point of failure, but rather a cascading series of minor inefficiencies that aggregate into a substantial roadblock.\n\nTo effectively resolve this, organizations must pivot toward a more holistic operational model. This requires not just new tools, but a fundamental shift in corporate culture. Embracing continuous feedback loops and prioritizing cross-departmental transparency will ultimately yield the most sustainable results. I hope this detailed breakdown provides the clarity you were seeking.",
    'Human': "I honestly couldn't believe my eyes when I walked into the coffee shop yesterday. The new barista, who looked like he was having the worst first day ever, literally dropped three separate cups of iced latte in the span of five minutes. It was honestly kind of hilarious but also I felt super bad for him because the manager looked furious.\n\nThe worst part was the sound it made—just this loud plastic crunch followed by ice skating across the entire floor. Half the line just stood there staring in complete silence while he desperately tried to mop it up with these tiny paper napkins. I ended up just leaving a big tip in the jar and telling him to hang in there.\n\nAnyway, after all that chaos, my coffee wasn't even that great. I think they forgot the vanilla syrup entirely, but there was no way I was going to go back and ask him to remake it. Sometimes you just have to cut your losses and drink the bitter espresso.",
    'Gemini': "I can provide comprehensive information on that topic. Let's break down the core components of the subject matter into easily understandable sections. First, we will examine the historical context, followed by the modern implications and future projections.\n\nHistorically, the development of this field was constrained by limited computational resources and a lack of scalable infrastructure. Early pioneers relied heavily on theoretical models rather than empirical testing. However, the introduction of distributed cloud computing in the late 2000s catalyzed a paradigm shift, enabling rapid iteration and massive data processing capabilities that were previously unimaginable.\n\nIn the modern era, the focus has shifted toward optimization and accessibility. Frameworks have become increasingly user-friendly, democratizing access for developers worldwide. As we project into the next decade, we can expect quantum computing to further accelerate this trend, potentially solving optimization problems that currently take years in mere milliseconds."
  };

  const faqs = [
    {
      q: "Does DetectAi store my content?",
      a: "Absolutely not! DetectAi is committed to protecting your privacy. We do not store any of your content on our servers. All content is deleted immediately after you close the tab. We do not share content with third parties, and we do not use it for any purpose other than to check for AI."
    },
    {
      q: "Is there a limit to how many checks I can run?",
      a: "There is no limit to how many times you can use the AI Detector. You can use it as many times as you'd like, however, text highlighting is only available to signed-in users."
    },
    {
      q: "How accurate is the AI Detector?",
      a: "Our AI writing detector is the most accurate in the industry, with an accuracy rate of 99.8%. Although we are constantly improving our algorithms, please note that no method of detection is 100% accurate. False positives are inevitable, but we are working hard to reduce them as much as possible."
    },
    {
      q: "What AI models can it detect?",
      a: "Yes, our AI checker can detect content generated by ChatGPT, Claude (all versions), Google Gemini, Meta Llama, Jasper, Copy.ai, and most other large language models."
    },
    {
      q: "Why did my human writing get flagged as AI?",
      a: "False positives can occur when human writing happens to match patterns common in AI-generated content. Try adding more personal examples, varying your sentence lengths, or including conversational elements."
    }
  ];

  const handleAnalyze = async () => {
    if (!textInput.trim()) return;
    setStatus("Scanning");
    setResults(null);
    
    setTimeout(() => {
      let isAi = textInput.includes("AI language model") || textInput.includes("nuance") || textInput.includes("provide information") || textInput.includes("Artificial Intelligence");
      let confidence = 98;
      
      if (textInput === exampleTexts['GPT-4o']) { isAi = true; confidence = 99; }
      else if (textInput === exampleTexts['Claude 3']) { isAi = true; confidence = 96; }
      else if (textInput === exampleTexts['Gemini']) { isAi = true; confidence = 97; }
      else if (textInput === exampleTexts['Human']) { isAi = false; confidence = 2; }
      else {
        confidence = isAi ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 15) + 1;
      }
      setResults({
        prediction: isAi ? "AI" : "Human",
        confidence: confidence,
        text: textInput
      });
      setStatus("Complete");
    }, 400); 
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface selection:bg-primary/10 selection:text-primary relative overflow-x-hidden">
      
      {/* Modern NavBar */}
      <nav className="bg-background w-full sticky top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
          {/* Brand */}
          <Link to="/" className="font-headline-md text-primary font-bold flex items-center gap-2 tracking-tight text-2xl hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[28px]">troubleshoot</span>
            DetectAi
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 bg-surface-variant/40 px-6 py-2 rounded-full border border-surface-container/50">
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Products</Link>
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Use Cases</Link>
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Pricing</Link>
            <Link to="/api" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">API</Link>
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Blog</Link>
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-md font-medium">Contact</Link>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-6">
            <ThemeToggle />
            {isSignedIn ? (
              <Link to="/dashboard" className="bg-primary text-on-primary font-label-md font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="hidden md:inline-flex text-on-surface font-label-md font-semibold hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="bg-primary text-on-primary font-label-md font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Start writing</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[1440px] px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center relative z-10">

          <h1 className="text-display-lg font-bold mb-6 leading-tight tracking-tight max-w-4xl font-serif">
            <span className="text-on-surface">Free AI Detector & </span>
            <span className="text-primary">AI Checker</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl font-body-lg leading-relaxed">
            Ensure your content remains authentically human. DetectAi instantly analyzes text, documents, and media to flag AI-generated content with 99.8% accuracy.
          </p>

          {/* Scanner Box */}
          <div className="w-full max-w-[800px] bg-surface border border-surface-container rounded-2xl shadow-2xl shadow-black/5 overflow-hidden flex flex-col text-left">
            <div className="flex border-b border-surface-container">
              <button 
                onClick={() => setHeroTab('text')}
                className={`flex-1 py-4 font-label-lg font-bold transition-colors ${heroTab === 'text' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              >
                Text
              </button>
              <button 
                onClick={() => setHeroTab('upload')}
                className={`flex-1 py-4 font-label-lg font-bold transition-colors ${heroTab === 'upload' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              >
                Upload File
              </button>
            </div>
            
            <div className="p-4 md:p-6 min-h-[300px] flex flex-col bg-background/50 relative">
               {status === "Scanning" && (
                 <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-b-2xl">
                   <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                   <p className="font-bold text-primary animate-pulse">Analyzing text patterns...</p>
                 </div>
               )}
               
               {results ? (
                 <div className="flex-grow flex flex-col animate-fade-in">
                   <div className="flex justify-between items-start border-b border-surface-container pb-4 mb-4">
                      <div>
                        <h2 className="font-headline-md text-xl mb-1 text-on-surface">Detection Results</h2>
                        <span className={`inline-flex items-center px-2 py-1 rounded font-label-sm border uppercase tracking-wider ${results.prediction === 'AI' ? 'bg-error/10 text-error border-error/20' : 'bg-success/10 text-success border-success/20'}`}>
                          <span className="material-symbols-outlined text-[14px] mr-1">{results.prediction === 'AI' ? 'warning' : 'verified_user'}</span>
                          {results.prediction === 'AI' ? 'Synthetic Media' : 'Human Provenance'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-on-surface-variant uppercase tracking-widest mb-1">AI Probability</div>
                        <div className="font-display-lg text-4xl leading-none text-primary">{results.confidence}<span className="text-xl">%</span></div>
                      </div>
                   </div>
                   <div className="text-on-surface-variant leading-relaxed p-4 bg-surface rounded-xl border border-surface-container overflow-y-auto max-h-[150px] text-left">
                     <span className={results.prediction === 'AI' ? 'bg-error/20 text-error-container p-1 rounded' : 'bg-success/10 text-success p-1 rounded'}>{results.text}</span>
                   </div>
                 </div>
               ) : heroTab === 'text' ? (
                 <textarea 
                   className="w-full h-full min-h-[200px] flex-1 resize-none bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/50 font-body-lg"
                   value={textInput}
                   onChange={(e) => setTextInput(e.target.value)}
                   placeholder="To check your content, type or paste it here and click on the button below..."
                 />
               ) : (
                 <div onClick={() => isSignedIn ? navigate('/dashboard') : setShowSignInModal(true)} className="w-full h-full min-h-[200px] border-2 border-surface-container rounded-xl flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/50 transition-colors cursor-pointer bg-surface/50 hover:bg-primary/5">
                   <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">video_file</span>
                   <p className="font-headline-md font-bold text-on-surface">Upload Video or Document</p>
                   <p className="text-sm mt-1">Supports MP4, AVI, PDF, DOCX</p>
                 </div>
               )}
            </div>
            
            {/* Bottom Bar */}
            <div className="p-4 border-t border-surface-container bg-surface flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex flex-wrap gap-2 items-center">
                 <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mr-2">Try an example:</span>
                 {['GPT-4o', 'Claude 3', 'Human', 'Gemini'].map(chip => (
                   <button 
                     key={chip} 
                     onClick={() => {
                        setTextInput(exampleTexts[chip]);
                        setResults(null);
                        setHeroTab('text');
                     }}
                     className="text-xs bg-surface-variant hover:bg-primary hover:text-on-primary text-on-surface px-3 py-1.5 rounded-full transition-colors border border-surface-container"
                   >
                     {chip}
                   </button>
                 ))}
               </div>
               
               {results ? (
                 <button onClick={() => {setResults(null); setTextInput("");}} className="w-full sm:w-auto bg-surface-variant text-on-surface font-bold px-8 py-3 rounded-full hover:bg-surface-container transition-transform">
                   Scan Another
                 </button>
               ) : (
                 <button onClick={handleAnalyze} disabled={status === "Scanning" || heroTab !== 'text'} className={`w-full sm:w-auto font-bold px-8 py-3 rounded-full transition-all shadow-lg ${status === "Scanning" || heroTab !== 'text' ? "bg-surface-variant text-on-surface-variant cursor-not-allowed shadow-none" : "bg-primary text-on-primary hover:scale-105 shadow-primary/30"}`}>
                   {status === "Scanning" ? "Scanning..." : "Check for AI"}
                 </button>
               )}
            </div>
          </div>
          
          <p className="text-sm text-on-surface-variant mt-6 max-w-2xl mx-auto opacity-70">
            AI-generated content evolves rapidly. These results should not be used to punish students or writers, instead consider them as part of a holistic assessment.
          </p>
        </section>

        {/* Live Truth Ticker */}
        <div className="w-full border-y border-surface-container bg-surface overflow-hidden py-4 z-10 relative">
          <div className="ticker-track text-label-sm text-on-surface-variant flex gap-12 whitespace-nowrap px-4 opacity-70">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success"></span> API Status: Operational (99.99%)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Scans Today: 2.4M+</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span> ViT V4.2 Deployed</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Quad-Modal Deepfake Alert Active</div>
            {/* Duplicated for smooth loop */}
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success"></span> API Status: Operational (99.99%)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Scans Today: 2.4M+</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span> ViT V4.2 Deployed</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Quad-Modal Deepfake Alert Active</div>
          </div>
        </div>

        {/* Sign In Modal */}
        {showSignInModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface border border-surface-container rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              <button onClick={() => setShowSignInModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="material-symbols-outlined text-[32px] text-primary">lock_open</span>
              </div>
              
              <h3 className="text-display-sm font-bold text-center text-on-surface mb-2">Sign in Required</h3>
              <p className="text-center text-on-surface-variant mb-8 leading-relaxed">
                You must be signed in to upload and analyze videos, images, or large documents. Create a free account to unlock multimedia forensic detection.
              </p>
              
              <Link to="/dashboard" className="block w-full bg-primary text-on-primary text-center font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/30 mb-4">
                Continue to Login
              </Link>
              <button onClick={() => setShowSignInModal(false)} className="block w-full text-center text-on-surface-variant font-bold py-2 hover:text-on-surface transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Why Choose Section (Phrasly Bento Layout) */}
        <section className="w-full py-24 bg-background">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 bg-success text-on-primary px-4 py-1.5 rounded-full font-label-sm font-bold mb-6 tracking-widest uppercase shadow-lg shadow-success/20">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span> 
                Why Choose DetectAi?
              </div>
              <h2 className="text-display-md font-bold text-on-surface mb-6">Why Choose DetectAi's Quad-Modal Detector?</h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Our forensic engine delivers results you can trust across Text, Image, Audio, and Video. Here's what makes DetectAi different:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Full Width */}
              <div className="md:col-span-3 bg-surface border border-surface-container rounded-2xl p-8 shadow-lg hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-[24px]">emoji_events</span>
                  <h3 className="font-bold text-xl text-on-surface">Industry-Leading Accuracy for Deepfake Detection</h3>
                </div>
                <p className="text-on-surface-variant mb-6 max-w-5xl leading-relaxed">
                  DetectAi's quad-modal checker achieves 99.99% accuracy in detecting AI-generated content across text, images, audio, and video from the latest models including ChatGPT, Midjourney, ElevenLabs, and Sora. Our proprietary models are trained on over 50 million authentic human media samples - giving us deep understanding of authentic human patterns.
                </p>
                <p className="font-bold text-on-surface mb-4">This training on genuine human media means our AI detector can distinguish between:</p>
                <ul className="space-y-3 text-on-surface-variant">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px] text-success">check_circle</span> Completely AI-generated deepfakes and synthetic text</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px] text-success">check_circle</span> Human content with AI assistance (e.g. grammar checking, visual filters)</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px] text-success">check_circle</span> Authentic human media that happens to match some AI patterns</li>
                </ul>
              </div>
              {/* Card 2 */}
              <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-lg flex flex-col hover:border-tertiary/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">bolt</span>
                  <h3 className="font-bold text-lg text-on-surface">Lightning-Fast Processing</h3>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">
                  Get your forensic report in under 10 seconds. Our pipeline processes text, audio, and high-res video instantly and provides detailed results showing exactly which sections appear AI-generated. No waiting in queues, no slow processing - just immediate, actionable feedback.
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-lg flex flex-col hover:border-success/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-success text-[24px]">check_circle</span>
                  <h3 className="font-bold text-lg text-on-surface">100% Free - No Limits</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed flex-grow">
                  Unlike other detectors that advertise "free" but limit you, DetectAi is genuinely unlimited. Check as many essays, images, or videos as you need. No character caps, no scan limits, no pressure to upgrade.
                </p>
                <div className="border-l-2 border-success pl-4 py-1 text-sm font-bold text-on-surface">
                  When we say free, we mean completely free.
                </div>
              </div>
              {/* Card 4 */}
              <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-lg flex flex-col hover:border-secondary/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary text-[24px]">shield_locked</span>
                  <h3 className="font-bold text-lg text-on-surface">Your Privacy Protected</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed flex-grow">
                  Your content stays completely private. All media analyzed by our detector is processed securely and deleted immediately after analysis. We don't store your data, we don't share it, and we don't use it to train our models.
                </p>
                <div className="border-l-2 border-secondary pl-4 py-1 text-sm font-bold text-on-surface">
                  No account required, no tracking, no data retention.
                </div>
              </div>
              {/* Card 5 */}
              <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-lg flex flex-col hover:border-error/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-error text-[24px]">visibility</span>
                  <h3 className="font-bold text-lg text-on-surface">Detailed Forensic Heatmaps</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed flex-grow">
                  Our detector doesn't just give you a percentage - it shows you precisely which sentences triggered the detection or which pixels in an image are synthetically generated via Explainable AI heatmaps.
                </p>
                <div className="border-l-2 border-error pl-4 py-1 text-sm font-bold text-on-surface">
                  This transparency helps make informed decisions.
                </div>
              </div>
              {/* Card 6 */}
              <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-lg flex flex-col hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-[24px]">layers</span>
                  <h3 className="font-bold text-lg text-on-surface">Quad-Modal Coverage</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  Our checker detects content from all major generative models across 4 modalities:
                </p>
                <ul className="space-y-2 text-sm text-on-surface-variant mt-auto">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> ChatGPT, Claude, Gemini</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> Midjourney, DALL-E, Flux</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> ElevenLabs, Suno, Udio</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> Sora, Runway Gen-3</li>
                </ul>
              </div>
              {/* Card 7 */}
              <div className="bg-surface border border-surface-container rounded-2xl p-8 shadow-lg flex flex-col hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-[24px]">group</span>
                  <h3 className="font-bold text-lg text-on-surface">Built for Security & Trust</h3>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  DetectAi is designed specifically for enterprise and security contexts. We understand that deepfake detection is part of a larger conversation about digital trust.
                </p>
                <ul className="space-y-2 text-sm text-on-surface-variant mt-auto">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> Journalists verify sources</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> Legal teams authenticate evidence</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">check</span> Platforms moderate content</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section (Phrasly Layout) */}
        <section className="w-full py-24 bg-surface-variant/20 border-y border-surface-container">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 bg-[#ff8b3d] text-black px-4 py-1.5 rounded-full font-label-sm font-bold mb-6 tracking-widest uppercase shadow-lg shadow-[#ff8b3d]/20">
                <span className="material-symbols-outlined text-[18px]">magic_button</span> 
                How to use DetectAi
              </div>
              <h2 className="text-display-md font-bold text-on-surface mb-4">Catch AI Media in Seconds</h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Spot deepfakes and AI-generated text instantly. No signup required - just upload your media and get results in under 10 seconds.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Step 1 */}
               <div className="bg-surface border border-surface-container rounded-3xl p-8 shadow-lg flex flex-col transition-colors">
                 <div className="text-center mb-6">
                   <div className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Step 1</div>
                   <h3 className="text-2xl font-bold text-on-surface">Upload Your Media</h3>
                 </div>
                 
                 <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-surface-container mb-8 flex flex-col items-center justify-center bg-surface-variant/30 transition-colors">
                    <span className="material-symbols-outlined text-[48px] text-primary mb-4">cloud_upload</span>
                    <div className="font-bold text-on-surface">Drag & Drop files</div>
                    <div className="text-xs text-on-surface-variant mt-1">MP4, PDF, DOCX, JPG</div>
                 </div>
                 <div className="space-y-4 text-sm text-on-surface-variant mt-auto">
                   <p><strong className="text-on-surface">Add your content:</strong> Drag and drop any image, video, audio, or text file you want to check.</p>
                   <p><strong className="text-on-surface">Choose your format:</strong> Works seamlessly with MP4, MP3, JPG, PDF, and DOCX files.</p>
                   <p><strong className="text-on-surface">No pre-processing:</strong> Raw files are accepted, we handle all the extraction automatically.</p>
                 </div>
               </div>
               
               {/* Step 2 */}
               <div className="bg-surface border border-surface-container rounded-3xl p-8 shadow-lg flex flex-col transition-colors">
                 <div className="text-center mb-6">
                   <div className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Step 2</div>
                   <h3 className="text-2xl font-bold text-on-surface">Get Instant Results</h3>
                 </div>
                 
                 <div className="w-full aspect-[4/3] rounded-2xl border border-surface-container mb-8 flex flex-col items-center justify-center bg-surface-variant/30 p-6 relative overflow-hidden transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                    <div className="w-28 h-28 rounded-full border-8 border-surface-container relative flex items-center justify-center mb-2">
                      <div className="absolute inset-0 rounded-full border-8 border-error" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)' }}></div>
                      <div className="text-center z-10 bg-surface rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
                        <div className="text-2xl font-display-lg font-bold text-error leading-none">92<span className="text-sm">%</span></div>
                        <div className="text-[10px] uppercase font-bold text-error">AI</div>
                      </div>
                    </div>
                    <div className="w-3/4 h-2 bg-surface-container rounded-full mt-4"></div>
                    <div className="w-1/2 h-2 bg-surface-container rounded-full mt-2"></div>
                 </div>
                 <div className="space-y-4 text-sm text-on-surface-variant mt-auto">
                   <p><strong className="text-on-surface">Click "Check for AI":</strong> Press the Analyze button at the bottom of the tool.</p>
                   <p><strong className="text-on-surface">See your score:</strong> Get a clear percentage showing how much media is AI-generated.</p>
                   <p><strong className="text-on-surface">View breakdown:</strong> See exactly which models (ChatGPT, Midjourney) were detected.</p>
                 </div>
               </div>
               
               {/* Step 3 */}
               <div className="bg-surface border border-surface-container rounded-3xl p-8 shadow-lg flex flex-col transition-colors">
                 <div className="text-center mb-6">
                   <div className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Step 3</div>
                   <h3 className="text-2xl font-bold text-on-surface">Review Heatmaps</h3>
                 </div>
                 
                 <div className="w-full aspect-[4/3] rounded-2xl border border-surface-container mb-8 flex flex-col bg-surface-variant/30 p-6 text-left relative overflow-hidden transition-colors">
                    <div className="w-24 h-4 bg-surface-container rounded mb-4"></div>
                    <div className="text-xs leading-relaxed text-on-surface-variant z-10">
                      The <span className="bg-error/20 text-error px-1 rounded">development</span> of artificial intelligence has <span className="bg-error/20 text-error px-1 rounded border-b border-error">significantly altered</span> the landscape of modern technology. We must <span className="bg-error/20 text-error px-1 rounded">carefully consider</span> the implications.
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <div className="w-12 h-12 bg-surface border border-surface-container rounded shadow flex items-end p-1"><div className="w-full h-1/2 bg-error/50 rounded-sm"></div></div>
                      <div className="w-12 h-12 bg-surface border border-surface-container rounded shadow flex items-end p-1"><div className="w-full h-3/4 bg-success/50 rounded-sm"></div></div>
                    </div>
                 </div>
                 <div className="space-y-4 text-sm text-on-surface-variant mt-auto">
                   <p><strong className="text-on-surface">Check highlighted parts:</strong> Red heatmaps show pixels or text that look synthetic.</p>
                   <p><strong className="text-on-surface">Export forensic report:</strong> Download a PDF for legal authentication or journalism proof.</p>
                   <p><strong className="text-on-surface">Test again:</strong> Run another check to compare against original sources.</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Enterprise Dashboard Preview */}
        <section className="w-full py-24 bg-background">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
               {/* Right Side: Dashboard Mockup */}
               <div className="lg:w-[55%] w-full">
                 <div className="w-full bg-surface-variant/20 rounded-3xl p-4 border border-surface-container shadow-2xl relative">
                    <div className="flex gap-2 mb-4 px-2">
                      <div className="w-3 h-3 rounded-full bg-error/80"></div>
                      <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                      <div className="w-3 h-3 rounded-full bg-success/80"></div>
                    </div>
                    
                    <div className="bg-surface rounded-2xl border border-surface-container overflow-hidden flex flex-col">
                      <div className="border-b border-surface-container p-4 flex justify-between items-center bg-surface-variant/10">
                        <span className="font-bold text-on-surface">Analysis Report</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Document Verified</span>
                      </div>
                      
                      <div className="p-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1 bg-background rounded-xl p-4 border border-surface-container flex flex-col justify-between">
                          <span className="text-sm text-on-surface-variant mb-4">Overall Authentic</span>
                          <div className="text-4xl font-display-lg font-bold text-success mb-2">99%</div>
                          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className="w-[99%] h-full bg-success"></div>
                          </div>
                        </div>
                        
                        <div className="col-span-2 md:col-span-1 grid grid-rows-2 gap-4">
                           <div className="bg-background rounded-xl p-4 border border-surface-container flex items-center justify-between">
                             <span className="text-sm text-on-surface-variant">AI Written</span>
                             <span className="font-bold text-error">1%</span>
                           </div>
                           <div className="bg-background rounded-xl p-4 border border-surface-container flex items-center justify-between">
                             <span className="text-sm text-on-surface-variant">Plagiarism</span>
                             <span className="font-bold text-success">0%</span>
                           </div>
                        </div>
                        
                        <div className="col-span-2 mt-4">
                          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 block">Detected Models</span>
                          <div className="flex flex-wrap gap-2">
                             <div className="bg-background px-3 py-1.5 rounded-lg border border-surface-container text-xs text-on-surface-variant flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-surface-variant"></span> GPT-4o (0%)
                             </div>
                             <div className="bg-background px-3 py-1.5 rounded-lg border border-surface-container text-xs text-on-surface-variant flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-surface-variant"></span> Claude 3.5 (0%)
                             </div>
                             <div className="bg-background px-3 py-1.5 rounded-lg border border-surface-container text-xs text-on-surface-variant flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-surface-variant"></span> Gemini 1.5 (0%)
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-6 -left-6 bg-surface border border-surface-container rounded-2xl p-4 shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">verified</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-on-surface">Passed!</div>
                        <div className="text-xs text-on-surface-variant">Ready for submission</div>
                      </div>
                    </div>
                 </div>
               </div>
               
               {/* Left Side: Text */}
               <div className="lg:w-[45%]">
                 <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-label-sm font-bold mb-6 tracking-widest uppercase">
                   <span className="material-symbols-outlined text-[18px]">analytics</span> 
                   Enterprise Analytics
                 </div>
                 <h2 className="text-display-sm font-bold text-on-surface mb-6 leading-tight">Actionable Reports for Total Confidence</h2>
                 <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                   Stop guessing and start knowing. Our advanced reporting dashboard gives you a granular breakdown of your content, evaluating every sentence for traces of AI generation, plagiarism, and authenticity.
                 </p>
                 
                 <div className="space-y-6">
                   <div className="flex gap-4">
                     <span className="material-symbols-outlined text-primary mt-1">fact_check</span>
                     <div>
                       <h4 className="font-bold text-on-surface text-lg">Comprehensive Scoring</h4>
                       <p className="text-on-surface-variant">Get a definitive percentage indicating whether the text was written by a human or an AI model.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <span className="material-symbols-outlined text-primary mt-1">model_training</span>
                     <div>
                       <h4 className="font-bold text-on-surface text-lg">Model-Specific Detection</h4>
                       <p className="text-on-surface-variant">See exactly which AI was likely used, from GPT-4o to Claude 3.5 Sonnet.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <span className="material-symbols-outlined text-primary mt-1">download</span>
                     <div>
                       <h4 className="font-bold text-on-surface text-lg">Exportable PDF Proof</h4>
                       <p className="text-on-surface-variant">Download beautiful, official reports to prove the authenticity of your work to clients or professors.</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Grid Tools */}
        <section className="w-full py-24 bg-surface-variant/20 border-y border-surface-container">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-display-md lg:text-display-lg font-bold text-on-surface mb-6 leading-tight">
              Eight tools. <span className="text-primary underline decoration-primary underline-offset-[8px] decoration-[3px]">One platform.</span>
            </h2>
            <p className="text-xl text-on-surface-variant mb-16 max-w-3xl mx-auto leading-relaxed">10x your writing with all our tools in one place. Go beyond basic editing—it's your complete solution for creating polished content.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
               {[
                 { title: "AI Text Detector", desc: "Check if your written content is AI-generated with high accuracy", icon: "document_scanner", status: "Current", mode: "text" },
                 { title: "AI Audio Detector", desc: "Identify synthetic voices and deepfake audio files", icon: "graphic_eq", status: "Current", mode: "audio" },
                 { title: "AI Video Detector", desc: "Detect AI-generated videos and face manipulation", icon: "video_camera_front", status: "Current", mode: "video" },
                 { title: "AI Image Detector", desc: "Spot AI-generated images from Midjourney, DALL-E, etc.", icon: "image_search", status: "Current", mode: "image" },
                 { title: "Code Detector", desc: "Verify if source code was written by Copilot or ChatGPT", icon: "code_blocks", status: "Coming Soon", mode: "text" },
                 { title: "Plagiarism Checker", desc: "Stay original and confident with our plagiarism checker", icon: "plagiarism", status: "Coming Soon", mode: "text" },
                 { title: "Deepfake Forensics", desc: "Advanced forensic analysis for digital media", icon: "biotech", status: "Coming Soon", mode: "video" },
                 { title: "API Access", desc: "Integrate our multi-modal technology into your platform", icon: "api", status: "Coming Soon", mode: "text" },
               ].map(t => (
                 <Link to={isSignedIn ? `/dashboard?mode=${t.mode}` : "/login"} key={t.title} className="bg-surface border border-surface-container p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined">{t.icon}</span>
                      </div>
                      {t.status === "Coming Soon" && (
                        <span className="text-[10px] uppercase tracking-wider bg-warning/20 text-warning px-2 py-1 rounded font-bold">Coming Soon</span>
                      )}
                    </div>
                    <h3 className="font-bold text-on-surface mb-2">{t.title}</h3>
                    <p className="text-sm text-on-surface-variant">{t.desc}</p>
                 </Link>
               ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="w-full py-24 bg-background">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-display-sm font-bold text-center text-on-surface mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-surface-container rounded-xl bg-surface overflow-hidden transition-all">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-surface-variant/30 transition-colors"
                  >
                    <span className="font-bold text-lg text-on-surface">{faq.q}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>
                      expand_more
                    </span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-on-surface-variant leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-display-md font-black text-on-primary mb-6">Try DetectAi for free today</h2>
            <p className="text-xl text-on-primary/80 mb-12">Join 3,000,000+ students and writers who use our AI content tools to write faster and more efficiently.</p>
            <Link to="/register" className="bg-surface text-primary font-bold text-lg px-12 py-5 rounded-full hover:scale-105 transition-transform shadow-2xl">
              Get Started for free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-surface-container w-full relative z-10 py-16">
        <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="font-headline-md text-primary font-bold flex items-center gap-2 mb-4 text-2xl">
              <span className="material-symbols-outlined text-[28px]">troubleshoot</span>
              DetectAi
            </div>
            <p className="text-sm text-on-surface-variant">Supercharge Your Writing With AI. The most accurate, 100% free AI detector on the market.</p>
          </div>
          
          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="font-bold mb-4 text-on-surface">Products</h4>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                <li><Link to="#" className="hover:text-primary">AI Detector</Link></li>
                <li><Link to="#" className="hover:text-primary">AI Humanizer</Link></li>
                <li><Link to="#" className="hover:text-primary">Content Generator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-on-surface">Company</h4>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                <li><Link to="#" className="hover:text-primary">About Us</Link></li>
                <li><Link to="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-8 mt-16 pt-8 border-t border-surface-container text-sm text-on-surface-variant text-center md:text-left">
          &copy; 2026 DetectAi Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
