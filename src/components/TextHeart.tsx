import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
  phase: number;
  amplitude: number;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    const text = "i love you";
    const fontSize = 12;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 45;

      // Heart equation: 
      // x = 16 sin^3(t)
      // y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))

      for (let t = 0; t < Math.PI * 2; t += 0.09) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          alpha: 0,
          targetAlpha: 0.8 + Math.random() * 0.2,
          delay: Math.random() * 8000,
          phase: Math.random() * Math.PI * 2,
          amplitude: 2 + Math.random() * 4,
        });
      }

      // Add inner layers
      for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.18) {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

          points.push({
            x: centerX + x * scale * s,
            y: centerY + y * scale * s,
            alpha: 0,
            targetAlpha: 0.4 + Math.random() * 0.4,
            delay: Math.random() * 9000,
            phase: Math.random() * Math.PI * 2,
            amplitude: 2 + Math.random() * 4,
          });
        }
      }
    };

    let start: number | null = null;
    const baseScale = 1;
    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;
      const heartbeat =
        1 +
        Math.sin(elapsed * 0.002) * 0.035 +
        Math.sin(elapsed * 0.004) * 0.015;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Fira Code", monospace`;

      points.forEach((p) => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        const dx = p.x - canvas.width / 2;
        const dy = p.y - canvas.height / 2;

        const x = canvas.width / 2 + dx * heartbeat;
        const y = canvas.height / 2 + dy * heartbeat;

        const floatX =
          Math.sin(elapsed * 0.0018 + p.phase) * p.amplitude;

        const floatY =
          Math.cos(elapsed * 0.0013 + p.phase) * p.amplitude * 0.7;

        const rotation = 0; 

        ctx.save();

        ctx.translate(x + floatX, y + floatY);
        ctx.rotate(rotation);

        ctx.fillStyle = `rgba(255,77,109,${p.alpha})`;

        ctx.fillText(
          text,
          -ctx.measureText(text).width / 2,
          0
        );

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
