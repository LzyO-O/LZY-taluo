import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#05040a] overflow-hidden">
      {/* Deep Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80 pointer-events-none z-[1]"></div>

      {/* Nebulas - Slower, deeper colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-950/30 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[20s]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-950/20 blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[25s]"></div>
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-amber-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[18s]"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 opacity-60" 
           style={{
             backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
           }}>
      </div>
      
      {/* Subtle Dust Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
};

export default Background;