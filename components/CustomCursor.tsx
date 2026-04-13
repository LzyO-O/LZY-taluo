import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  // Use MotionValues for high-performance updates without re-renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics - TIGHTER & STRONGER
  // Higher stiffness = faster snap. Lower damping/mass ratio = reactive but stable.
  const springConfig = { damping: 25, stiffness: 450, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Global hover detection for pointer interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target or its parents are clickable
      const clickable = target.closest('button, a, input, textarea, [role="button"], .cursor-pointer');
      
      // Also check computed style as a fallback
      const computedStyle = window.getComputedStyle(target);
      
      if (clickable || computedStyle.cursor === 'pointer') {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block mix-blend-exclusion">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* 1. Main Core - The "Spark" */}
            <motion.div
              className="absolute top-0 left-0 flex items-center justify-center"
              style={{
                x: cursorX,
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
               {/* Diamond Shape */}
               <motion.div 
                 className="bg-amber-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                 animate={{
                   width: isClicking ? 4 : (isPointer ? 0 : 8), // Disappear or shrink logic
                   height: isClicking ? 4 : (isPointer ? 0 : 8),
                   rotate: 45, // Diamond orientation
                   opacity: isPointer ? 0 : 1
                 }}
                 transition={{ duration: 0.1 }}
               />
               
               {/* Crosshair (Only visible when hovering) */}
               <motion.div 
                 className="absolute w-4 h-4"
                 animate={{ opacity: isPointer ? 1 : 0, rotate: isClicking ? 90 : 0, scale: isClicking ? 0.8 : 1 }}
               >
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-amber-200"></div>
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-amber-200"></div>
               </motion.div>
            </motion.div>

            {/* 2. Outer Ring - The "Magical Seal" */}
            <motion.div
              className="absolute top-0 left-0 flex items-center justify-center"
              style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
               {/* Outer Circle */}
               <motion.div 
                 className="absolute border border-amber-100/40 rounded-full"
                 animate={{
                   width: isPointer ? 64 : 40,
                   height: isPointer ? 64 : 40,
                   scale: isClicking ? 0.8 : 1,
                   borderColor: isPointer ? 'rgba(251, 191, 36, 0.6)' : 'rgba(254, 243, 199, 0.4)',
                 }}
                 transition={{ duration: 0.2, ease: "easeOut" }}
               />

               {/* Inner Rotating Geometry (The Square/Diamond inside the Circle) */}
               <motion.div 
                 className="absolute border border-amber-100/20"
                 animate={{
                   width: isPointer ? 42 : 26,
                   height: isPointer ? 42 : 26,
                   scale: isClicking ? 0.5 : 1,
                   rotate: 360 // Continuous rotation
                 }}
                 transition={{ 
                   rotate: { duration: isPointer ? 4 : 10, repeat: Infinity, ease: "linear" }, // Spin faster on hover
                   width: { duration: 0.2 },
                   height: { duration: 0.2 }
                 }}
               />
               
               {/* Tiny Orbital Dots (Decorations) */}
               <motion.div 
                 className="absolute w-full h-full"
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 style={{ width: isPointer ? 70 : 46, height: isPointer ? 70 : 46 }}
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-200/50 rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-200/50 rounded-full"></div>
               </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;