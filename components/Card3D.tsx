import React, { forwardRef, useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { TarotCard } from '../types';

interface Card3DProps {
  card?: TarotCard;
  isFlipped: boolean;
  isReversed?: boolean;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragStart?: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  layoutId?: string;
  style?: React.CSSProperties;
  className?: string;
  drag?: boolean | "x" | "y";
  dragConstraints?: React.RefObject<Element>;
  hoverEffect?: boolean;
}

const Card3D = forwardRef<HTMLDivElement, Card3DProps>(({ 
  card, 
  isFlipped, 
  isReversed = false, 
  width = 150, 
  height = 260, 
  onClick,
  onDragEnd,
  onDragStart,
  onPointerDown,
  onPointerUp,
  layoutId,
  style,
  className,
  drag = false,
  dragConstraints,
  hoverEffect = true
}, ref) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(card?.image);

  // Update internal state when card prop changes
  useEffect(() => {
    setImgSrc(card?.image);
    setImgError(false);
    setImgLoaded(false); // Reset load state on card change
  }, [card?.image]);

  const handleError = () => {
    if (!imgSrc) return;
    
    // Fallback Logic
    // If CDN fails, fall back to GitHub Mirror
    if (!imgSrc.includes('mirror.ghproxy')) {
      const filename = imgSrc.split('/').pop();
      if (filename) {
         console.warn(`Primary image failed for ${card?.name}, switching to fallback mirror.`);
         setImgSrc(`https://mirror.ghproxy.com/https://raw.githubusercontent.com/t7yang/tarot-api/main/static/images/cards/${filename}`);
         return;
      }
    }
    
    // If fallback also fails, show error state
    setImgError(true);
  };

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      className={`relative cursor-pointer perspective-1000 group ${className}`}
      style={{ width, height, transformStyle: "preserve-3d", ...style }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      drag={drag}
      dragSnapToOrigin={true}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={false}
      animate={{ 
        rotateY: isFlipped ? 180 : 0,
        rotateZ: isReversed ? 180 : 0,
        transition: { 
          duration: 0.8, 
          ease: [0.34, 1.56, 0.64, 1] 
        }
      }}
      whileHover={hoverEffect ? { scale: 1.05, y: -10, zIndex: 100 } : undefined}
      whileTap={hoverEffect ? { scale: 0.98, cursor: "grabbing" } : undefined}
      whileDrag={{ scale: 1.05, zIndex: 1000, cursor: "grabbing" }}
    >
      {/* Container for 3D flip */}
      <div 
        className="w-full h-full relative transform-style-3d transition-transform duration-700 rounded-lg"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* SHADOW - detached for 3D feel */}
        <div className="absolute top-3 left-0 w-full h-full bg-black/60 blur-sm rounded-lg -z-10 transition-opacity duration-300 opacity-50 group-hover:opacity-70 group-hover:translate-y-1"></div>

        {/* Front (Card Back) - Premium Cosmic Design */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-[#0a0a12] border border-white/10"
          style={{ 
            backfaceVisibility: 'hidden',
          }}
        >
           {/* Base Gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0c16]"></div>
           
           {/* Geometric Pattern */}
           <div className="absolute inset-[3px] border border-amber-500/20 opacity-30 rounded-[4px]"></div>
           <div className="absolute inset-[6px] border border-amber-500/10 opacity-20 rounded-[2px]"></div>
           
           {/* Stars Texture */}
           <div className="absolute inset-0 opacity-40" 
                style={{
                  backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }} 
           />

           {/* Center Emblem */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
              <div className="absolute inset-0 bg-amber-500/10 rotate-45 rounded-sm backdrop-blur-sm border border-amber-500/20"></div>
              <div className="absolute inset-1.5 bg-indigo-500/10 rotate-45 rounded-sm border border-indigo-500/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-amber-100 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>
              </div>
           </div>
           
           {/* Moving Sheen Effect on Hover */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
        </div>

        {/* Back (Card Face Image) */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-lg bg-[#f0e6d2] overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            boxShadow: 'inset 0 0 0 1px #8b7355' 
          }}
        >
          {card ? (
            <div className="w-full h-full relative flex items-center justify-center p-[4%]">
               <div className="w-full h-full relative overflow-hidden border border-black/80 rounded-[1px] bg-[#2a2a2a]">
                 
                 {/* Loading Placeholder / Skeleton */}
                 <div 
                   className={`absolute inset-0 flex items-center justify-center bg-[#1a1a1a] transition-opacity duration-500 z-10 ${imgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                 >
                    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                 </div>

                 {!imgError && imgSrc ? (
                   <motion.img 
                    src={imgSrc} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    onError={handleError}
                    onLoad={() => setImgLoaded(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imgLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a] text-center p-2">
                      <span className="text-amber-500/50 text-2xl font-cinzel mb-2">?</span>
                      <span className="text-amber-100/70 text-[10px] font-cinzel leading-tight">{card.name}</span>
                   </div>
                 )}
               </div>
               
               {/* Paper Texture Overlay */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 mix-blend-multiply pointer-events-none z-20"></div>
               
               {/* Inner Shadow for depth */}
               <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(50,30,10,0.15)] pointer-events-none z-20"></div>
            </div>
          ) : (
             <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">?</div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default Card3D;