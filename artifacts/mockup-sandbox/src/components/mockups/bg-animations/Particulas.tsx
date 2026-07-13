import React, { useRef, useEffect } from 'react';

const Particulas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -1000, y: -1000, radius: 180 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      alpha: number;
      vx: number;
      vy: number;

      constructor() {
        this.baseX = Math.random() * width;
        this.baseY = Math.random() * height;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 2 + 0.5;
        this.density = (Math.random() * 30) + 10;
        this.alpha = Math.random() * 0.7 + 0.1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(200, 151, 58, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Drift the base position
        this.baseX += this.vx;
        this.baseY += this.vy;
        
        // Wrap around base position
        if (this.baseX > width) this.baseX = 0;
        if (this.baseX < 0) this.baseX = width;
        if (this.baseY > height) this.baseY = 0;
        if (this.baseY < 0) this.baseY = height;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Repel from mouse
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;
          
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Return to base position slowly
          if (this.x !== this.baseX) {
            let dxBase = this.baseX - this.x;
            this.x += dxBase * 0.03;
          }
          if (this.y !== this.baseY) {
            let dyBase = this.baseY - this.y;
            this.y += dyBase * 0.03;
          }
        }
      }
    }

    let particleArray: Particle[] = [];

    const initParticles = () => {
      particleArray = [];
      const numberOfParticles = Math.floor((width * height) / 8000);
      for (let i = 0; i < numberOfParticles; i++) {
        particleArray.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
        
        // Draw connections between close particles (constellation effect)
        for (let j = i; j < particleArray.length; j++) {
          let dx = particleArray[i].x - particleArray[j].x;
          let dy = particleArray[i].y - particleArray[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 151, 58, ${(1 - distance / 120) * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#0a0a0a', overflow: 'hidden', margin: 0, padding: 0 }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;600&display=swap');
          
          .hero-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 10;
            pointer-events: none;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
          }

          .subtitle {
            font-family: 'Outfit', sans-serif;
            color: #C8973A;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 6px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
          }

          .subtitle::before, .subtitle::after {
            content: '';
            display: block;
            width: 40px;
            height: 1px;
            background-color: #C8973A;
            opacity: 0.6;
          }

          .title {
            font-family: 'Anton', sans-serif;
            color: #ffffff;
            font-size: clamp(3.5rem, 10vw, 7rem);
            line-height: 1.05;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0 0 2.5rem 0;
            text-shadow: 0 10px 40px rgba(0,0,0,0.8);
          }

          .cta-button {
            font-family: 'Outfit', sans-serif;
            background-color: transparent;
            color: #C8973A;
            border: 2px solid #C8973A;
            padding: 1.2rem 3rem;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            display: inline-block;
          }

          .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #C8973A;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: -1;
          }

          .cta-button:hover::before {
            transform: scaleX(1);
            transform-origin: left;
          }

          .cta-button:hover {
            color: #0a0a0a;
            box-shadow: 0 0 30px rgba(200, 151, 58, 0.3);
          }

          .overlay-gradient {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.8) 100%);
            pointer-events: none;
            z-index: 5;
          }
        `}
      </style>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <div className="overlay-gradient" />
      <div className="hero-content">
        <div className="subtitle">Anderson Personal Trainer</div>
        <h1 className="title">Transforme<br/>Seu Corpo</h1>
        <button className="cta-button">Agendar Consulta</button>
      </div>
    </div>
  );
};

export default Particulas;
