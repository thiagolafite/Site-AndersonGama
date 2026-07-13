import React, { useEffect, useRef } from 'react';

const GradeMagnetica: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Grid configuration
    const spacing = 45;
    const fov = 800; // Perspective focal length
    const points: { x: number; y: number; z: number; baseZ: number; vz: number }[][] = [];

    let cols = 0;
    let rows = 0;

    const initGrid = () => {
      points.length = 0;
      // Add extra rows/cols to cover the screen even when deforming
      cols = Math.ceil(width / spacing) + 6;
      rows = Math.ceil(height / spacing) + 6;

      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push({
            x: offsetX + (j - 3) * spacing,
            y: offsetY + (i - 3) * spacing,
            z: 0,
            baseZ: 0,
            vz: 0
          });
        }
        points.push(row);
      }
    };

    initGrid();

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      
      // Clear background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Update physics for each point
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const p = points[i][j];
          
          // Base undulation (like a slow breathing or energy field)
          p.baseZ = Math.sin(time * 2 + i * 0.15 + j * 0.15) * 20;
          
          // Distance from mouse in 2D space to calculate the magnetic pull
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let targetZ = p.baseZ;
          
          // Magnetic interaction radius
          const radius = 350;
          if (dist < radius) {
            // Smooth bell-curve like falloff
            const force = Math.pow((radius - dist) / radius, 2);
            targetZ -= force * 350; // Negative Z brings it closer to the camera
          }
          
          // Spring physics for smooth movement
          const dz = targetZ - p.z;
          p.vz += dz * 0.08;
          p.vz *= 0.75; // Damping
          p.z += p.vz;
        }
      }

      // We will render lines. First configure style.
      ctx.lineWidth = 1;

      // Function to project 3D to 2D
      const project = (p: { x: number; y: number; z: number }) => {
        const scale = fov / (fov + p.z);
        return {
          x: centerX + (p.x - centerX) * scale,
          y: centerY + (p.y - centerY) * scale,
          scale
        };
      };

      // Draw horizontal lines
      for (let i = 0; i < rows; i++) {
        ctx.beginPath();
        for (let j = 0; j < cols; j++) {
          const p = points[i][j];
          const proj = project(p);
          
          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        
        // Use a gradient for the line to fade out based on position might be complex, 
        // we'll apply a global overlay instead to fade the edges.
        ctx.strokeStyle = 'rgba(200, 151, 58, 0.18)'; 
        ctx.stroke();
      }

      // Draw vertical lines
      for (let j = 0; j < cols; j++) {
        ctx.beginPath();
        for (let i = 0; i < rows; i++) {
          const p = points[i][j];
          const proj = project(p);
          
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = 'rgba(200, 151, 58, 0.18)';
        ctx.stroke();
      }

      // Draw intersection dots for high-tech precision feel
      ctx.fillStyle = 'rgba(200, 151, 58, 0.6)';
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const p = points[i][j];
          const proj = project(p);
          
          // Only draw dots for points that are pulled closer to give a glowing effect
          if (p.z < -50) {
            const intensity = Math.min(1, Math.abs(p.z + 50) / 250);
            ctx.globalAlpha = intensity;
            
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, 1.5 * proj.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Vignette effect to fade edges into darkness seamlessly
      const gradient = ctx.createRadialGradient(centerX, centerY, height * 0.2, centerX, centerY, height * 0.8);
      gradient.addColorStop(0, 'rgba(10, 10, 10, 0)');
      gradient.addColorStop(1, 'rgba(10, 10, 10, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;600;700&display=swap');
          
          .gold-text {
            background: linear-gradient(135deg, #FFD700 0%, #C8973A 50%, #8B6508 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .cta-button {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: all 0.5s ease;
          }
          
          .cta-button:hover::before {
            left: 100%;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(200, 151, 58, 0.4);
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
      
      {/* Overlay Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        pointerEvents: 'none' // Allow canvas underneath to capture mousemove, except for button
      }}>
        <div style={{ pointerEvents: 'auto', padding: '2rem' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C8973A',
            marginBottom: '1rem',
            opacity: 0.9
          }}>
            Anderson Personal Trainer
          </h2>
          
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(3.5rem, 8vw, 8rem)',
            lineHeight: 1.05,
            color: '#ffffff',
            margin: '0 0 1.5rem 0',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            Supere Seus <span className="gold-text">Limites</span>
          </h1>
          
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#a0a0a0',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            lineHeight: 1.6,
            fontWeight: 300
          }}>
            Transforme seu corpo e sua mente com um treinamento exclusivo, focado em resultados reais e precisão técnica.
          </p>
          
          <button className="cta-button" style={{
            background: 'linear-gradient(135deg, #C8973A 0%, #a67c2c 100%)',
            border: 'none',
            padding: '1.2rem 3rem',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#0a0a0a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            borderRadius: '2px',
          }}>
            Começar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeMagnetica;