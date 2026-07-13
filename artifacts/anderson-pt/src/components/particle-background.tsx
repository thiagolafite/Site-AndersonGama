import { useRef, useEffect } from "react";

interface ParticleBackgroundProps {
  /** 0–1 opacity of the entire canvas layer. Default 1. */
  opacity?: number;
  /** Particle colour in r,g,b. Default is gold (200,151,58). */
  color?: [number, number, number];
  /** How strongly the mouse repels particles (density multiplier). Default 1. */
  intensity?: number;
}

export function ParticleBackground({
  opacity = 1,
  color = [200, 151, 58],
  intensity = 1,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -9999, y: -9999, radius: 160 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Listen on the window so movement anywhere on the page is captured
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    const [r, g, b] = color;

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
        this.density = (Math.random() * 30 + 10) * intensity;
        this.alpha = Math.random() * 0.7 + 0.1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
      }

      draw() {
        ctx!.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.closePath();
        ctx!.fill();
      }

      update() {
        this.baseX += this.vx;
        this.baseY += this.vy;
        if (this.baseX > width) this.baseX = 0;
        if (this.baseX < 0) this.baseX = width;
        if (this.baseY > height) this.baseY = 0;
        if (this.baseY < 0) this.baseY = height;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * this.density;
          this.y -= (dy / dist) * force * this.density;
        } else {
          this.x += (this.baseX - this.x) * 0.03;
          this.y += (this.baseY - this.y) * 0.03;
        }
      }
    }

    let particles: Particle[] = [];

    function init() {
      particles = [];
      const count = Math.floor((width * height) / 8000);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Constellation lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / 120) * 0.22})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
            ctx!.closePath();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
