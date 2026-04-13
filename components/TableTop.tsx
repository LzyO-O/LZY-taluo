import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { Spread, DrawnCard, TarotCard, AppPhase, Topic } from '../types';
import Card3D from './Card3D';
import { getDeck } from '../data/tarotCards';
import { Sparkles, Hand, MousePointer2, ZoomIn, ZoomOut, Maximize, ArrowRight, BookOpen, Move, Mouse, ArrowDown, Plus } from 'lucide-react';

interface TableTopProps {
  phase: AppPhase;
  spread: Spread;
  topic: Topic | null;
  drawnCards: DrawnCard[];
  onDrawCard: (card: TarotCard, isReversed: boolean) => void;
  onPhaseChange: (phase: AppPhase) => void;
  onShowReading?: () => void; // Callback to re-open reading modal
}

// Visual constants
const TOTAL_VISUAL_CARDS = 78;
const SHUFFLE_DURATION = 4000; 

// Fixed logical size for the spread board to ensure consistent layout
const BOARD_WIDTH = 1200;
const BOARD_HEIGHT = 1100;

// Deck Layout Constants
const DECK_ARC_INTENSITY = 0.05; 
const DECK_MAX_ROTATION = 6; 

// Helper to check distance to element center
const getDistanceToElement = (point: {x: number, y: number}, elementId: string) => {
  const el = document.getElementById(elementId);
  if (!el) return Infinity;
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2));
};

interface VisualCard {
  id: number;
  x: number; 
  y: number; 
  r: number; 
}

const TableTop: React.FC<TableTopProps> = ({ 
  phase, 
  spread, 
  topic,
  drawnCards, 
  onDrawCard, 
  onPhaseChange,
  onShowReading
}) => {
  const [logicalDeck, setLogicalDeck] = useState<TarotCard[]>([]);
  const [visualCards, setVisualCards] = useState<VisualCard[]>([]);
  
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [latestRevealedCard, setLatestRevealedCard] = useState<DrawnCard | null>(null);
  
  // Track HUD image errors to show fallback
  const [hudImgError, setHudImgError] = useState(false);

  // Hover state for slots to bring them to z-index front
  const [hoveredSlotId, setHoveredSlotId] = useState<number | null>(null);

  // Shuffle State
  const [shuffleState, setShuffleState] = useState<'SCATTER' | 'GATHER'>('SCATTER');
  const [canFinishShuffle, setCanFinishShuffle] = useState(false);

  // Helper to calculate best zoom to fit board
  const getFitZoom = (mode: 'FULL' | 'WITH_DECK' = 'FULL') => {
    if (typeof window === 'undefined') return 0.65;
    
    const padding = 40;
    const deckSpace = mode === 'WITH_DECK' ? 280 : 0;
    
    const availableW = window.innerWidth - padding;
    const availableH = window.innerHeight - padding - deckSpace;
    
    const scaleW = availableW / BOARD_WIDTH;
    const scaleH = availableH / BOARD_HEIGHT;
    
    // Clamp zoom
    return Math.min(Math.max(Math.min(scaleW, scaleH), 0.35), 1.1);
  };

  // Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState(0.65); 
  const boardX = useMotionValue(0);
  const boardY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Global mouse tracking for physics
  const mouseX = useMotionValue(9999);
  const mouseY = useMotionValue(9999);

  // Hover state for precise card selection in deck
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  
  // Track if user is currently dragging a card from the deck
  const [isDragging, setIsDragging] = useState(false);
  
  // Dynamic Spacing to fit screen
  const [deckSpacing, setDeckSpacing] = useState(16);

  // Initialize
  useEffect(() => {
    const d = getDeck();
    setLogicalDeck(d);
    
    // Initial chaotic pile
    const cards: VisualCard[] = Array.from({ length: TOTAL_VISUAL_CARDS }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * window.innerWidth * 0.4, 
      y: (Math.random() - 0.5) * window.innerHeight * 0.4, 
      r: Math.random() * 360
    }));
    setVisualCards(cards);
  }, []);

  // Reset HUD error when card changes
  useEffect(() => {
    setHudImgError(false);
  }, [latestRevealedCard]);

  // Set initial zoom on mount
  useEffect(() => {
    setZoomLevel(getFitZoom('WITH_DECK'));
  }, []);

  // Adjust zoom and show guide on Draw phase entry
  useEffect(() => {
    if (phase === AppPhase.DRAW) {
        // Auto-fit the board so user can see all slots + deck
        const fit = getFitZoom('WITH_DECK');
        animate(boardX, 0);
        animate(boardY, -100); // Shift up slightly to make room for deck
        setZoomLevel(fit);

        setShowGuide(true);
        const timer = setTimeout(() => setShowGuide(false), 4000);
        return () => clearTimeout(timer);
    } else if (phase === AppPhase.REVEAL) {
        // Auto-fit full board
        const fit = getFitZoom('FULL');
        animate(boardX, 0);
        animate(boardY, 0);
        setZoomLevel(fit);
    }
  }, [phase]);

  // Responsive Deck Spacing
  useEffect(() => {
    const handleResize = () => {
       const cardWidth = 80; 
       const padding = 40; 
       const availableWidth = Math.min(window.innerWidth, 1400) - padding;
       const maxSpacing = 24; 
       const calculated = (availableWidth - cardWidth) / (TOTAL_VISUAL_CARDS - 1);
       setDeckSpacing(Math.min(maxSpacing, Math.max(5, calculated)));
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Listener for Shuffle Physics
  useEffect(() => {
    if (phase !== AppPhase.SHUFFLE) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [phase]);

  // Wheel Zoom Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001; 
      setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.4), 2.5));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Shuffle Phase Management
  useEffect(() => {
    if (phase === AppPhase.SHUFFLE) {
      setShuffleState('SCATTER');
      setCanFinishShuffle(false);
      const timer = setTimeout(() => {
        setCanFinishShuffle(true);
      }, SHUFFLE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Active Slot Management for Draw Phase
  useEffect(() => {
    if (phase === AppPhase.DRAW) {
      const nextSlot = spread.positions.find(p => !drawnCards.some(dc => dc.positionId === p.id));
      if (nextSlot) {
        setActiveSlotId(nextSlot.id);
      } else {
        setActiveSlotId(null);
        setTimeout(() => onPhaseChange(AppPhase.REVEAL), 800);
      }
    }
  }, [drawnCards, phase, spread, onPhaseChange]);

  const startGather = () => {
    setShuffleState('GATHER');
    setTimeout(() => {
      // Perform Logical Shuffle
      const d = [...logicalDeck];
      for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
      }
      setLogicalDeck(d);
      
      // Reset view happens in useEffect[phase]
      onPhaseChange(AppPhase.DRAW);
    }, 1200); 
  };

  const handleDragEnd = (visualId: number, info: any) => {
    setIsDragging(false); 
    if (phase !== AppPhase.DRAW || !activeSlotId) return;

    const targetSlotId = `spread-slot-${activeSlotId}`;
    const dist = getDistanceToElement(info.point, targetSlotId);
    
    if (dist < 200) { 
      const visualIndex = visualCards.findIndex(c => c.id === visualId);
      
      setVisualCards(prev => prev.filter(c => c.id !== visualId));
      setHoveredCardId(null); 
      
      const availableLogicalCards = logicalDeck.filter(lc => !drawnCards.some(dc => dc.card.id === lc.id));
      const pickIndex = visualIndex >= 0 ? visualIndex % availableLogicalCards.length : 0;
      const pickedCard = availableLogicalCards[pickIndex];

      const isReversed = Math.random() > 0.8; 
      
      onDrawCard(pickedCard, isReversed);
    }
  };

  const handleRevealClick = (positionId: number) => {
    if (phase !== AppPhase.REVEAL) return;
    if (!revealedCards.includes(positionId)) {
      setRevealedCards(prev => [...prev, positionId]);
      
      // Set the latest revealed card for the top HUD
      const drawn = drawnCards.find(d => d.positionId === positionId);
      if (drawn) {
        setLatestRevealedCard(drawn);
        // Auto hide after 5 seconds
        setTimeout(() => {
           setLatestRevealedCard(prev => prev === drawn ? null : prev);
        }, 5000);
      }
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.4, Math.min(2.5, prev + delta)));
  };

  const handleResetView = () => {
    setZoomLevel(getFitZoom(phase === AppPhase.DRAW ? 'WITH_DECK' : 'FULL')); 
    animate(boardX, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(boardY, phase === AppPhase.DRAW ? -100 : 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleDeckMouseMove = (e: React.PointerEvent) => {
     if (phase !== AppPhase.DRAW) return;
     if (isDragging) return; 
     
     const target = document.elementFromPoint(e.clientX, e.clientY);
     const cardEl = target?.closest('[data-card-id]');
     
     if (cardEl) {
        const id = Number(cardEl.getAttribute('data-card-id'));
        setHoveredCardId(id);
     } else {
        setHoveredCardId(null);
     }
  };

  const allRevealed = spread.positions.length > 0 && revealedCards.length === spread.positions.length;
  const nextRevealId = spread.positions.find(p => !revealedCards.includes(p.id))?.id;
  const showActionBtn = (phase === AppPhase.REVEAL && allRevealed) || phase === AppPhase.READING;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
      
      {/* HUD Notification for Latest Revealed Card */}
      <AnimatePresence>
         {latestRevealedCard && (
            <motion.div 
               initial={{ opacity: 0, y: -50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -50 }}
               className="fixed top-12 left-0 right-0 z-[500] flex justify-center pointer-events-none"
            >
               <div className="bg-black/80 backdrop-blur-xl px-8 py-3 rounded-full border border-amber-500/30 flex items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  <div className="w-10 h-10 rounded overflow-hidden border border-white/10 shrink-0 bg-black/40">
                     {!hudImgError ? (
                        <img 
                          src={latestRevealedCard.card.image} 
                          alt={latestRevealedCard.card.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                              // Fallback strategy: try GitHub mirror if Sacred Texts (default) fails
                              const target = e.currentTarget;
                              const currentSrc = target.src;
                              if (!currentSrc.includes('mirror.ghproxy')) {
                                  const filename = latestRevealedCard.card.image.split('/').pop();
                                  target.src = `https://mirror.ghproxy.com/https://raw.githubusercontent.com/t7yang/tarot-api/main/static/images/cards/${filename}`;
                              } else {
                                  // Both failed, show placeholder
                                  setHudImgError(true);
                              }
                          }}
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-900/40">
                           <span className="text-amber-200 text-xs font-cinzel">?</span>
                        </div>
                     )}
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] text-amber-500/80 font-cinzel tracking-widest uppercase mb-0.5">
                        {spread.positions.find(p => p.id === latestRevealedCard.positionId)?.name}
                     </span>
                     <div className="flex items-center gap-2">
                         <span className="text-lg font-cinzel font-bold text-amber-50 tracking-wide">
                            {latestRevealedCard.card.name}
                         </span>
                         <span className={`text-[10px] px-1.5 py-0.5 rounded border ${latestRevealedCard.isReversed ? 'border-red-500/50 text-red-400' : 'border-emerald-500/50 text-emerald-400'}`}>
                            {latestRevealedCard.isReversed ? '逆' : '正'}
                         </span>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Visual Guide Overlay */}
      <AnimatePresence>
         {showGuide && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="absolute top-32 z-[400] flex gap-4 pointer-events-none"
             >
                <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-amber-500/30 flex items-center gap-3 text-amber-50 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                   <div className="flex flex-col items-center gap-1">
                      <Move size={20} className="text-amber-200" />
                   </div>
                   <div className="h-8 w-px bg-white/10"></div>
                   <div className="flex flex-col">
                      <span className="text-sm font-cinzel font-bold tracking-wide">拖拽画布</span>
                      <span className="text-[10px] text-indigo-200/70">平移视角</span>
                   </div>
                </div>
                
                <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-amber-500/30 flex items-center gap-3 text-amber-50 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                   <div className="flex flex-col items-center gap-1">
                      <div className="relative">
                          {/* Mouse Icon with animated scroll wheel indication */}
                          <Mouse size={20} className="text-amber-200" />
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                      </div>
                   </div>
                   <div className="h-8 w-px bg-white/10"></div>
                   <div className="flex flex-col">
                      <span className="text-sm font-cinzel font-bold tracking-wide">滚轮缩放</span>
                      <span className="text-[10px] text-indigo-200/70">调整远近</span>
                   </div>
                </div>
             </motion.div>
         )}
      </AnimatePresence>

      {/* Zoom Controls - MOVED TO TOP RIGHT & HIGHER Z-INDEX */}
      {phase !== AppPhase.SHUFFLE && (
         <div className="fixed right-6 top-24 z-[300] flex flex-col gap-2 pointer-events-auto">
            <button onClick={() => handleZoom(0.1)} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-amber-100/70 border border-amber-500/10 hover:bg-amber-900/30 transition-all shadow-lg active:scale-95">
               <ZoomIn size={18} />
            </button>
            <button onClick={handleResetView} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-amber-100/70 border border-amber-500/10 hover:bg-amber-900/30 transition-all shadow-lg active:scale-95" title="复位">
               <Maximize size={18} />
            </button>
            <button onClick={() => handleZoom(-0.1)} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-amber-100/70 border border-amber-500/10 hover:bg-amber-900/30 transition-all shadow-lg active:scale-95">
               <ZoomOut size={18} />
            </button>
         </div>
      )}

      {/* SHUFFLE PHASE */}
      <AnimatePresence>
        {phase === AppPhase.SHUFFLE && (
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
             {/* Top Prompt */}
             <div className="absolute top-[15%] inset-x-0 flex flex-col items-center justify-start pb-8 z-50 pointer-events-auto">
               <div className="text-center w-full max-w-md px-6">
                 <h2 className="text-3xl md:text-5xl font-cinzel text-amber-50 drop-shadow-[0_0_20px_rgba(217,119,6,0.4)] mb-2 animate-pulse tracking-widest">
                   {shuffleState === 'GATHER' ? "命运聚合" : "混沌洗牌"}
                 </h2>
                 <p className="text-indigo-200/50 font-cormorant text-base mb-6 tracking-[0.2em] italic font-light">
                   {canFinishShuffle ? "能量已就绪，准备开启占卜" : "请移动鼠标或手指，搅动命运的轨迹..."}
                 </p>
                 
                 <div className="flex flex-col items-center justify-center gap-4 h-12">
                   {!canFinishShuffle && shuffleState === 'SCATTER' && (
                      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: SHUFFLE_DURATION / 1000, ease: "linear" }}
                        />
                      </div>
                   )}

                   {canFinishShuffle && shuffleState === 'SCATTER' && (
                     <motion.button 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGather}
                        className="px-8 py-2.5 rounded-full font-cinzel font-bold text-xs tracking-[0.3em] uppercase shadow-xl border backdrop-blur-xl transition-all relative z-50 bg-indigo-600/80 hover:bg-indigo-500 text-white border-indigo-300/30"
                     >
                       完成洗牌
                     </motion.button>
                   )}
                 </div>
               </div>
            </div>

            {visualCards.map((c) => (
              <PhysicsCard 
                key={c.id} 
                initialData={c} 
                mouseX={mouseX} 
                mouseY={mouseY} 
                state={shuffleState}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPREAD AREA - HIDDEN DURING SHUFFLE */}
      {phase !== AppPhase.SHUFFLE && (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-10 pointer-events-auto">
              
              {/* Draggable & Scalable Board */}
              <motion.div 
                 className="relative cursor-grab active:cursor-grabbing"
                 style={{ 
                   width: BOARD_WIDTH, 
                   height: BOARD_HEIGHT,
                   x: boardX,
                   y: boardY,
                   touchAction: "none"
                 }}
                 animate={{ scale: zoomLevel }}
                 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                 drag
                 dragMomentum={false} 
              >
                 {/* Board Background/Guide */}
                 <div className="absolute inset-0 border border-dashed border-white/5 rounded-[3rem] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none"></div>
                 
                 {/* Center Symbol */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                    <div className="w-96 h-96 border border-amber-500/50 rounded-full flex items-center justify-center">
                      <div className="w-64 h-64 border border-indigo-500/50 rotate-45"></div>
                    </div>
                 </div>

                 {spread.positions.map((pos) => {
                   const drawn = drawnCards.find(d => d.positionId === pos.id);
                   const isRevealed = revealedCards.includes(pos.id);
                   const isActiveTarget = phase === AppPhase.DRAW && activeSlotId === pos.id;
                   const isNextToReveal = nextRevealId === pos.id;
                   const isSlotHovered = hoveredSlotId === pos.id;
                   const isCelticCrossPos2 = spread.id === 'celtic-cross' && pos.id === 2;

                   // Logic to handle overlaps and Z-Index
                   let zIndex = 1;
                   if (drawn) {
                      if (isSlotHovered) {
                          zIndex = 300; 
                      } else if (isNextToReveal && phase === AppPhase.REVEAL) {
                          zIndex = 100;
                      } else {
                          zIndex = 20 + pos.id;
                      }
                   } else {
                      if (isActiveTarget) {
                          zIndex = 50; 
                      }
                   }

                   return (
                     <div
                       id={`spread-slot-${pos.id}`}
                       key={pos.id}
                       className="absolute w-[90px] h-[150px] md:w-[110px] md:h-[190px] transition-all duration-500"
                       style={{
                         left: `${pos.x}%`, 
                         top: `${pos.y}%`,
                         transform: `translate(-50%, -50%)`,
                         zIndex: zIndex
                       }}
                       onMouseEnter={() => setHoveredSlotId(pos.id)}
                       onMouseLeave={() => setHoveredSlotId(null)}
                     >
                       {/* Slot Target UI */}
                       <AnimatePresence>
                         {!drawn && (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className={`
                               w-full h-full
                               flex flex-col items-center justify-center transition-all duration-500
                               rounded-lg 
                               ${isActiveTarget 
                                 ? 'border-amber-400 border-[3px] bg-amber-900/40 shadow-[0_0_60px_rgba(251,191,36,0.7)] scale-110 ring-4 ring-amber-500/20' 
                                 : 'border-white/30 bg-white/10 border-[2px] border-solid shadow-[0_0_15px_rgba(255,255,255,0.05)]'}
                             `}
                             style={{
                               transform: pos.rotation ? `rotate(${pos.rotation}deg)` : 'none',
                             }}
                           >
                             {/* Always show a faint plus sign for empty slots to make them obvious */}
                             {!isActiveTarget && (
                                <Plus className="text-white/20" size={24} />
                             )}
                             
                             {isActiveTarget && (
                               <>
                                 {/* Ripple Effect */}
                                 <motion.div
                                    className="absolute inset-0 rounded-lg border-2 border-amber-400 opacity-0"
                                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                 />
                                 
                                 {/* Bouncing Arrow and Text */}
                                 <motion.div 
                                   initial={{ y: -60, opacity: 0 }}
                                   animate={{ y: -30, opacity: 1 }}
                                   transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6, ease: "easeInOut" }}
                                   className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none"
                                 >
                                   <div className="text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,1)] mb-2">
                                      <ArrowDown size={48} strokeWidth={4} />
                                   </div>
                                   <div className="bg-amber-500 text-black font-cinzel font-bold text-sm tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] whitespace-nowrap border-2 border-amber-200">
                                      请拖拽至此
                                   </div>
                                 </motion.div>
                               </>
                             )}
                             
                             <div className="absolute bottom-2 left-0 w-full text-center z-10 opacity-60">
                               <span className={`block font-cinzel text-xl font-bold ${isActiveTarget ? 'text-amber-100' : 'text-slate-400'}`}>{pos.id}</span>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>

                       {/* Drawn Card in Slot */}
                       {drawn && (
                          <div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                            <motion.div
                              initial={{ opacity: 0, scale: 2, z: 200, y: -100 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                z: 0, 
                                y: 0,
                                rotate: pos.rotation || 0,
                                // Physical lift for Celtic Cross Pos 2 to avoid Z-fighting/overlapping
                                zIndex: isCelticCrossPos2 ? 25 : 0
                              }}
                              style={{ 
                                transformOrigin: 'center center',
                                perspective: '1000px',
                                // IMPORTANT: Use translateZ to physically separate the card
                                transform: isCelticCrossPos2 ? 'translateZ(50px)' : 'none'
                              }}
                              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                              className="w-full h-full"
                            >
                              <Card3D
                                card={drawn.card}
                                isFlipped={isRevealed}
                                isReversed={drawn.isReversed}
                                width="100%"
                                height="100%"
                                onClick={() => handleRevealClick(pos.id)}
                                className={`w-full h-full ${isRevealed ? '' : 'cursor-pointer'} ${pos.rotation ? 'shadow-[0_25px_50px_rgba(0,0,0,0.9)] ring-1 ring-black/40' : 'shadow-2xl'}`}
                                hoverEffect={phase === AppPhase.REVEAL && !isRevealed}
                              />
                            </motion.div>
                            
                            {/* Reveal Hint */}
                            {phase === AppPhase.REVEAL && !isRevealed && isNextToReveal && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                                  style={{ transform: 'translateZ(60px)' }}
                                >
                                   <div className="flex flex-col items-center gap-2">
                                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-amber-200/40 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                          <Hand className="text-amber-100/90 drop-shadow-lg" size={24} />
                                      </div>
                                      <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded text-amber-200 text-xs font-cinzel tracking-wider animate-bounce border border-amber-500/20">
                                          点击翻牌
                                      </div>
                                   </div>
                                </motion.div>
                             )}
                             
                             {/* Card Name Tag - Improved visibility */}
                             {isRevealed && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ delay: 0.2 }}
                                 className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-[200] pointer-events-none ${pos.rotation ? '-bottom-10' : '-bottom-16'}`}
                                 style={{ transform: 'translateZ(60px)' }}
                               >
                                 <div className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-lg border border-amber-500/30 shadow-2xl text-center flex flex-col items-center">
                                   <p className="text-amber-50 text-sm font-cinzel font-bold tracking-wide">
                                     {drawn.card.name} 
                                   </p>
                                   <span className={`text-[9px] uppercase tracking-[0.2em] mt-0.5 px-1 rounded ${drawn.isReversed ? 'bg-red-900/40 text-red-200 border border-red-500/20' : 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/20'}`}>
                                      {drawn.isReversed ? '逆位' : '正位'}
                                   </span>
                                 </div>
                               </motion.div>
                             )}
                          </div>
                       )}
                     </div>
                   );
                 })}
              </motion.div>
        </div>
      )}
      
      {/* INTERPRETATION ACTION BUTTON - FIXED POSITION */}
      <AnimatePresence>
        {showActionBtn && (
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 50 }}
             className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
             <motion.button 
               onClick={() => {
                 if (phase === AppPhase.READING) {
                   onShowReading?.();
                 } else {
                   onPhaseChange(AppPhase.READING);
                 }
               }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="group relative px-10 py-4 overflow-hidden rounded-full shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-all"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-indigo-900 border border-amber-500/40 rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                   {phase === AppPhase.READING ? (
                     <BookOpen className="text-amber-200" size={20} />
                   ) : (
                     <Sparkles className="text-amber-200 animate-pulse" size={20} />
                   )}
                   <span className="font-cinzel text-lg font-bold text-amber-50 tracking-[0.3em] uppercase">
                     {phase === AppPhase.READING ? "查看解读" : "解读牌阵"}
                   </span>
                   <ArrowRight className="text-amber-200/70 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
             </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAW PHASE: Gentle Arc Deck */}
      <AnimatePresence>
        {phase === AppPhase.DRAW && (
          <motion.div 
            // Z-INDEX FIX: z-[200] ensures dragging cards appear ABOVE the spread board
            className="absolute inset-0 w-full h-full z-[200] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: {duration: 0.5} }}
          >
             {/* Guide Text */}
            <div className="absolute top-[25%] left-0 w-full text-center z-50 pointer-events-none">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex flex-col items-center gap-3"
                 >
                   <div className="bg-black/50 backdrop-blur-lg border border-amber-500/20 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                     <MousePointer2 className="text-amber-200/80 animate-bounce" size={16} />
                     <span className="text-amber-50 text-lg font-cinzel tracking-widest font-light">请心中默想预测主题并凭借直觉选择一张牌拖拽到指定位置</span>
                   </div>
                   
                   <div className="text-amber-200/60 text-xs tracking-[0.2em] font-cinzel border border-amber-500/10 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                      当前主题：{topic?.name || '综合运势'}
                   </div>
                 </motion.div>
            </div>

            {/* Arc Deck Container */}
            <div 
                // FIX: Removed overflow-hidden to allow edge cards to show
                className="absolute bottom-0 left-0 w-full h-[250px] flex justify-center items-end pointer-events-auto cursor-pointer"
                onPointerMove={handleDeckMouseMove}
                onPointerLeave={() => { if (!isDragging) setHoveredCardId(null) }}
            >
               {/* Fixed width container to determine mouse relative pos */}
               <div className="relative w-full max-w-[1400px] h-full mx-auto">
                 {visualCards.map((c, i) => {
                   const total = visualCards.length;
                   const isHovered = hoveredCardId === c.id;
                   
                   // New Gentle Arc Logic
                   const centerIndex = (total - 1) / 2;
                   const distanceFromCenter = i - centerIndex;
                   
                   // Much flatter arc
                   const rotationStep = (DECK_MAX_ROTATION * 2) / total;
                   const rot = distanceFromCenter * rotationStep;
                   
                   // Gentle y curve
                   const yOffset = Math.abs(distanceFromCenter) * Math.abs(distanceFromCenter) * DECK_ARC_INTENSITY;

                   // Use dynamic spacing
                   const xOffset = distanceFromCenter * deckSpacing;

                   return (
                     <motion.div
                       key={`deck-${c.id}`}
                       // Add data attribute for precise selection
                       data-card-id={c.id}
                       className="absolute bottom-0 left-1/2"
                       style={{
                          marginLeft: -40, // Half card width
                          marginBottom: 20, // Lower base lift
                          // FIX: Remove z-index boost on hover to keep stack order
                          zIndex: i, 
                          transformOrigin: '50% 150%' 
                       }}
                       initial={{ y: 500, opacity: 0 }}
                       animate={{ 
                         x: xOffset,
                         // Only rise within stack, do not pop out
                         y: isHovered ? yOffset - 30 : yOffset, 
                         rotate: isHovered ? 0 : rot, 
                         scale: isHovered ? 1.05 : 1, // Subtle scale
                         opacity: 1
                       }}
                       transition={{ 
                         type: "spring",
                         stiffness: 400,
                         damping: 30
                       }}
                     >
                       <Card3D 
                          width={80} 
                          height={135} 
                          isFlipped={false} 
                          // Highlight style locked if isDragging is true (because hoveredCardId is locked)
                          className={`shadow-lg border ${isHovered ? 'border-amber-400 ring-1 ring-amber-500/50' : 'border-amber-900/30'}`}
                          hoverEffect={false} 
                          drag={true}
                          // FIX: Lock interactions immediately on touch/click
                          onPointerDown={(e) => {
                             setIsDragging(true);
                             setHoveredCardId(c.id);
                          }}
                          onPointerUp={() => setIsDragging(false)}
                          onDragStart={() => setIsDragging(true)} // Keep just in case
                          onDragEnd={(e, info) => handleDragEnd(c.id, info)}
                       />
                     </motion.div>
                   );
                 })}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Physics-based Shuffle Card ---
const PhysicsCard: React.FC<{ 
  initialData: VisualCard;
  mouseX: any; 
  mouseY: any; 
  state: 'SCATTER' | 'GATHER'; 
}> = ({ initialData, mouseX, mouseY, state }) => {
  
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(initialData.x);
  const y = useMotionValue(initialData.y);
  const r = useMotionValue(initialData.r);
  
  const vx = useRef(0);
  const vy = useRef(0);
  const vr = useRef(0);

  const massFactor = useRef(0.8 + Math.random() * 0.7); 
  const reactivityFactor = useRef(0.7 + Math.random() * 0.8);

  useAnimationFrame((time, delta) => {
    if (state === 'GATHER') return;

    const mx = mouseX.get();
    const my = mouseY.get();
    
    const cx = x.get();
    const cy = y.get();
    
    const dx = cx - mx;
    const dy = cy - my;
    const distSq = dx*dx + dy*dy;
    
    const maxDist = 300; 
    
    if (distSq < maxDist * maxDist) {
      const dist = Math.sqrt(distSq);
      const force = (maxDist - dist) / maxDist; 
      
      const noiseX = Math.sin(time * 0.01 + initialData.id) * 0.5;
      const noiseY = Math.cos(time * 0.01 + initialData.id) * 0.5;

      const pushFactor = 1.2; 
      const effectiveForce = (force * pushFactor * reactivityFactor.current) / massFactor.current;

      vx.current += (dx / dist) * effectiveForce + noiseX;
      vy.current += (dy / dist) * effectiveForce + noiseY;
      
      vr.current += (force * 2.0 * (initialData.id % 2 === 0 ? 1 : -1)) / massFactor.current;
    }
    
    const friction = 0.92; 
    vx.current *= friction;
    vy.current *= friction;
    vr.current *= friction;
    
    x.set(cx + vx.current);
    y.set(cy + vy.current);
    r.set(r.get() + vr.current);
    
    // Bounds check
    const boundX = window.innerWidth * 0.45; 
    const boundY = window.innerHeight * 0.45; 
    
    if (x.get() > boundX) { x.set(boundX); vx.current *= -0.6; }
    if (x.get() < -boundX) { x.set(-boundX); vx.current *= -0.6; }
    if (y.get() > boundY) { y.set(boundY); vy.current *= -0.6; }
    if (y.get() < -boundY) { y.set(-boundY); vy.current *= -0.6; }
  });

  return (
    <motion.div
      ref={cardRef}
      className="absolute left-1/2 top-1/2 w-32 h-52 will-change-transform"
      style={{ x, y, rotate: r }}
      animate={state === 'GATHER' 
        ? { 
            x: 0, 
            y: 0, 
            rotate: 0,
            scale: 0.1, 
            opacity: 0,
            transition: { duration: 0.8, ease: "backIn" }
          } 
        : { scale: 0.85, opacity: 1 }
      }
    >
      <Card3D 
        isFlipped={false} 
        width="100%" 
        height="100%" 
        className="shadow-2xl" 
        hoverEffect={false}
      />
    </motion.div>
  );
};

export default TableTop;