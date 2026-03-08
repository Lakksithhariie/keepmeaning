import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, RefreshCw, ArrowRight, User, Globe, MessageSquareQuote, Send, Clipboard, RotateCcw, ChevronDown, PenTool, Layout, Anchor, Zap, MessageCircle, FileText, Wand2, Maximize2, Minimize2, Cpu, History as HistoryIcon, Search, Terminal, Cloud, Lock, Mail, Check, Plus, Clock, Archive, Heart, Star, ArrowLeft, X, Trash2, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our Keep Meaning agent skills
import agentConfig from '../agent.md?raw';
import strategySkill from '../skills/linkedin-content-strategy/SKILL.md?raw';
import voiceSkill from '../skills/linkedin-voice/SKILL.md?raw';
import structureSkill from '../skills/linkedin-post-structure/SKILL.md?raw';
import editorSkill from '../skills/linkedin-editor/SKILL.md?raw';

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

const BASEROW_TOKEN = import.meta.env.VITE_BASEROW_TOKEN || '';
const TABLE_ID = '874115';

interface RitualSession {
  id: string;
  draft: string;
  anchor: string;
  lensId: string;
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
  const lines = (text || '').split('\n');
  return (
    <div className="flex flex-col gap-5">
      {lines.map((line, lineIdx) => (
        <motion.p
          key={lineIdx}
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.003 } } }}
          className="text-left leading-[1.8] text-[#1D1D1B] font-serif text-[21px] md:text-[23px] antialiased"
        >
          {(line || '').split(' ').map((word, wordIdx) => (
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
  const [baserowRowId, setBaserowRowId] = useState<number | null>(null);
  const [showAuthModal, setShowEmailModal] = useState(!userEmail);
  const [emailInput, setEmailInput] = useState('');
  
  // UI Layout States
  const [activeTab, setActiveTab] = useState<'pilot' | 'archive'>('pilot');
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
  
  // System States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'' | 'drafting' | 'auditing' | 'refining'>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [refinementInput, setRefinementInput] = useState('');
  const [meaningScore, setMeaningScore] = useState(0);
  const [purgedItems, setPurgedItems] = useState<string[]>([]);

  const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || 'DcAIy22l4lOMxdUBen4cJVI3mWFTkAh3';
  const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

  // State Recovery Heartbeat
  useEffect(() => {
    localStorage.setItem('km_temp_draft', draft || '');
    localStorage.setItem('km_temp_anchor', anchor || '');
  }, [draft, anchor]);

  useEffect(() => {
    if (userEmail && !baserowRowId) { syncMemoryWithCloud(userEmail); }
  }, [userEmail]);

  const syncMemoryWithCloud = async (email: string) => {
    if (isSyncing || !email) return;
    setIsSyncing(true);
    try {
      const encodedEmail = encodeURIComponent(email.trim());
      const response = await fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true&filter__field_7552090__equal=${encodedEmail}`, {
        headers: { 'Authorization': `Token ${BASEROW_TOKEN}` }
      });
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const userRow = data.results[0];
        setBaserowRowId(userRow.id);
        let parsedArchive: RitualSession[] = [];
        try { 
          parsedArchive = userRow.history ? JSON.parse(userRow.history) : [];
          if (!Array.isArray(parsedArchive)) parsedArchive = [];
        } catch (e) { parsedArchive = []; }
        setRitualsArchive(parsedArchive);
        if (parsedArchive.length > 0 && !activeRitualId) loadSpecificRitual(parsedArchive[0]);
      } else {
        const createRes = await fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/?user_field_names=true`, {
          method: 'POST',
          headers: { 'Authorization': `Token ${BASEROW_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'email': email.trim(), 'usage_count': 0, 'history': '[]' })
        });
        const newUser = await createRes.json();
        setBaserowRowId(newUser.id || null);
      }
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
  };

  const loadSpecificRitual = (ritual: RitualSession) => {
    if (!ritual) return;
    setActiveRitualId(ritual.id || null);
    setDraft(ritual.draft || '');
    setAnchor(ritual.anchor || '');
    setSelectedLens(ritual.lensId || LENSES[0].id);
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
    const newArchive = ritualsArchive.filter(r => r.id !== id);
    setRitualsArchive(newArchive);
    if (activeRitualId === id) initializeNewRitual();
    updateCloudArchive(newArchive, '');
  };

  const updateCloudArchive = async (updatedArchive: RitualSession[], latestOutput: string) => {
    if (!baserowRowId) return;
    setIsSyncing(true);
    try {
      const safeArchive = Array.isArray(updatedArchive) ? updatedArchive : [];
      await fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_ID}/${baserowRowId}/?user_field_names=true`, {
        method: 'PATCH',
        headers: { 'Authorization': `Token ${BASEROW_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'draft': draft || '',
          'anchor': anchor || '',
          'last_artifact': latestOutput || '',
          'history': JSON.stringify(safeArchive),
          'usage_count': safeArchive.reduce((acc, curr) => acc + (Array.isArray(curr.chatHistory) ? curr.chatHistory.length / 2 : 0), 0)
        })
      });
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
  };

  const handleGenerate = async (isRefining = false) => {
    if (!(draft || '').trim() || isGenerating) return;
    setIsGenerating(true);
    if (!isRefining) setOutput('');
    setGenerationStep(isRefining ? 'refining' : 'drafting');
    const lens = LENSES.find(l => l.id === selectedLens);
    try {
      const draftMessages = [ { role: 'system', content: `# Role\nYou are a world-class LinkedIn ghostwriter. Transform raw material into a highly authentic post.\n\n# Rules\n- NO PREAMBLES.\n- NO MARKDOWN.\n- NO ROBOTIC PUNCTUATION.\n- Preserve Meaning: "${anchor || 'Extract core truth'}"\n- Current Lens: ${lens?.name} (${lens?.desc})` } ];
      if (isRefining && Array.isArray(currentHistory)) { currentHistory.forEach(msg => draftMessages.push(msg)); draftMessages.push({ role: 'user', content: `REFINE (STAY ON LENS: ${lens?.name}): ${refinementInput}` }); } 
      else { draftMessages.push({ role: 'user', content: `Draft: ${draft}` }); }
      const draftResponse = await fetch(MISTRAL_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MISTRAL_API_KEY}` }, body: JSON.stringify({ model: 'mistral-medium-2508', messages: draftMessages, temperature: 0.8 }) });
      const draftData = await draftResponse.json();
      const rawOutput = draftData.choices?.[0]?.message?.content || "";
      setGenerationStep('auditing');
      const auditResponse = await fetch(MISTRAL_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MISTRAL_API_KEY}` }, body: JSON.stringify({ model: 'mistral-medium-2508', messages: [ { role: 'system', content: `# Role\nYou are the KeepMeaning Audit Engine. Clean the post.\n\n# Response Format\n<CLEANED_POST>\n(text)\n</CLEANED_POST>\n<SCORE>X</SCORE>` }, { role: "user", content: `Post to Audit: ${rawOutput}` } ], temperature: 0.1 }) });
      const auditData = await auditResponse.json();
      const auditContent = auditData.choices?.[0]?.message?.content || "";
      const cleanedPostMatch = auditContent.match(/<CLEANED_POST>([\s\S]*?)<\/CLEANED_POST>/i);
      let cleanedPost = cleanedPostMatch ? cleanedPostMatch[1].trim() : auditContent.replace(/<SCORE>\d+<\/SCORE>/i, '').trim();
      const scoreMatch = auditContent.match(/<SCORE>(\d+)<\/SCORE>/i);
      if (cleanedPost) {
        const finalClean = cleanedPost.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').replace(/—/g, ' ').replace(/:/g, '').replace(/[""]/g, '"').replace(/['']/g, "'").trim();
        setOutput(finalClean);
        setMeaningScore(scoreMatch ? parseInt(scoreMatch[1]) : 9);
        const updatedHistory = [...currentHistory];
        if (!isRefining) updatedHistory.push({ role: 'user', content: `Draft: ${draft}` });
        else updatedHistory.push({ role: 'user', content: refinementInput });
        updatedHistory.push({ role: 'assistant', content: finalClean });
        setCurrentHistory(updatedHistory);
        setRefinementInput('');
        const ritualId = activeRitualId || `ritual_${Date.now()}`;
        const ritualData: RitualSession = { id: ritualId, draft, anchor, lensId: selectedLens, artifact: finalClean, chatHistory: updatedHistory, timestamp: Date.now() };
        const existingIdx = ritualsArchive.findIndex(r => r.id === ritualId);
        let newArchive = [...ritualsArchive];
        if (existingIdx > -1) newArchive[existingIdx] = ritualData;
        else newArchive = [ritualData, ...newArchive];
        setRitualsArchive(newArchive);
        setActiveRitualId(ritualId);
        updateCloudArchive(newArchive, finalClean);
        setPurgedItems(AI_SLOP.filter(word => (draft || '').toLowerCase().includes(word) && !finalClean.toLowerCase().includes(word)));
      }
    } catch (error) { setOutput("Studio connection lost."); } finally { setIsGenerating(false); setGenerationStep(''); }
  };

  const handleAuth = () => {
    if (emailInput.includes('@')) {
      const email = emailInput.trim();
      localStorage.setItem('km_linkedin_email', email);
      setUserEmail(email);
      setShowEmailModal(false);
    }
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
                  <button onClick={handleAuth} disabled={!emailInput.includes('@')} className="w-full bg-black text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-km-red transition-all shadow-xl disabled:opacity-20">Access Cloud Memory <ArrowRight size={18} /></button>
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

              <div className="p-4 border-b border-[#F0F0EE] flex gap-2">
                <button onClick={() => setActiveTab('pilot')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'pilot' ? 'bg-black text-white shadow-lg' : 'bg-[#FDFDFB] text-[#CBCBC9] hover:text-black border border-[#ECECEC]'}`}><Zap size={12} /> Pilot Hub</button>
                <button onClick={() => setActiveTab('archive')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'archive' ? 'bg-black text-white shadow-lg' : 'bg-[#FDFDFB] text-[#CBCBC9] hover:text-black border border-[#ECECEC]'}`}><Archive size={12} /> Archive ({ritualsArchive.length})</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
                <AnimatePresence mode="wait">
                  {activeTab === 'pilot' ? (
                    <motion.div key="pilot-ui" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                      <button onClick={initializeNewRitual} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-km-red bg-km-red/5 hover:bg-km-red/10 transition-all border border-km-red/20 shadow-sm group"><Plus size={12} className="group-hover:rotate-90 transition-transform duration-300" /> New Ritual Workspace</button>
                      <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9] flex items-center gap-2"><FileText size={12} className="text-km-red" /> Insight Source</label><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Paste messy notes or transcripts..." className="w-full h-40 resize-none outline-none font-serif text-lg leading-relaxed bg-[#FDFDFB] border border-[#ECECEC] rounded-2xl p-4 focus:border-km-red/40 focus:bg-white transition-all" /></div>
                      <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9] flex items-center gap-2"><Anchor size={12} className="text-km-red" /> Meaning Anchor</label><input value={anchor} onChange={(e) => setAnchor(e.target.value)} placeholder="The one truth to preserve..." className="w-full bg-[#FDFDFB] border border-[#ECECEC] rounded-xl px-4 py-3 text-sm outline-none focus:border-km-red/30 focus:bg-white transition-all shadow-sm" /></div>
                      <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCBC9] flex items-center gap-2"><Layout size={12} className="text-km-red" /> Strategic Lens</label><select value={selectedLens} onChange={(e) => setSelectedLens(e.target.value)} className="w-full bg-[#FDFDFB] border border-[#ECECEC] rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-km-red/40 transition-all">{LENSES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                      <button onClick={() => handleGenerate()} disabled={!(draft || '').trim() || isGenerating} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-km-red transition-all shadow-md disabled:opacity-20">{isGenerating && generationStep !== 'refining' ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}{activeRitualId ? 'Regenerate Ritual' : 'Initialize Ritual'}</button>
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
                  ) : (
                    <motion.div key="archive-ui" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#F0F0EE] pb-4"><span className="text-[10px] font-bold uppercase tracking-widest text-[#CBCBC9]">Ritual Memories</span><button onClick={() => syncMemoryWithCloud(userEmail)} className="p-1 hover:text-km-red transition-colors"><RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} /></button></div>
                      <div className="space-y-3">
                        {ritualsArchive.map((ritual) => (
                          <div key={ritual.id} className="relative group">
                            <button onClick={() => loadSpecificRitual(ritual)} className={`w-full text-left p-5 rounded-2xl border transition-all group ${activeRitualId === ritual.id ? 'border-km-red bg-km-red/5' : 'border-[#ECECEC] bg-[#FDFDFB] hover:border-black/20'}`}>
                              <div className="flex items-center gap-2 mb-2"><Clock size={10} className="text-[#CBCBC9]" /><span className="text-[9px] font-bold text-[#CBCBC9] uppercase tracking-widest">{ritual.timestamp ? new Date(ritual.timestamp).toLocaleDateString() : 'Previous'}</span></div>
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

          <main className="flex-1 bg-[#FDFDFB] overflow-y-auto p-8 md:p-20 flex justify-center relative">
            <div className="absolute top-0 left-0 h-0.5 w-full bg-km-red/10" />
            <div className="max-w-3xl w-full pb-64">
              <AnimatePresence mode="wait">
                {isGenerating && generationStep !== 'refining' ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center space-y-8">
                    <div className="relative"><RefreshCw className="animate-spin text-km-red/10" size={80} strokeWidth={0.5} /><Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-km-red animate-pulse" size={28} /></div>
                    <div className="text-center space-y-2"><p className="font-serif italic text-xl text-black">{generationStep === 'drafting' ? 'Capturing the human rhythm...' : 'Performing 2-pass surgical audit...'}</p><p className="text-[10px] font-bold uppercase tracking-[0.4em] text-km-red/40">Studio Series active</p></div>
                  </motion.div>
                ) : output ? (
                  <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#F0F0EE] pb-8 gap-6 text-left">
                      <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-km-red/5 rounded-xl flex items-center justify-center transition-transform hover:rotate-6"><Sparkles className="text-km-red" size={20} /></div><div className="text-left"><h2 className="text-lg font-serif font-bold italic leading-none text-black text-left">Refined Artifact</h2><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8E8E8E] mt-1 text-left">Archive Ref: {activeRitualId ? activeRitualId.toString().slice(-4) : 'New'}</p></div></div>
                      <button onClick={() => { navigator.clipboard.writeText(output); alert('Artifact copied.'); }} className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-km-red transition-all shadow-md active:scale-95"><Clipboard size={14} /> Copy Masterpiece</button>
                    </div>
                    <div className="relative selection:bg-km-red selection:text-white text-left"><TypewriterText text={output} /></div>
                    <div className="pt-20 opacity-30 pointer-events-none text-center"><div className="flex items-center justify-center gap-4 mb-4"><div className="h-[1px] w-12 bg-km-red/30"></div><span className="text-[10px] font-bold uppercase tracking-[0.5em] text-km-red">RITUAL COMPLETE</span><div className="h-[1px] w-12 bg-km-red/30"></div></div><p className="text-[9px] font-serif italic uppercase tracking-widest text-[#8E8E8E]">Keep Meaning · LinkedIn Studio Series</p></div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center space-y-12 text-center">
                    <div className="relative group"><div className="absolute inset-0 bg-km-red/5 blur-3xl rounded-full scale-150 opacity-50 transition-opacity" /><div className="w-24 h-24 bg-white border border-[#F0F0EE] rounded-[32px] flex items-center justify-center shadow-sm relative z-10 transition-transform group-hover:-rotate-3"><LinkedinLogo className="w-10 h-10 text-[#ECECEC]" /></div></div>
                    <div className="space-y-4 max-w-sm relative z-10 text-center"><h2 className="text-2xl font-serif font-medium tracking-tight text-center">The Canvas awaits.</h2><p className="text-sm text-[#8E8E8E] leading-relaxed italic font-serif text-center">Initialize the ritual from the command hub to begin engineering your high-impact brand asset.</p></div>
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
                  <button onClick={() => handleGenerate(true)} disabled={!refinementInput.trim() || isGenerating} className="w-14 h-14 bg-black text-white rounded-[24px] flex items-center justify-center hover:bg-km-red transition-all shadow-lg active:scale-95 disabled:opacity-20">{isGenerating && generationStep === 'refining' ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRight size={22} />}</button>
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
        </div>
      </div>
    </div>
  );
};
