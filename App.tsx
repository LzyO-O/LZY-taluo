import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppPhase, DrawnCard, Spread, TarotCard, Topic } from './types';
import { spreads, topics } from './data/spreads';
import Background from './components/Background';
import TableTop from './components/TableTop';
import CustomCursor from './components/CustomCursor';
import { getTarotReading } from './services/geminiService';
import { Loader2, Sparkles, ChevronRight, X, Compass, RefreshCw, Download, Star, Edit3, Keyboard } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getDeck } from './data/tarotCards';

// Custom Premium Logo Component - "Mystical Star"
const DestinyLogo = () => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    {/* Outer Glow */}
    <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full"></div>

    {/* Rotating Outer Ring */}
    <motion.svg 
       viewBox="0 0 100 100" 
       className="absolute inset-0 w-full h-full text-amber-200/40"
       animate={{ rotate: 360 }}
       transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
       {/* Decorative Ring Pattern */}
       <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
       <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
       <circle cx="50" cy="2" r="1.5" fill="currentColor" />
       <circle cx="50" cy="98" r="1.5" fill="currentColor" />
       <circle cx="2" cy="50" r="1.5" fill="currentColor" />
       <circle cx="98" cy="50" r="1.5" fill="currentColor" />
    </motion.svg>
    
    {/* Inner Octagram Star */}
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-100 relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
       {/* 8-Pointed Star Path */}
       <path fill="url(#logoGradient)" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
       {/* Inner Diamond */}
       <path fill="#fff" fillOpacity="0.8" d="M12 8L16 12L12 16L8 12L12 8Z" />
       
       <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#fffbeb" />
             <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
       </defs>
    </svg>
  </div>
);

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.INTRO);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [readingResult, setReadingResult] = useState<string>("");
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  
  // Lock to prevent double requests in strict mode or rapid re-renders
  const isGeneratingRef = useRef(false);

  // Custom Topic State
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  
  // Ref for capturing content for PDF
  const readingContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Preload Images Strategy
  useEffect(() => {
    const deck = getDeck();
    
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // Immediately load Major Arcana (usually most significant)
    const majors = deck.filter(c => c.arcana === 'Major');
    majors.forEach(c => preloadImage(c.image));

    // Load Minor Arcana with a slight delay to not block initial render resources
    const minors = deck.filter(c => c.arcana === 'Minor');
    setTimeout(() => {
       minors.forEach(c => preloadImage(c.image));
    }, 2000);

  }, []);

  // Suggestions for custom input
  const customSuggestions = [
    "一会吃什么？",
    "这个需求做得顺不顺利？",
    "最近的财运如何？",
    "TA 到底喜不喜欢我？",
    "这周我要注意什么？",
    "我该换工作吗？"
  ];

  // Filter spreads based on selected topic
  const availableSpreads = selectedTopic 
    ? spreads.filter(s => selectedTopic.allowedSpreadIds.includes(s.id))
    : [];

  const handleTopicSelection = (topic: Topic) => {
    if (topic.id === 'private_custom') {
      setShowCustomInput(true);
      return;
    }
    setSelectedTopic(topic);
    setPhase(AppPhase.SELECT_SPREAD);
  };

  const handleCustomSubmit = () => {
    if (!customQuery.trim()) return;
    
    // Create a dynamic topic based on user input
    const baseTopic = topics.find(t => t.id === 'private_custom');
    const customTopic: Topic = {
      id: 'private_custom',
      name: customQuery, // Use the query as the name for the AI prompt
      description: '私人定制占卜',
      allowedSpreadIds: baseTopic ? baseTopic.allowedSpreadIds : []
    };
    
    setSelectedTopic(customTopic);
    setShowCustomInput(false);
    setPhase(AppPhase.SELECT_SPREAD);
  };

  const startReading = (spreadId: string) => {
    const spread = spreads.find(s => s.id === spreadId);
    if (spread) {
      setSelectedSpread(spread);
      setDrawnCards([]);
      setReadingResult("");
      isGeneratingRef.current = false; // Reset lock
      setPhase(AppPhase.SHUFFLE);
    }
  };

  const handleDrawCard = (card: TarotCard, isReversed: boolean) => {
    if (!selectedSpread) return;
    const nextPos = selectedSpread.positions.find(p => !drawnCards.some(d => d.positionId === p.id));
    if (nextPos) {
      const newDrawnCard: DrawnCard = { card, isReversed, positionId: nextPos.id };
      setDrawnCards(prev => [...prev, newDrawnCard]);
    }
  };

  const generateInterpretation = async () => {
    if (!selectedSpread || drawnCards.length === 0) return;
    if (isGeneratingRef.current) return; // Prevent double call
    
    isGeneratingRef.current = true;
    setIsReadingLoading(true);
    setShowReadingModal(true);
    
    try {
      const result = await getTarotReading(selectedTopic, selectedSpread, drawnCards);
      setReadingResult(result);
    } catch (error) {
      console.error("Failed to generate reading", error);
      setReadingResult("抱歉，连接宇宙信号时出现未知干扰，请稍后重试。");
    } finally {
      setIsReadingLoading(false);
      isGeneratingRef.current = false;
    }
  };

  React.useEffect(() => {
    if (phase === AppPhase.READING && !readingResult && !isReadingLoading) {
       generateInterpretation();
    }
  }, [phase]);

  const resetApp = () => {
    setPhase(AppPhase.INTRO);
    setSelectedTopic(null);
    setSelectedSpread(null);
    setDrawnCards([]);
    setReadingResult("");
    setShowReadingModal(false);
    setCustomQuery("");
    isGeneratingRef.current = false;
  };
  
  const handleDownload = async () => {
    if (!readingContentRef.current) return;
    setIsDownloading(true);
    
    try {
      // 1. Create a deep clone of the content
      // Cloning is essential to capture the full height of scrollable content
      // and to modify styles (like removing CORS-blocking textures) without affecting the UI.
      const originalElement = readingContentRef.current;
      const clone = originalElement.cloneNode(true) as HTMLElement;

      // 2. Create a temporary container off-screen
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.left = '0';
      container.style.zIndex = '-1000';
      container.style.width = '800px'; // Fixed width suitable for PDF scaling
      document.body.appendChild(container);
      container.appendChild(clone);

      // 3. Style the clone for clean capture
      // Use a solid background color instead of textures to prevent CORS issues with html2canvas
      clone.style.height = 'auto';
      clone.style.overflow = 'visible';
      clone.style.backgroundColor = '#0b0a10'; 
      clone.style.backgroundImage = 'none';
      clone.style.color = '#e2e8f0';
      clone.style.padding = '40px'; // Add padding for the PDF look
      clone.style.borderRadius = '0';

      // 4. Generate Canvas
      const canvas = await html2canvas(clone, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#0b0a10',
        logging: false,
        width: 800,
        windowWidth: 800
      });

      // 5. Cleanup DOM
      document.body.removeChild(container);

      // 6. Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional Pages (if content is long)
      while (heightLeft > 0) {
        position -= pdfHeight; // Move the image up for the next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`命运_Destiny_${selectedTopic?.name || 'reading'}.pdf`);
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("无法生成 PDF，可能是因为浏览器安全限制。您可以尝试使用系统截图保存。");
    } finally {
      setIsDownloading(false);
    }
  };

  const isImmersivePhase = phase === AppPhase.SHUFFLE || phase === AppPhase.DRAW;

  return (
    <div className="relative w-full h-full min-h-screen text-slate-200 selection:bg-amber-500/30 font-sans overflow-hidden">
      <Background />
      <CustomCursor />

      <main className="relative w-full h-full flex flex-col z-10 h-screen">
        
        {/* Header - Glassmorphism */}
        <AnimatePresence>
          {!isImmersivePhase && (
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-none w-full px-6 py-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm"
            >
               <div className="flex items-center gap-4 select-none group cursor-pointer" onClick={resetApp}>
                 <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <DestinyLogo />
                 </div>
                 <h1 className="text-lg md:text-xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-100 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] tracking-[0.2em]">
                   命运
                 </h1>
               </div>
               
               {phase !== AppPhase.INTRO && (
                 <button 
                   onClick={resetApp}
                   className="flex items-center gap-2 text-indigo-200/50 hover:text-amber-100 transition-colors font-cinzel text-[10px] tracking-[0.2em] uppercase border border-white/5 hover:border-amber-500/30 px-3 py-1.5 rounded-full hover:bg-white/5"
                 >
                   <RefreshCw size={10} /> 重置
                 </button>
               )}
            </motion.header>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 relative w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="min-h-full flex flex-col items-center justify-center p-4 py-8">
            
            <AnimatePresence mode="wait">
              
              {/* INTRO SCREEN */}
              {phase === AppPhase.INTRO && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                  className="flex flex-col items-center text-center max-w-4xl mt-auto mb-auto relative z-10"
                >
                  <div className="mb-12 relative select-none">
                     {/* Enhanced Background Glow / Rotating Wheel */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none">
                        <motion.div 
                          className="absolute inset-0 border border-amber-500/10 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500/30 rounded-full"></div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500/30 rounded-full"></div>
                        </motion.div>
                        <motion.div 
                          className="absolute inset-8 border border-indigo-500/10 rounded-full border-dashed"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 to-transparent blur-[60px] rounded-full animate-pulse"></div>
                     </div>

                     <motion.div 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ duration: 1, ease: "easeOut" }}
                       className="relative z-10"
                     >
                       <h2 className="text-6xl md:text-9xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-100 to-amber-600/50 drop-shadow-[0_0_50px_rgba(251,191,36,0.2)] leading-none tracking-widest pl-4">
                         命运
                       </h2>
                       <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-6"></div>
                       <p className="text-sm md:text-lg font-cormorant italic text-indigo-100/70 tracking-[0.5em] font-light uppercase">
                         Destiny Tarot
                       </p>
                     </motion.div>
                  </div>

                  <motion.button 
                    onClick={() => setPhase(AppPhase.SELECT_TOPIC)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-14 py-4 bg-transparent overflow-hidden rounded-sm transition-all duration-500"
                  >
                    <div className="absolute inset-0 border border-amber-500/20 group-hover:border-amber-400/40 transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-black/20 backdrop-blur-sm"></div>
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-400/60"></div>
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-amber-400/60"></div>
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-amber-400/60"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-400/60"></div>

                    <span className="relative font-cinzel text-lg tracking-[0.4em] text-amber-50 group-hover:text-amber-200 transition-colors flex items-center gap-3 pl-3">
                      开启旅程 <ChevronRight className="opacity-70 group-hover:translate-x-1 transition-transform" size={16} />
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* TOPIC SELECTION */}
              {phase === AppPhase.SELECT_TOPIC && (
                <motion.div
                  key="topic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-6xl pb-10"
                >
                   <motion.h3 
                     initial={{ y: -20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="text-2xl md:text-4xl font-cinzel text-center mb-12 text-amber-50 drop-shadow-lg tracking-widest font-light"
                   >
                     心中的疑惑属于哪个领域？
                   </motion.h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-4 md:px-12">
                      {topics.map((topic, i) => (
                        <motion.button
                          key={topic.id}
                          onClick={() => handleTopicSelection(topic)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative h-[220px] bg-gradient-to-b from-[#1a1a2e]/80 to-[#0f0c16]/80 border-white/5 border hover:border-amber-500/30 rounded-lg p-6 text-left transition-all duration-500 overflow-hidden shadow-lg backdrop-blur-sm"
                        >
                          {/* Inner Glow */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/0 via-amber-900/0 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                          
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                               <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:border-amber-500/40 group-hover:bg-amber-500/5 transition-colors">
                                  {topic.id === 'private_custom' ? (
                                    <Edit3 className="text-amber-200" size={20} />
                                  ) : (
                                    <Compass className="text-indigo-200 group-hover:text-amber-200 transition-colors" size={20}/>
                                  )}
                               </div>
                               <Star size={12} className="text-white/10 group-hover:text-amber-500/40 transition-colors" />
                            </div>
                            
                            <div className="mt-auto">
                              <h4 className="text-2xl font-cinzel transition-colors mb-2 tracking-wide text-indigo-50 group-hover:text-amber-50">{topic.name}</h4>
                              <div className="w-8 h-px bg-white/10 group-hover:bg-amber-500/30 mb-3 transition-colors"></div>
                              <p className="font-cormorant text-base text-indigo-200/50 group-hover:text-indigo-100/80 transition-colors leading-relaxed tracking-wide">
                                {topic.description}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                   </div>
                </motion.div>
              )}

              {/* SPREAD SELECTION */}
              {phase === AppPhase.SELECT_SPREAD && (
                <motion.div
                  key="spread"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-5xl pb-10"
                >
                  <div className="text-center mb-12">
                     <div className="inline-block px-3 py-1 border border-amber-500/20 rounded-full bg-amber-900/10 backdrop-blur-md mb-3">
                       <span className="font-cinzel text-[10px] text-amber-200 tracking-[0.2em] uppercase">
                         主题: {selectedTopic?.name}
                       </span>
                     </div>
                     <h3 className="text-2xl md:text-4xl font-cinzel text-white tracking-widest font-light">选择牌阵</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                    {availableSpreads.map((spread, i) => (
                      <motion.button
                        key={spread.id}
                        onClick={() => startReading(spread.id)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02, borderColor: 'rgba(217, 119, 6, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="relative bg-[#0d0d14]/60 backdrop-blur-md border border-indigo-500/10 rounded-xl p-6 text-left transition-all group overflow-hidden shadow-lg flex items-center justify-between gap-6"
                      >
                         {/* Text Content */}
                        <div className="flex-1 min-w-0 z-10">
                            <div className="mb-3 text-indigo-300/70 group-hover:text-amber-300/70 transition-colors">
                              <Sparkles size={18} />
                            </div>
                            <h4 className="text-lg font-cinzel mb-2 text-indigo-50 group-hover:text-amber-50 tracking-wide truncate">{spread.name}</h4>
                            <p className="font-cormorant text-sm text-indigo-200/40 group-hover:text-indigo-200/70 leading-relaxed">{spread.description}</p>
                        </div>

                         {/* Dedicated Preview Area - Fully Visible */}
                         <div className="relative flex-none w-24 h-32 bg-white/5 rounded-md border border-white/10 shadow-inner group-hover:border-amber-500/20 transition-colors overflow-hidden">
                            {spread.positions.slice(0, 10).map(p => (
                                 <div 
                                    key={p.id} 
                                    // Make cards slightly rectangular (w-1.5 h-3) and apply rotation for visible crossing
                                    className="absolute w-1.5 h-3 bg-amber-100/50 rounded-[1px] shadow-[0_0_2px_rgba(251,191,36,0.3)] group-hover:bg-amber-400 group-hover:shadow-[0_0_5px_rgba(251,191,36,0.6)] transition-all origin-center" 
                                    style={{ 
                                        left: `${p.x}%`, 
                                        top: `${p.y}%`, 
                                        transform: `translate(-50%, -50%) rotate(${p.rotation || 0}deg)` 
                                    }}
                                 ></div>
                            ))}
                         </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* TABLE TOP */}
          <AnimatePresence>
            {(phase === AppPhase.SHUFFLE || phase === AppPhase.DRAW || phase === AppPhase.REVEAL || phase === AppPhase.READING) && selectedSpread && (
              <motion.div
                key="table"
                className="fixed inset-0 w-full h-full z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1 } }}
                exit={{ opacity: 0 }}
              >
                <TableTop 
                  phase={phase}
                  spread={selectedSpread}
                  topic={selectedTopic}
                  drawnCards={drawnCards}
                  onDrawCard={handleDrawCard}
                  onPhaseChange={setPhase}
                  onShowReading={() => setShowReadingModal(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CUSTOM TOPIC MODAL */}
        <AnimatePresence>
          {showCustomInput && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
             >
                <motion.div 
                   initial={{ scale: 0.95, y: 10, opacity: 0 }}
                   animate={{ scale: 1, y: 0, opacity: 1 }}
                   exit={{ scale: 0.95, y: 10, opacity: 0 }}
                   className="bg-[#0b0a10] w-full max-w-md rounded-xl border border-amber-500/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                   {/* Modal Header */}
                   <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 border-b border-white/5">
                      <h3 className="font-cinzel text-xl text-amber-50 tracking-wider flex items-center gap-2">
                         <Edit3 size={18} className="text-amber-400" />
                         私人定制
                      </h3>
                      <p className="text-xs text-indigo-200/50 mt-1 font-cormorant tracking-wider">
                         向宇宙提出你心中独一无二的问题
                      </p>
                   </div>
                   
                   <div className="p-6">
                      <div className="relative mb-6">
                         <textarea
                            value={customQuery}
                            onChange={(e) => setCustomQuery(e.target.value)}
                            placeholder="请在此输入你想占卜的具体问题..."
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-amber-50 placeholder-indigo-300/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none font-cormorant text-lg tracking-wide transition-all"
                            autoFocus
                         />
                         <Keyboard className="absolute bottom-3 right-3 text-white/10 pointer-events-none" size={16} />
                      </div>
                      
                      {/* Suggestions */}
                      <div className="mb-8">
                         <p className="text-xs text-indigo-300/40 uppercase tracking-widest mb-3 font-cinzel">灵感推荐</p>
                         <div className="flex flex-wrap gap-2">
                            {customSuggestions.map((suggestion, i) => (
                               <button 
                                  key={i}
                                  onClick={() => setCustomQuery(suggestion)}
                                  className="text-xs bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-indigo-200 hover:text-amber-100 px-3 py-1.5 rounded-full transition-all"
                               >
                                  {suggestion}
                               </button>
                            ))}
                         </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-3 justify-end">
                         <button 
                            onClick={() => setShowCustomInput(false)}
                            className="px-4 py-2 rounded text-indigo-400 hover:text-white hover:bg-white/5 text-xs font-cinzel tracking-widest"
                         >
                            取消
                         </button>
                         <button 
                            onClick={handleCustomSubmit}
                            disabled={!customQuery.trim()}
                            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-cinzel tracking-widest font-bold"
                         >
                            确认
                         </button>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* READING MODAL */}
        <AnimatePresence>
          {showReadingModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#0b0a10] w-full max-w-3xl max-h-[85vh] rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-[#2a2a35] flex flex-col relative overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>

                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-white/5 bg-[#0f0e16]/80 backdrop-blur-md relative z-10">
                   <div>
                       <h2 className="text-xl md:text-2xl font-cinzel text-amber-50 tracking-widest">命运启示</h2>
                       <div className="flex items-center gap-2 mt-1 opacity-60">
                         <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-indigo-300">{selectedTopic?.name}</span>
                         <span className="text-indigo-500">•</span>
                         <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-indigo-300">{selectedSpread?.name}</span>
                       </div>
                   </div>
                   <button 
                     onClick={() => setShowReadingModal(false)}
                     className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-indigo-400 hover:text-amber-200"
                   >
                     <X size={20} />
                   </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative z-10 bg-[#0b0a10]">
                   {isReadingLoading ? (
                     <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
                        <div className="relative w-16 h-16">
                           <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping"></div>
                           <div className="absolute inset-2 border border-amber-500/40 rounded-full animate-spin"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="text-amber-100/80" size={18} />
                           </div>
                        </div>
                        <p className="font-cinzel text-base text-indigo-200/80 tracking-[0.3em] animate-pulse">连接宇宙能量...</p>
                     </div>
                   ) : (
                     /* Capture Area */
                     <div ref={readingContentRef} className="p-2 bg-[#0b0a10]">
                        <div className="mb-6 border-b border-white/5 pb-4 md:hidden">
                            <h2 className="text-xl font-cinzel text-amber-50">命运启示</h2>
                        </div>
                        
                        <div className="font-cormorant text-lg md:text-xl leading-relaxed text-indigo-100/80 text-justify space-y-6 font-light">
                            {readingResult.split('\n').map((line, i) => {
                                // Headings
                                if (line.trim().startsWith('##')) {
                                    return (
                                        <div key={i} className="mt-10 mb-4">
                                            <h3 className="text-xl font-cinzel text-amber-100/90 inline-block border-b border-amber-500/10 pb-1 tracking-wider">
                                                {line.replace(/#/g, '')}
                                            </h3>
                                        </div>
                                    );
                                }
                                // Subheadings
                                if (line.trim().startsWith('###')) {
                                    return (
                                        <h4 key={i} className="text-lg font-cinzel text-indigo-300 mt-6 mb-2 flex items-center gap-2 tracking-wide">
                                            <span className="w-1 h-1 bg-amber-500/40 rounded-full"></span>
                                            {line.replace(/###/g, '')}
                                        </h4>
                                    );
                                }
                                // Bold
                                if (line.trim().startsWith('**')) {
                                    return <strong key={i} className="block mt-3 text-amber-50/90 font-medium tracking-wide">{line.replace(/\*\*/g, '')}</strong>;
                                }
                                // Lists
                                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                                    return (
                                        <li key={i} className="ml-4 mb-1.5 list-none relative pl-3 text-base">
                                            <span className="absolute left-[-0.5rem] top-2.5 w-0.5 h-0.5 bg-indigo-500/60 rounded-full"></span>
                                            {line.replace(/^[\*\-]\s/, '')}
                                        </li>
                                    );
                                }
                                // Breaks
                                if (line.trim() === '') return <br key={i}/>;
                                // Paragraphs
                                return <p key={i} className="mb-3">{line}</p>;
                            })}
                        </div>
                        
                        <div className="mt-12 pt-6 border-t border-white/5 text-center opacity-30">
                            <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase">命运占卜</p>
                        </div>
                     </div>
                   )}
                </div>
                
                {/* Footer */}
                {!isReadingLoading && (
                  <div className="p-4 md:px-8 md:py-5 border-t border-white/5 bg-[#0f0e16] flex flex-wrap justify-end gap-3 relative z-10">
                    <button 
                       onClick={handleDownload}
                       disabled={isDownloading}
                       className="px-4 py-2 rounded text-indigo-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all font-cinzel text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
                    >
                      {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                      保存 PDF
                    </button>
                    <button 
                       onClick={() => setShowReadingModal(false)}
                       className="px-4 py-2 rounded text-indigo-300 hover:text-white transition-colors hover:bg-white/5 font-cinzel text-[10px] tracking-[0.2em] uppercase"
                    >
                      关闭
                    </button>
                    <button 
                       onClick={resetApp}
                       className="px-6 py-2 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white rounded shadow-lg shadow-amber-900/10 transition-all font-cinzel font-medium text-xs tracking-[0.2em]"
                    >
                      新的占卜
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;