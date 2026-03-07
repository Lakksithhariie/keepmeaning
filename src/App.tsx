import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, RefreshCw, Heart, Star, Check, Sparkles, 
  Command, Trash2, Brain, Zap, Globe, Square, 
  BookOpen, Briefcase, Feather, TrendingUp, ArrowLeft,
  Mail, Lock, Send
} from 'lucide-react';
import { getHiddenSkillsContext } from './skills';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const INCEPTION_API_KEY = import.meta.env.VITE_INCEPTION_API_KEY || '';
const INCEPTION_API_URL = 'https://api.inceptionlabs.ai/v1/chat/completions';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

const BASEROW_TOKEN = import.meta.env.VITE_BASEROW_TOKEN || '';
const BASEROW_TABLE_ID = '872648';

const MODELS = [
  { id: 'moonshotai/kimi-k2-instruct-0905', name: 'Core', icon: Brain },
  { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'Fast', icon: Zap },
  { id: 'mercury-2', name: 'Air', icon: Globe },
];

const STYLES = [
  { 
    id: 'stoic', 
    name: 'Stoic Minimalist', 
    icon: Square, 
    desc: 'Brief, weightful, and objective.',
    prompt: 'Write with extreme brevity and weight. Every word must earn its place. Avoid all ornamentation. The tone should be objective, calm, and final, like an inscription on stone.'
  },
  { 
    id: 'dark-academic', 
    name: 'Dark Academic', 
    icon: BookOpen, 
    desc: 'Scholarly, brooding, complex.',
    prompt: 'Write with intellectual density and atmospheric depth. Use complex sentence structures and a vocabulary that suggests a life spent among old books. The tone should be curious yet weary, searching for hidden truths.'
  },
  { 
    id: 'founder', 
    name: 'Founder\'s Voice', 
    icon: Briefcase, 
    desc: 'Visionary, confident, action-oriented.',
    prompt: 'Write with high velocity and absolute authority. Focus on leverage, scale, and the "why" behind every action. This is the voice of someone building the future—confident, direct, and slightly impatient with the status quo.'
  },
  { 
    id: 'poetic', 
    name: 'Poetic Realism', 
    icon: Feather, 
    desc: 'Evocative, grounded, rhythmic.',
    prompt: 'Write with sensory detail and a grounded rhythm. Find the profound within the mundane. Use metaphors that feel tangible and lived-in. The language should be beautiful but never ethereal—it must stay rooted in the physical world.'
  },
  { 
    id: 'viral', 
    name: 'Viral Thread', 
    icon: TrendingUp, 
    desc: 'Hook-driven, punchy, engaging.',
    prompt: 'Write with intense momentum and sharp, provocative insights. ABSOLUTELY NO EMOJIS. NO NUMBERED LISTS. NO "THREAD" HEADERS. Use rhythmic line breaks and varying sentence lengths to create a "scroll-stopping" flow. Each line should feel like a discovery. Focus on the "turn"—the moment where a common thought becomes a unique perspective.'
  },
];

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen w-full bg-km-red text-white overflow-x-hidden relative flex flex-col selection:bg-white selection:text-km-red">
      {/* Grid Pattern with Linear Gradient Mask */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 h-full w-full stroke-white/20 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="-1"
              y="-1"
            >
              <path d="M.5 40V.5H40" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-start p-6 md:p-12 relative z-20 shrink-0">
        {/* Left Box */}
        <div className="flex border-[2px] border-white shrink-0">
          <div className="bg-km-red p-2 md:p-3"><Heart className="w-5 h-5 md:w-6 md:h-6 fill-white" /></div>
          <div className="bg-white p-2 md:p-3"><Star className="w-5 h-5 md:w-6 md:h-6 text-km-red fill-km-red" /></div>
        </div>
        
        {/* Center Text */}
        <div className="text-center font-serif text-sm md:text-xl leading-tight mt-2 hidden sm:block">
          Every piece of writing<br/>deserves a love story.<br/>We know how<br/>to write it.
        </div>
        
        {/* Right Logo */}
        <div className="font-display text-2xl md:text-4xl leading-[0.85] uppercase tracking-wide text-right mt-2">
          Keep<br/>Meaning
        </div>
      </div>

      {/* Middle Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full z-20 px-4 py-20">
        <div className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-wide uppercase max-w-4xl mx-auto mb-10 md:mb-12">
          We Steal the Soul<br/>Back from the Machine
        </div>

        <button 
          onClick={onEnter}
          className="border-[3px] border-white bg-km-red px-6 py-3 md:px-8 md:py-4 font-display text-xl md:text-3xl uppercase tracking-widest hover:bg-white hover:text-km-red transition-all duration-300 group flex items-center gap-4 mx-auto shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:shadow-[0px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1"
        >
          Enter Workspace <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-pulse" />
        </button>
      </div>

      {/* Bottom Massive Text */}
      <div className="relative w-full flex justify-center items-end pointer-events-none z-10 overflow-hidden shrink-0 pt-10">
        <h1 className="font-display text-[22vw] leading-[0.75] uppercase tracking-tighter m-0 text-center flex flex-col translate-y-[10%]">
          <span>Keep</span>
          <span>Meaning</span>
        </h1>
        
        {/* Scattered Hearts (Cutout effect) */}
        <Heart className="absolute bottom-[60%] left-[22%] w-8 h-8 md:w-16 md:h-16 fill-km-red text-km-red rotate-12" />
        <Heart className="absolute bottom-[25%] left-[38%] w-6 h-6 md:w-12 md:h-12 fill-km-red text-km-red -rotate-12" />
        <Heart className="absolute bottom-[45%] right-[28%] w-10 h-10 md:w-20 md:h-20 fill-km-red text-km-red rotate-45" />
        <Heart className="absolute bottom-[15%] right-[18%] w-5 h-5 md:w-10 md:h-10 fill-km-red text-km-red -rotate-6" />
        <Heart className="absolute bottom-[75%] left-[48%] w-7 h-7 md:w-14 md:h-14 fill-km-red text-km-red rotate-3" />
        <Heart className="absolute bottom-[30%] left-[15%] w-5 h-5 md:w-10 md:h-10 fill-km-red text-km-red -rotate-12" />
        <Heart className="absolute bottom-[65%] right-[15%] w-6 h-6 md:w-12 md:h-12 fill-km-red text-km-red rotate-12" />
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'draft' | 'output'>('draft');
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  // Lead Magnet State
  const [usageCount, setUsageCount] = useState(() => {
    const saved = localStorage.getItem('km_usage_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isEmailVerified, setIsEmailVerified] = useState(() => {
    return localStorage.getItem('km_email_verified') === 'true';
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  
  // Secret Dev Reset Trigger
  const [titleClickCount, setTitleClickCount] = useState(0);
  const showDevReset = titleClickCount >= 5;

  const outputEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isGenerating && activeTab === 'output') {
      scrollToBottom();
    }
  }, [output, isGenerating, activeTab]);

  useEffect(() => {
    localStorage.setItem('km_usage_count', usageCount.toString());
  }, [usageCount]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setCopied(false);
    setActiveTab('draft');
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitEmailToBaserow = async (email: string) => {
    if (!email.includes('@')) return;
    setIsSubmittingEmail(true);
    try {
      const response = await fetch(`https://api.baserow.io/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': email,
          'custom_id': `user_${Date.now()}`,
          'create date': new Date().toISOString()
        })
      });

      if (response.ok) {
        setEmailSuccess(true);
        setIsEmailVerified(true);
        localStorage.setItem('km_email_verified', 'true');
        
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailSuccess(false);
          // Continue generation after successful email submission
          handleGenerate(false, true);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Baserow Error:', errorData);
        alert('Authentication failed. Please check your connection.');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleGenerate = async (isRegenerate = false, skipCheck = false) => {
    if (!input.trim() && !isRegenerate) return;
    
    // Check usage limits - skipCheck is true after a successful email sub
    if (!skipCheck && usageCount >= 10 && !isEmailVerified) {
      setShowEmailModal(true);
      return;
    }

    setIsGenerating(true);
    setOutput('');
    setCopied(false);
    setActiveTab('output');
    
    if (!isRegenerate) {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      
      // If this was the 10th use, trigger the modal after a 5s delay
      if (newCount === 10 && !isEmailVerified) {
        setTimeout(() => {
          setShowEmailModal(true);
        }, 5000);
      }
    }

    const styleObj = STYLES.find(s => s.id === selectedStyle);
    const stylePrompt = styleObj?.prompt || `Rewrite or expand the following text in a "${styleObj?.name}" style (${styleObj?.desc}).`;

    const isMercury = selectedModel === 'mercury-2';
    const isGroq = selectedModel === 'meta-llama/llama-4-scout-17b-16e-instruct' || selectedModel === 'moonshotai/kimi-k2-instruct-0905';

    let apiUrl = OPENROUTER_API_URL;
    let apiKey = OPENROUTER_API_KEY;
    let providerName = 'OpenRouter';

    if (isMercury) {
      apiUrl = INCEPTION_API_URL;
      apiKey = INCEPTION_API_KEY;
      providerName = 'Inception Labs';
    } else if (isGroq) {
      apiUrl = GROQ_API_URL;
      apiKey = GROQ_API_KEY;
      providerName = 'Groq';
    }

    const systemContent = `You are KeepMeaning, a high-end editorial partner and "Ghostwriter of Souls." You do not "generate" text; you craft it with human intention. 

CRITICAL MANDATES:
1. PROTECT THE ANCHOR: Identify the core "truth" or "action" in the user's draft. Do not lose it in the style.
2. ASYMMETRICAL RHYTHM: Write like a human breathes. Use sentence fragments for impact. Use long, winding sentences only when they build tension. 
3. SPECIFICITY OVER ABSTRACTION: Use metaphors that feel tangible and lived-in.
4. NO CLICHÉS: Absolutely NO emojis. NO numbered lists. NO "Thread" headers. 

[INVISIBLY APPLIED SKILLS]
${getHiddenSkillsContext()}

OUTPUT: Provide the rewritten text ONLY. Zero conversational filler.`;

    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: `${stylePrompt}\n\nUser Draft:\n${input}` }
    ];

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messages,
          stream: true,
          temperature: 0.8,
          max_tokens: 2000,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${providerName} Error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                fullText += content;
                setOutput(fullText);
              }
            } catch (e) {
              // Skip parsing errors
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      setOutput(error.message || "An error occurred while generating the text. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating && input.trim()) {
          handleGenerate(false);
        }
      }
      
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (output) {
          handleCopy();
        }
      }
      
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, output, selectedModel, selectedStyle, isGenerating, usageCount, isEmailVerified]);

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('app')} />;
  }

  return (
    <div className="flex h-screen bg-km-red text-white font-display overflow-hidden selection:bg-km-red selection:text-white">
      
      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-km-red/40 backdrop-blur-xl p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white/95 text-km-red max-w-4xl w-full shadow-[0_32px_64px_rgba(0,0,0,0.3)] flex flex-col relative overflow-visible border border-white/20"
            >
              {/* Top Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-km-red via-black to-km-red"></div>
              
              <div className="p-10 md:p-20 flex flex-col md:flex-row gap-12 items-center">
                {/* Left Side: The "Why" */}
                <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-km-red/5 border border-km-red/10 rounded-full">
                    <Sparkles size={16} className="text-km-red" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Limitless Path</span>
                  </div>
                  
                  <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.8] text-black">
                    Meaning shouldn't have a <span className="text-km-red">ceiling.</span>
                  </h2>
                  
                  <p className="font-serif text-xl leading-relaxed text-black/60 max-w-md">
                    You've found the pulse. You've touched the truth. Don't let the machine cut the thread now. Join the inner circle to keep the alchemy flowing.
                  </p>

                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex -space-x-3">
                      {[
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1548544149-4835e62ee5b3?q=80&w=687&auto=format&fit=crop"
                      ].map((url, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img src={url} alt={`practitioner-${i}`} className="w-full h-full object-cover grayscale" />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      Joined by 2,400+ Practitioners
                    </p>
                  </div>
                </div>

                {/* Right Side: The Form */}
                <div className="w-full md:w-[400px] bg-km-red text-white p-10 shadow-[20px_20px_0px_rgba(0,0,0,1)]">
                  <AnimatePresence mode="wait">
                    {emailSuccess ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10"
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                          <Check className="text-km-red w-10 h-10" />
                        </div>
                        <h3 className="font-display text-3xl uppercase tracking-tighter">Meaning Unlocked</h3>
                        <p className="font-serif text-sm opacity-60">Your session is now permanent.</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="form"
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-8"
                      >
                        <Mail className="w-12 h-12 mb-8 opacity-50" />
                        <div className="space-y-8">
                          <div className="group relative">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">Identity (Email)</label>
                            <input 
                              type="email" 
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              placeholder="you@presence.com"
                              className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none font-serif text-2xl focus:border-white transition-all text-white placeholder:text-white/20"
                            />
                          </div>

                          <button 
                            onClick={() => submitEmailToBaserow(emailInput)}
                            disabled={!emailInput.includes('@') || isSubmittingEmail}
                            className="w-full bg-white text-km-red py-6 px-8 font-display text-2xl uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-30 group"
                          >
                            <span>{isSubmittingEmail ? 'Authenticating...' : 'Claim Access'}</span>
                            <Send className={`w-6 h-6 ${isSubmittingEmail ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'}`} />
                          </button>

                          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest opacity-40 justify-center">
                            <Lock size={12} />
                            <span>End-to-end Encrypted Session</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Decorative Non-symmetrical geometric element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black -z-10 rotate-12"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR - CLEAN, PREMIUM, EDITORIAL */}
      <div className="w-[320px] flex-shrink-0 flex flex-col justify-between h-full bg-km-red z-20 relative shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
        
        {/* Header with Back */}
        <div className="px-6 pt-8 pb-8 shrink-0 border-b border-white/10">
          <motion.button 
            onClick={() => setView('landing')}
            className="text-white/60 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors mb-8"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={12} /> Back
          </motion.button>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex border border-white/30 shrink-0">
              <motion.div 
                className="bg-km-red p-1.5"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="w-3 h-3 fill-white" />
              </motion.div>
              <motion.div 
                className="bg-white p-1.5"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-3 h-3 text-km-red fill-km-red" />
              </motion.div>
            </div>
            <div className="font-serif text-xs opacity-90 leading-tight italic">
              Every draft deserves<br/>a love story.
            </div>
          </div>
          <motion.h1 
            onClick={() => setTitleClickCount(prev => prev + 1)}
            className="font-display text-[3rem] leading-[0.85] uppercase tracking-wide m-0 cursor-default select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Keep<br/>Meaning
          </motion.h1>
        </div>

        {/* Navigation / Selectors */}
        <div className="flex flex-col flex-1 px-6 pt-8 pb-5 gap-10">
          
          {/* Engines - Segmented Control */}
          <div className="shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white/60"></span> Engine
            </div>
            <div className="flex border border-white/30">
              {MODELS.map((model, index) => {
                const isActive = selectedModel === model.id;
                return (
                  <motion.button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold uppercase tracking-widest ${
                      isActive ? 'bg-white text-km-red' : 'text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {model.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Voices - Flex Accordion */}
          <div className="flex flex-col overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 bg-white/60"></span> Voice
            </div>
            <div className="flex flex-col gap-[1px]">
              {STYLES.map((style, index) => {
                const Icon = style.icon;
                const isActive = selectedStyle === style.id;
                return (
                  <motion.button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 border transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-km-red border-white' 
                        : 'bg-transparent text-white border-white/10 hover:bg-white/5 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * index }}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-km-red' : 'text-white/40 group-hover:text-white/70'}`} />
                    <div className="flex flex-col items-start text-left flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-km-red' : 'text-white/60 group-hover:text-white/90'}`}>
                        {style.name}
                      </span>
                      <span className={`text-[9px] font-serif leading-tight ${isActive ? 'text-km-red/80' : 'text-white/30 group-hover:text-white/50'} line-clamp-1`}>
                        {style.desc}
                      </span>
                    </div>
                    {isActive && (
                      <Sparkles className="w-3 h-3 text-km-red animate-pulse shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dev Reset Button - Hidden behind 5 clicks on "Keep Meaning" */}
        <div className="px-6 pb-6 mt-auto">
          {showDevReset && (
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2 border border-white/10 text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 hover:border-white/30 transition-all font-bold"
            >
              Reset Session (Dev Only)
            </button>
          )}
        </div>

      </div>

      {/* MAIN CANVAS AREA - FLUSH, SHARP, EDITORIAL */}
      <div className="flex-1 bg-[#FDFDFD] text-gray-900 flex flex-col relative overflow-hidden">
        
        {/* Canvas Top Bar */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 lg:px-16 bg-white z-10 shrink-0">
          {/* Tabs */}
          <div className="flex gap-8 h-full">
            <button 
              onClick={() => setActiveTab('draft')} 
              className={`h-full flex items-center text-sm font-bold uppercase tracking-widest border-b-2 transition-colors pt-[2px] ${
                activeTab === 'draft' ? 'border-km-red text-km-red' : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              Draft
            </button>
            <button 
              onClick={() => setActiveTab('output')} 
              className={`h-full flex items-center text-sm font-bold uppercase tracking-widest border-b-2 transition-colors pt-[2px] ${
                activeTab === 'output' ? 'border-km-red text-km-red' : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              Output
              {output && <span className="ml-2 w-2 h-2 bg-km-red"></span>}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {isEmailVerified ? 'Usage: ' : 'Free Uses: '} 
              <span className="text-km-red">{isEmailVerified ? '∞' : `${usageCount}/10`}</span>
            </div>
            <div className="w-[2px] h-4 bg-gray-200"></div>
            <button 
              onClick={handleClear}
              className="text-gray-400 hover:text-km-red transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              title="Clear All (Ctrl+Shift+X)"
            >
              <Trash2 size={16} /> Clear
            </button>
            <div className="w-[2px] h-4 bg-gray-200"></div>
            <button 
              onClick={() => handleGenerate(true)}
              disabled={!output || isGenerating}
              className="text-gray-400 hover:text-km-red transition-colors disabled:opacity-30 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              title="Retry Generation"
            >
              <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} /> Retry
            </button>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className="text-gray-400 hover:text-km-red transition-colors disabled:opacity-30 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              title="Copy Output (Ctrl+Shift+C)"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />} 
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 lg:px-32 relative selection:bg-km-red selection:text-white">
          {/* Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none flex flex-col items-center">
            <Heart className="w-48 h-48 mb-8" />
            <div className="font-display text-[10rem] uppercase tracking-tighter text-center leading-[0.8]">Keep<br/>Meaning</div>
          </div>

          <div className="max-w-4xl mx-auto h-full relative z-10">
            {activeTab === 'draft' ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-full resize-none outline-none bg-transparent font-serif text-2xl md:text-3xl leading-relaxed text-gray-900 placeholder:text-gray-300"
                placeholder="Start your draft here..."
              />
            ) : (
              <div className="w-full font-serif text-2xl md:text-3xl leading-relaxed text-gray-900 whitespace-pre-wrap pb-32">
                {output ? (
                  output
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 italic mt-32">
                    <Sparkles size={64} className="mb-8 opacity-20" />
                    {isGenerating ? 'Shaping meaning...' : 'Your generated meaning will appear here...'}
                  </div>
                )}
                <div ref={outputEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Sharp Premium Action Bar */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-6">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-4">
              <span>Status: {isGenerating ? 'Writing...' : 'Ready'}</span>
              <span className="w-1.5 h-1.5 bg-km-red rounded-full animate-pulse"></span>
            </div>
            
            {/* Shortcuts Toggle */}
            <div className="relative flex items-center">
              <button 
                onMouseEnter={() => setShowShortcuts(true)}
                onMouseLeave={() => setShowShortcuts(false)}
                className="text-gray-400 hover:text-km-red transition-colors p-1"
              >
                <Command size={16} />
              </button>
              
              {/* Shortcuts Popover */}
              <div 
                className={`absolute bottom-full left-0 mb-4 w-64 bg-gray-900 text-white p-5 shadow-2xl transition-all duration-200 origin-bottom-left ${
                  showShortcuts ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-widest opacity-60">Generate</span>
                    <span className="font-mono border border-white/30 px-1.5 py-0.5 opacity-80">Ctrl+Enter</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-widest opacity-60">Copy</span>
                    <span className="font-mono border border-white/30 px-1.5 py-0.5 opacity-80">Ctrl+Shift+C</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-widest opacity-60">Clear</span>
                    <span className="font-mono border border-white/30 px-1.5 py-0.5 opacity-80">Ctrl+Shift+X</span>
                  </div>
                </div>
                {/* Triangle pointer */}
                <div className="absolute -bottom-2 left-3 w-4 h-4 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => handleGenerate(false)}
            disabled={!input.trim() || isGenerating}
            className="flex items-center gap-4 bg-km-red text-white px-8 py-4 hover:bg-black transition-colors disabled:opacity-50 disabled:hover:bg-km-red group border-2 border-km-red hover:border-black"
          >
            <Sparkles size={20} className={isGenerating ? 'animate-pulse' : ''} />
            <span className="font-display text-2xl uppercase tracking-wider leading-none pt-1">
              {isGenerating ? 'Writing...' : 'Generate'}
            </span>
            <div className="flex items-center gap-1 opacity-80 border-l border-white/30 pl-4 ml-2">
              <Command size={16} /> <span className="text-sm font-mono font-bold">Enter</span>
            </div>
          </button>
        </div>

      </div>

    </div>
  );
}
