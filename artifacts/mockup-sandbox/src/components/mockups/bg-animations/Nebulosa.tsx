import React, { useEffect, useRef } from 'react';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;500;600&display=swap');
  
  @keyframes gradientText {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .text-gradient {
    background-size: 200% auto;
    animation: gradientText 8s ease infinite;
  }
`;

type BlobState = {
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  r: number;
};

const Nebulosa: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Set initial mouse position to center
    mouseRef.current.x = window.innerWidth / 2;
    mouseRef.current.y = window.innerHeight / 2;

    let animationFrameId: number;
    let time = 0;
    
    // Setup blobs state
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    
    const blobsState: BlobState[] = [
      { currentX: ww * 0.3, currentY: wh * 0.3, vx: 0, vy: 0, phaseX: 0, phaseY: 1, speedX: 1.1, speedY: 1.3, r: 600 },
      { currentX: ww * 0.7, currentY: wh * 0.7, vx: 0, vy: 0, phaseX: 2, phaseY: 3, speedX: 1.5, speedY: 1.0, r: 700 },
      { currentX: ww * 0.5, currentY: wh * 0.5, vx: 0, vy: 0, phaseX: 4, phaseY: 0, speedX: 1.2, speedY: 1.6, r: 800 },
      { currentX: ww * 0.8, currentY: wh * 0.2, vx: 0, vy: 0, phaseX: 1, phaseY: 5, speedX: 1.8, speedY: 1.1, r: 500 },
      { currentX: ww * 0.2, currentY: wh * 0.8, vx: 0, vy: 0, phaseX: 5, phaseY: 2, speedX: 1.1, speedY: 1.4, r: 650 },
    ];

    let lastMouse = { x: mouseRef.current.x, y: mouseRef.current.y };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const update = () => {
      time += 16;
      
      const dxMouse = mouseRef.current.x - lastMouse.x;
      const dyMouse = mouseRef.current.y - lastMouse.y;
      lastMouse.x = mouseRef.current.x;
      lastMouse.y = mouseRef.current.y;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const timeBase = time * 0.0003;

      blobsState.forEach((state, i) => {
        const el = blobsRef.current[i];
        if (!el) return;

        // Base autonomous movement using sine
        const autoX = (Math.sin(timeBase * state.speedX + state.phaseX) * 0.35 + 0.5) * width;
        const autoY = (Math.sin(timeBase * state.speedY + state.phaseY) * 0.35 + 0.5) * height;

        // Mouse influence
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - state.currentX;
          const dy = mouseRef.current.y - state.currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 600) {
            // Pulls the blob in the direction of the mouse movement
            const pullStrength = Math.pow(1 - dist / 600, 2) * 0.08;
            state.vx += dxMouse * pullStrength;
            state.vy += dyMouse * pullStrength;
          }
        }

        // Return force towards autonomous position
        const returnForceX = (autoX - state.currentX) * 0.015;
        const returnForceY = (autoY - state.currentY) * 0.015;
        
        state.vx += returnForceX;
        state.vy += returnForceY;

        // Friction
        state.vx *= 0.93;
        state.vy *= 0.93;

        state.currentX += state.vx;
        state.currentY += state.vy;

        // Apply transform
        el.style.transform = `translate3d(${state.currentX - state.r/2}px, ${state.currentY - state.r/2}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

  return (
    <div ref={containerRef} className="relative w-[100vw] h-[100vh] overflow-hidden bg-[#0a0a0a] text-white select-none">
      <style>{FONTS}</style>
      
      {/* Animated Blobs Layer */}
      <div 
        className="absolute inset-[-20%] w-[140%] h-[140%] pointer-events-none mix-blend-screen"
        style={{ filter: 'blur(90px)' }}
      >
        <div 
          ref={el => blobsRef.current[0] = el} 
          className="absolute rounded-full left-0 top-0 opacity-80"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(200, 151, 58, 0.6) 0%, rgba(200, 151, 58, 0) 70%)' }}
        />
        <div 
          ref={el => blobsRef.current[1] = el} 
          className="absolute rounded-full left-0 top-0 opacity-70"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(160, 100, 20, 0.5) 0%, rgba(160, 100, 20, 0) 70%)' }}
        />
        <div 
          ref={el => blobsRef.current[2] = el} 
          className="absolute rounded-full left-0 top-0 opacity-90"
          style={{ width: 800, height: 800, background: 'radial-gradient(circle, rgba(120, 60, 10, 0.7) 0%, rgba(120, 60, 10, 0) 70%)' }}
        />
        <div 
          ref={el => blobsRef.current[3] = el} 
          className="absolute rounded-full left-0 top-0 opacity-60"
          style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, rgba(255, 200, 100, 0) 70%)' }}
        />
        <div 
          ref={el => blobsRef.current[4] = el} 
          className="absolute rounded-full left-0 top-0 opacity-75"
          style={{ width: 650, height: 650, background: 'radial-gradient(circle, rgba(180, 130, 40, 0.5) 0%, rgba(180, 130, 40, 0) 70%)' }}
        />
      </div>

      {/* Cinematic Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: noiseSvg }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: noiseSvg }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-80" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/90" />

      {/* Header Mock */}
      <header className="absolute top-0 w-full px-8 md:px-16 py-8 flex justify-between items-center z-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="text-3xl tracking-widest text-white uppercase font-bold" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.15em' }}>
          A<span className="text-[#C8973A]">P</span>T
        </div>
        <nav className="hidden md:flex gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-gray-300">
          <a href="#" className="hover:text-[#C8973A] transition-colors">Metodologia</a>
          <a href="#" className="hover:text-[#C8973A] transition-colors">Resultados</a>
          <a href="#" className="hover:text-[#C8973A] transition-colors">Contato</a>
        </nav>
        <button className="md:hidden text-white flex flex-col gap-1.5 p-2">
          <div className="w-6 h-[2px] bg-white"></div>
          <div className="w-4 h-[2px] bg-white ml-auto"></div>
          <div className="w-6 h-[2px] bg-white"></div>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl w-full flex flex-col items-center text-center">
          
          <div className="overflow-hidden mb-6">
            <p 
              className="uppercase tracking-[0.4em] text-[#C8973A] font-semibold text-xs md:text-sm animate-[slideUp_1s_ease-out_forwards] opacity-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Anderson Personal Trainer
            </p>
          </div>
          
          <h1 
            className="text-6xl md:text-8xl lg:text-[11rem] uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-white via-[#f0f0f0] to-[#555] mb-6 drop-shadow-2xl"
            style={{ 
              fontFamily: "'Anton', sans-serif", 
              lineHeight: 0.9,
              filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))'
            }}
          >
            Sua Melhor<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8973A] via-[#E8B75A] to-[#C8973A] text-gradient">
              Versão
            </span>
          </h1>
          
          <p 
            className="text-gray-300/90 max-w-2xl text-base md:text-xl font-light mt-4 mb-12"
            style={{ fontFamily: "'Outfit', sans-serif", textWrap: 'balance' }}
          >
            Treinamento de elite e acompanhamento premium para resultados extraordinários. O processo é implacável, o resultado é inesquecível.
          </p>

          <button 
            className="group relative px-10 py-5 bg-[#C8973A] text-[#0a0a0a] font-semibold text-sm md:text-base uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] rounded-sm"
            style={{ fontFamily: "'Outfit', sans-serif", boxShadow: '0 0 40px rgba(200, 151, 58, 0.2)' }}
          >
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <span className="relative z-10 flex items-center gap-3">
              Transformar Agora
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="transition-transform duration-300 group-hover:translate-x-1.5">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </button>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-gray-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <span className="w-8 h-[1px] bg-gray-600"></span>
        Scroll para explorar
      </div>

      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-2 text-xs tracking-[0.1em] text-gray-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <span>SÃO PAULO, BR</span>
        <span className="text-[#C8973A]">PREMIUM COACHING</span>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Nebulosa;
