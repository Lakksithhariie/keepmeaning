import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, RefreshCw, ArrowRight, User, Globe, MessageSquareQuote, Send, Clipboard, RotateCcw, ChevronDown, PenTool, Layout, Anchor, Zap, MessageCircle, FileText, Wand2, Maximize2, Minimize2, Cpu, History as HistoryIcon, Search, Terminal, Cloud, Lock, Mail, Check, Plus, Clock, Archive, Heart, Star, ArrowLeft, X, Trash2, Menu, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LENSES = [
  { id: 'contrarian', name: 'The Contrarian Pivot', desc: 'Shatter the industry consensus.' },
  { id: 'zero-fluff', name: 'Zero-Fluff Framework', desc: 'Maximum density. Minimum friction.' },
  { id: 'grounded', name: 'Grounded Milestone', desc: 'Build trust through vulnerability.' },
  { id: 'raw', name: 'The Raw Observation', desc: 'Capture lightning in a bottle.' }
];

const AI_SLOP = [
  'delve', 'tapestry', 'unlock', 'unleash', 'testament', 'vibrant', 'nuance', 
  'landscape', '🚀', '🔥', '💡', 'humbled', 'honored', 'thrilled', 'excited to share', 'dive into'
];

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

interface RitualSession {
  id: string;
  ritual_id?: string;
  draft: string;
  anchor: string;
  lensId?: string;
  lens_id?: string;
  artifact: string;
  chatHistory: any[];
  timestamp: number;
}

const LinkedinLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M0 5h3.578v11H0zM13.324 5.129c-.038-.012-.074-.025-.114-.036a2.32 2.32 0 0 0-.145-.028A3.207 3.207 0 0 0 12.423 5c-2.086 0-3.409 1.517-3.845 2.103V5H5v11h3.578v-6s2.704-3.766 3.845-1v7H16V8.577a3.568 3.568 0 0 0-2.676-3.448z"></path>
    <circle cx="1.75" cy="1.75" r="1.75"></circle>
  </svg>
);

const TypewriterText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="flex flex-col gap-5">
      {lines.map((line, lineIdx) => (
        <motion.p
          key={lineIdx}
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.003 } } }}
          className="text-left leading-[1.8] text-[#1D1D1B] font-serif text-[21px] md:text-[23px] antialiased"
        >
          {line.split(' ').map((word, wordIdx) => (
            <motion.span key={wordIdx} variants={{ hidden: { opacity: 0, y: 1 }, visible: { opacity: 1, y: 0 } }} className="inline-block mr-[0.25em]">{word}</motion.span>
          ))}
        </motion.p>
      ))}
    </div>
  );
};

export const LinkedInMode = () => {
  const navigate = useNavigate();
  // Persistence & Auth
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('km_linkedin_email') || '');
  const [dbUserId, setDbUserId] = useState<number | null>(null);
  const [showAuthModal, setShowEmailModal] = useState(!userEmail);
  const [emailInput, setEmailInput] = useState('');
  
  // UI Layout States
  const [activeTab, setActiveTab] = useState<'pilot' | 'archive' | 'voice'>('pilot');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommanderVisible, setIsCommanderVisible] = useState(true);
  
  // Data States
  const [ritualsArchive, setRitualsArchive] = useState<RitualSession[]>([]);
  const [activeRitualId, setActiveRitualId] = useState<string | null>(null);
  const [draft, setDraft] = useState(() => localStorage.getItem('km_temp_draft') || '');
  const [anchor, setAnchor] = useState(() => localStorage.getItem('km_temp_anchor') || '');
  const [selectedLens, setSelectedLens] = useState(LENSES[0].id);
  const [output, setOutput] = useState('');
  const [currentHistory, setCurrentHistory] = useState<any[]>([]);
  
  // Voice DNA States
  const [voiceSamples, setVoiceSamples] = useState('');
  const [voiceDNA, setVoiceDNA] = useState<any>(null);
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);
  
  // System States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'' | 'drafting' | 'auditing' | 'refining'>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [refinementInput, setRefinementInput] = useState('');
  const [meaningScore, setMeaningScore] = useState(0);
  const [purgedItems, setPurgedItems] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const normalizedEmail = emailInput.trim();
  const isEmailValid = EMAIL_PATTERN.test(normalizedEmail);

  // Initialize DB on mount
  useEffect(() => {
    fetch('/api/init', { method: 'POST' }).catch(console.error);
  }, []);

  // State Recovery Heartbeat
  useEffect(() => {
    localStorage.setItem('km_temp_draft', draft);
    localStorage.setItem('km_temp_anchor', anchor);
  }, [draft, anchor]);

  useEffect(() => {
    if (userEmail && !dbUserId) { syncMemoryWithTurso(userEmail); }
  }, [userEmail]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const syncMemoryWithTurso = async (email: string) => {
    if (isSyncing || !email) return;
    setIsSyncing(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setDbUserId(data.user.id);
      setVoiceDNA(data.user.voice_dna || []);
      
      const parsedArchive = Array.isArray(data.artifacts) ? data.artifacts : [];
      setRitualsArchive(parsedArchive);

      if (parsedArchive.length > 0 && !activeRitualId) {
        loadSpecificRitual(parsedArchive[0]);
      }
    } catch (error) {
      console.error("Sync Error:", error);
      showToast("Failed to sync memory.");
    } finally {
      setIsSyncing(false);
    }
  };

  const loadSpecificRitual = (ritual: RitualSession) => {
    if (!ritual) return;
    setActiveRitualId(ritual.ritual_id || ritual.id);
    setDraft(ritual.draft || '');
    setAnchor(ritual.anchor || '');
    setSelectedLens(ritual.lens_id || ritual.lensId || LENSES[0].id);
    setOutput(ritual.artifact || '');
    setCurrentHistory(Array.isArray(ritual.chatHistory) ? ritual.chatHistory : []);
    setIsCommanderVisible(true);
    setActiveTab('pilot');
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const initializeNewRitual = () => {
    setActiveRitualId(null);
    setDraft('');
    setAnchor('');
    setOutput('');
    setCurrentHistory([]);
    setPurgedItems([]);
    setMeaningScore(0);
    setIsCommanderVisible(true);
    setActiveTab('pilot');
    localStorage.removeItem('km_temp_draft');
    localStorage.removeItem('km_temp_anchor');
  };

  const deleteRitualFromArchive = async (id: string) => {
    const newArchive = ritualsArchive.filter(r => (r.ritual_id || r.id) !== id);
    setRitualsArchive(newArchive);
    if (activeRitualId === id) initializeNewRitual();
    
    try {
      await fetch(`/api/artifact/${id}`, { method: 'DELETE' });
      showToast("Ritual deleted.");
    } catch(e) {
      console.error("Delete failed", e);
    }
  };

  const handleExtractVoiceDNA = async () => {
    if (!voiceSamples.trim() || isAnalyzingVoice) return;
    if (!dbUserId || !userEmail) {
      showToast('Sync your account first.');
      return;
    }

    setIsAnalyzingVoice(true);
    try {
      const response = await fetch('/api/user/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dbUserId, email: userEmail, voiceSamples })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze");
      
      setVoiceDNA(data.voiceDNA);
      setVoiceSamples('');
      showToast("Voice DNA Extracted");
    } catch (error: any) {
      console.error("Voice Analysis Error:", error);
      showToast(error.message || 'Voice analysis failed.');
    } finally {
      setIsAnalyzingVoice(false);
    }
  };

  const handleGenerate = async (isRefining = false) => {
    if (!draft.trim() || isGenerating) return;
    if (!dbUserId || !userEmail) {
      showToast('Sync your account first.');
      return;
    }

    setIsGenerating(true);
    if (!isRefining) setOutput('');
    setGenerationStep(isRefining ? 'refining' : 'drafting');
    
    const lens = LENSES.find(l => l.id === selectedLens);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          userId: dbUserId,
          draft,
          anchor,
          lens,
          voiceDNA,
          isRefining,
          currentHistory,
          refinementInput
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");

      setOutput(data.artifact);
      setMeaningScore(data.meaningScore);
      setCurrentHistory(data.chatHistory);
      setPurgedItems(data.purgedItems);
      setRefinementInput('');
      
      const ritualData: RitualSession = {
        id: data.ritualId,
        ritual_id: data.ritualId,
        draft,
        anchor,
        lens_id: selectedLens,
        artifact: data.artifact,
        chatHistory: data.chatHistory,
        timestamp: Date.now()
      };
      
      const existingIdx = ritualsArchive.findIndex(r => (r.ritual_id || r.id) === (activeRitualId || data.ritualId));
      let newArchive = [...ritualsArchive];
      if (existingIdx > -1) newArchive[existingIdx] = ritualData;
      else newArchive = [ritualData, ...newArchive];
      
      setRitualsArchive(newArchive);
      setActiveRitualId(data.ritualId);
      
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopyArtifact = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      showToast('Artifact copied.');
    } catch (error) {
      console.error('Copy failed', error);
      showToast('Copy failed.');
    }
  };

  const handleAuth = () => {
    if (!isEmailValid) return;

    localStorage.setItem('km_linkedin_email', normalizedEmail);
    setDbUserId(null);
    setVoiceDNA(null);
    setRitualsArchive([]);
    initializeNewRitual();
    setUserEmail(normalizedEmail);
    setShowEmailModal(false);
  };

  return (
    <div className="flex h-screen bg-[#FDFDFB] text-[#1D1D1B] overflow-hidden relative selection:bg-km-red/10">
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Sync Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white border border-[#E5E5E3] rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.1)] max-w-xl w-full overflow-hidden">
              <div className="h-1.5 w-full bg-km-red" />
              <div className="p-12 md:p-16 space-y-10 text-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-black text-white rounded-xl mb-4 shadow-lg"><LinkedinLogo className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">LinkedIn Studio Series</span></div>
                  <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight leading-[0.9]">Unlock your <span className="text-km-red italic">Archive.</span></h2>
                  <p className="text-sm text-[#8E8E8E] font-serif italic max-w-sm mx-auto">Access your persistent cloud studio. synchronize rituals and preserve your history.</p>
                </div>
                <div className="space-y-4 text-left">
                  <div className="group relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#CBCBC9] group-focus-within:text-km-red transition-colors" size={18} />
                    <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAuth()} placeholder="practitioner@presence.com" className="w-full bg-[#FDFDFB] border border-[#ECECEC] rounded-2xl pl-14 pr-6 py-5 text-lg outline-none focus:border-km-red/30 focus:bg-white transition-all shadow-sm font-serif italic" />
                  </div>
                  <button onClick={handleAuth} disabled={!isEmailValid} className="w-full bg-black text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-km-red transition-all shadow-xl disabled:opacity-20">Access Cloud Memory <ArrowRight size={18} /></button>
                </div>
                <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-[#CBCBC9]"><span className="flex items-center gap-1.5"><Lock size={10} /> Authenticated Session</span><span className="flex items-center gap-1.5"><Cloud size={10} /> Cloud Secure</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden z-10">
        
        {/* RESPONSIVE PILOT COMMAND (SIDEBAR) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ x: -450 }} animate={{ x: 0 }} exit={{ x: -450 }}
              className="fixed lg:relative z-50 w-full max-w-[450px] h-full border-r border-[#F0F0EE] bg-white flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)]"
            >
              <div className="h-0.5 w-full bg-km-red/40" />
              <div className="p-6 border-b border-[#F0F0EE] bg-white relative">
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-6 right-6 p-2 rounded-full hover:bg-km-red/5 text-[#CBCBC9] hover:text-km-red"><X size={20} /></button>
                
                {/* Balanced Top Navigation Row */}
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => navigate('/canvas')} className="text-[#CBCBC9] hover:text-km-red flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all">
                    <ArrowLeft size={12} /> Back to Ghostwriter
                  </button>
                  <span className="text-[9px] font-bold text-[#8E8E8E] uppercase tracking-widest truncate max-w-[180px] text-right">
                    {userEmail}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex border border-[#ECECEC] shrink-0">
                    <div className="bg-km-red p-2"><Heart className="w-4 h-4 fill-white text-white" /></div>
                    <div className="bg-white p-2"><Star className="w-4 h-4 text-km-red fill-km-red" /></div>
                  </div>
                  <div className="flex flex-col text-left">
                    <h1 className="font-display text-[2.5rem] leading-[0.85] uppercase tracking-wide m-0">Keep<br/>Meaning</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-serif text-[#CBCBC9] tracking-widest uppercase">LinkedIn Studio</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-[#F0F0EE] flex gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('pilot')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'pilot' ? 'bg-black text-white shadow-lg' : 'bg-[#FDFDFB] text-[#CBCBC9] hover:text-black border border-[#ECECEC]'}`}><Zap size={12} /> Pilot Hub</button>
                <button onClick={() => setActiveTab('voice')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'voice' ? 'bg-black text-white shadow-lg' : 'bg-[#FDFDFB] text-[#CBCBC9] hover:text-black border border-[#ECECEC]'}`}><Fingerprint size={12} /> Voice DNA</button>
                <button onClick={() => setActiveTab('archive')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'archive' ? 'bg-black text-white shadow-lg' : 'bg-[#FDFDFB] text-[#CBCBC9] hover:text-black border border-[#ECECEC]'}`}><Archive size={12} /> Archive</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
                <AnimatePresence mode="wait">
                  {activeTab === 'pilot' ? (
                    <motion.div key="pilot-ui" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                      <button onClick={initializeNewRitual} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-km-red bg-km-red/5 hover:bg-km-red/10 transition-all border border-km-red/20 shadow-sm group"><Plus size={12} className="group-hover:rotate-90 transition-transform duration-300" /> New Ritual Workspace</button>
                      <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9] flex items-center gap-2"><FileText size={12} className="text-km-red" /> Insight Source</label><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Paste messy notes or transcripts..." className="w-full h-40 resize-none outline-none font-serif text-lg leading-relaxed bg-[#FDFDFB] border border-[#ECECEC] rounded-2xl p-4 focus:border-km-red/40 focus:bg-white transition-all" /></div>
                      <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9] flex items-center gap-2"><Anchor size={12} className="text-km-red" /> Meaning Anchor</label><input value={anchor} onChange={(e) => setAnchor(e.target.value)} placeholder="The one truth to preserve..." className="w-full bg-[#FDFDFB] border border-[#ECECEC] rounded-xl px-4 py-3 text-sm outline-none focus:border-km-red/30 focus:bg-white transition-all shadow-sm" /></div>
                      <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9] flex items-center gap-2"><Layout size={12} className="text-km-red" /> Strategic Lens</label><select value={selectedLens} onChange={(e) => setSelectedLens(e.target.value)} className="w-full bg-[#FDFDFB] border border-[#ECECEC] rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-km-red/40 transition-all">{LENSES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                      <button onClick={() => handleGenerate()} disabled={!draft.trim() || isGenerating || isSyncing || !dbUserId} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-km-red transition-all shadow-md disabled:opacity-20">{isGenerating && generationStep !== 'refining' ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}{activeRitualId ? 'Regenerate Ritual' : 'Initialize Ritual'}</button>
                      {output && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-8 border-t border-[#F5F5F3]">
                           <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9]">Studio Intelligence</label>
                           <div className="space-y-4">
                              <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#8E8E8E]">Meaning Integrity</span><span className="text-xs font-bold">{meaningScore}/10</span></div>
                              <div className="h-1 w-full bg-[#F0F0EE] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${meaningScore * 10}%` }} className="h-full bg-km-red shadow-[0_0_10px_rgba(230,57,70,0.3)]" /></div>
                              <div className="pt-2 flex flex-wrap gap-2">{purgedItems.map((word, i) => (<span key={i} className="text-[10px] font-mono text-[#CBCBC9] line-through uppercase tracking-tighter">{word}</span>))}</div>
                           </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : activeTab === 'voice' ? (
                    <motion.div key="voice-ui" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Fingerprint size={20} className="text-km-red" />
                          <h3 className="font-serif font-bold italic text-lg">Voice DNA Analyst</h3>
                        </div>
                        <p className="text-xs text-[#8E8E8E] leading-relaxed italic font-serif">
                          Paste 5-10 of your best LinkedIn posts. We'll extract your verbal fingerprint to make future artifacts unmistakably yours.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9]">Writing Samples</label>
                        <textarea 
                          value={voiceSamples} 
                          onChange={(e) => setVoiceSamples(e.target.value)} 
                          placeholder="Paste your past posts here..." 
                          className="w-full h-64 resize-none outline-none font-serif text-sm leading-relaxed bg-[#FDFDFB] border border-[#ECECEC] rounded-2xl p-4 focus:border-km-red/40 focus:bg-white transition-all" 
                        />
                      </div>

                      <button 
                        onClick={handleExtractVoiceDNA} 
                        disabled={!voiceSamples.trim() || isAnalyzingVoice || isSyncing || !dbUserId} 
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-km-red transition-all shadow-md disabled:opacity-20"
                      >
                        {isAnalyzingVoice ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
                        {voiceDNA ? 'Re-Analyze Voice' : 'Extract Voice DNA'}
                      </button>

                      {voiceDNA && (!Array.isArray(voiceDNA) || voiceDNA.length > 0) && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-km-red/5 border border-km-red/10 rounded-3xl space-y-6">
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-km-red uppercase tracking-widest">Extracted Identity</span>
                            <p className="text-sm font-serif italic text-black/80">{Array.isArray(voiceDNA) && voiceDNA.length > 0 ? voiceDNA[0].dna.IDENTITY : voiceDNA.IDENTITY}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-km-red uppercase tracking-widest">Core Audience</span>
                            <p className="text-sm font-serif italic text-black/80">{Array.isArray(voiceDNA) && voiceDNA.length > 0 ? voiceDNA[0].dna.AUDIENCE : voiceDNA.AUDIENCE}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-km-red uppercase tracking-widest">Verbal Rules</span>
                            <ul className="space-y-1">
                              {(Array.isArray(voiceDNA) && voiceDNA.length > 0 ? voiceDNA[0].dna.VOICE_RULES : (voiceDNA.VOICE_RULES || [])).map((rule: string, i: number) => (
                                <li key={i} className="text-[11px] font-serif italic text-black/60 flex gap-2">
                                  <span className="text-km-red">•</span> {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="archive-ui" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#F0F0EE] pb-4"><span className="text-[10px] font-bold uppercase tracking-widest text-[#CBCBC9]">Ritual Memories</span><button onClick={() => syncMemoryWithTurso(userEmail)} className="p-1 hover:text-km-red transition-colors"><RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} /></button></div>
                      <div className="space-y-3">
                        {ritualsArchive.map((ritual) => (
                          <div key={ritual.id} className="relative group">
                            <button onClick={() => loadSpecificRitual(ritual)} className={`w-full text-left p-5 rounded-2xl border transition-all ${activeRitualId === ritual.id ? 'border-km-red bg-km-red/5' : 'border-[#ECECEC] bg-[#FDFDFB] hover:border-black/20'}`}>
                              <div className="flex items-center gap-2 mb-2"><Clock size={10} className="text-[#CBCBC9]" /><span className="text-[9px] font-bold text-[#CBCBC9] uppercase tracking-widest">{new Date(ritual.timestamp).toLocaleDateString()}</span></div>
                              <p className="text-sm font-serif font-bold line-clamp-1 group-hover:text-km-red transition-colors">{ritual.anchor || 'Pure Intent'}</p>
                              <p className="text-[10px] text-[#8E8E8E] line-clamp-2 mt-1 opacity-60 font-serif italic">{ritual.draft}</p>
                            </button>
                            <button onClick={() => deleteRitualFromArchive(ritual.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-[#CBCBC9] hover:text-km-red transition-all"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 bg-[#FDFDFB] border-t border-[#F0F0EE]">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#CBCBC9]"><div className="flex items-center gap-1.5"><Cpu size={10} className="text-green-500 animate-pulse" /><div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /></div>Engine Ready</div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#CBCBC9]"><Cloud size={10} className={isSyncing ? 'text-km-red animate-bounce' : 'text-green-500'} />{isSyncing ? 'Syncing...' : 'Archive Secure'}</div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN CANVAS AREA */}
        <div className="flex-1 flex flex-col relative h-full">
          <header className="h-16 border-b border-[#F0F0EE] bg-white/80 backdrop-blur-md flex items-center px-6 lg:hidden shrink-0">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-km-red/5 rounded-lg text-black transition-colors"><Menu size={20} /></button>
             <span className="ml-4 text-[10px] font-bold uppercase tracking-widest">Pilot Hub</span>
          </header>

          <main className="flex-1 bg-[#FDFDFB] overflow-y-auto p-6 md:p-20 flex justify-center relative">
            <div className="absolute top-0 left-0 h-0.5 w-full bg-km-red/10" />
            <div className="max-w-3xl w-full pb-64">
              <AnimatePresence mode="wait">
                {isGenerating && generationStep !== 'refining' ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center space-y-8">
                    <div className="relative"><RefreshCw className="animate-spin text-km-red/10" size={80} strokeWidth={0.5} /><Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-km-red animate-pulse" size={28} /></div>
                    <div className="text-center space-y-2"><p className="font-serif italic text-xl text-black">{generationStep === 'drafting' ? 'Capturing rhythm...' : 'Auditing slop...'}</p><p className="text-[10px] font-bold uppercase tracking-[0.4em] text-km-red/40">Studio Series active</p></div>
                  </motion.div>
                ) : output ? (
                  <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#F0F0EE] pb-8 gap-6">
                      <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-km-red/5 rounded-xl flex items-center justify-center"><Sparkles className="text-km-red" size={20} /></div><div><h2 className="text-lg font-serif font-bold italic leading-none text-black">Refined Artifact</h2><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8E8E8E] mt-1">Archive ID: #{activeRitualId?.slice(-4)}</p></div></div>
                      <button onClick={handleCopyArtifact} className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-km-red transition-all shadow-md active:scale-95"><Clipboard size={14} /> Copy Masterpiece</button>
                    </div>
                    <div className="relative selection:bg-km-red selection:text-white text-left"><TypewriterText text={output} /></div>
                    <div className="pt-20 opacity-30 pointer-events-none text-center"><div className="flex items-center justify-center gap-4 mb-4"><div className="h-[1px] w-12 bg-km-red/30"></div><span className="text-[10px] font-bold uppercase tracking-[0.5em] text-km-red">RITUAL COMPLETE</span><div className="h-[1px] w-12 bg-km-red/30"></div></div><p className="text-[9px] font-serif italic uppercase tracking-widest text-[#8E8E8E]">Keep Meaning · LinkedIn Studio Series</p></div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center space-y-12 text-center">
                    <div className="relative group"><div className="absolute inset-0 bg-km-red/5 blur-3xl rounded-full scale-150 opacity-50 transition-opacity" /><div className="w-24 h-24 bg-white border border-[#F0F0EE] rounded-[32px] flex items-center justify-center shadow-sm relative z-10"><LinkedinLogo className="w-10 h-10 text-[#ECECEC]" /></div></div>
                    <div className="space-y-4 max-w-sm relative z-10">
                      <h2 className="text-2xl font-serif font-medium tracking-tight text-center">The Canvas awaits.</h2>
                      <p className="text-sm text-[#8E8E8E] leading-relaxed italic font-serif text-center">Initialize the ritual from the command hub to begin engineering your high-impact brand asset.</p>
                      <button 
                        onClick={() => {
                          setDraft("I am writing about how remote work is actually killing junior developer growth. They don't get to overhear senior devs solving problems. I want it to sound grounded, but not like an old man yelling at clouds.");
                          setAnchor("Remote work isolates juniors from ambient learning.");
                          setSelectedLens('contrarian');
                          setIsSidebarOpen(true);
                        }}
                        className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest text-km-red bg-km-red/5 hover:bg-km-red/10 transition-all border border-km-red/20"
                      >
                        <Wand2 size={14} /> Try an Example
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* FLOATING COMMANDER - Viewport Center */}
          <AnimatePresence>
            {output && isCommanderVisible && (
              <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="absolute bottom-12 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-white shadow-[0_32px_64px_rgba(0,0,0,0.1)] rounded-[32px] p-2 flex items-center gap-2 group pointer-events-auto">
                  <div className="flex-1 relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#CBCBC9] group-focus-within:text-km-red transition-colors"><MessageCircle size={18} strokeWidth={1.5} /></div>
                    <input value={refinementInput} onChange={(e) => setRefinementInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate(true)} placeholder="Command a refinement..." className="w-full bg-transparent pl-14 pr-6 py-5 text-sm outline-none font-serif italic text-black" />
                  </div>
                  <button onClick={() => handleGenerate(true)} disabled={!refinementInput.trim() || isGenerating || isSyncing || !dbUserId} className="w-14 h-14 bg-black text-white rounded-[24px] flex items-center justify-center hover:bg-km-red transition-all shadow-lg active:scale-95 disabled:opacity-20">{isGenerating && generationStep === 'refining' ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRight size={22} />}</button>
                  <button onClick={() => setIsCommanderVisible(false)} className="w-10 h-10 flex items-center justify-center text-[#CBCBC9] hover:text-black transition-colors rounded-full"><Minimize2 size={16} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {output && !isCommanderVisible && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setIsCommanderVisible(true)} className="absolute bottom-12 right-12 w-14 h-14 bg-white border border-[#F0F0EE] shadow-xl rounded-2xl flex items-center justify-center text-[#1D1D1B] hover:text-km-red transition-all z-50 group"><MessageSquareQuote size={24} className="group-hover:scale-110 transition-transform" /><div className="absolute -top-1 -right-1 w-3 h-3 bg-km-red rounded-full border-2 border-white animate-pulse" /></motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {toastMessage && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-[200] bg-black text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-[11px] font-bold uppercase tracking-widest">{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
