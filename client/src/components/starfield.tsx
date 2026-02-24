import { useEffect, useRef } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    interface Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      drift: number;
      length: number;
    }

    const PARTICLE_COUNT = 200;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.5 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
        length: Math.random() * 12 + 4,
      }));
    };

    const draw = () => {
      ctx.fillStyle = "rgba(3, 5, 12, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y += p.speed;
        p.x += p.drift;

        if (p.y > canvas.height + 10) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const gradient = ctx.createLinearGradient(p.x, p.y - p.length, p.x, p.y);
        gradient.addColorStop(0, `rgba(120, 160, 255, 0)`);
        gradient.addColorStop(1, `rgba(160, 200, 255, ${p.opacity})`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.length);
        ctx.lineTo(p.x + p.drift * 2, p.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x + p.drift * 2, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${p.opacity * 0.8})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    const handleResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
