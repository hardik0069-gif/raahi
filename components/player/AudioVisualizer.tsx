"use client";

import { useEffect, useRef } from "react";

type AudioVisualizerProps = {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
};

export default function AudioVisualizer({
  isPlaying,
  barCount = 18,
  className = "",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 180;
    const height = canvas.clientHeight || 28;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Initial phase values for each bar
    const bars = Array.from({ length: barCount }, (_, i) => ({
      height: 3,
      targetHeight: 3,
      speed: 0.08 + (i % 5) * 0.03,
      phase: (i * Math.PI) / (barCount / 2),
    }));

    let time = 0;

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);

      const spacing = width / barCount;
      const barWidth = Math.max(2, spacing * 0.45);

      bars.forEach((bar, index) => {
        if (isPlaying) {
          // Dynamic organic height wave calculation
          const wave1 = Math.sin(time * 2.8 + bar.phase) * 0.45;
          const wave2 = Math.cos(time * 1.6 + index * 0.7) * 0.35;
          const wave3 = Math.sin(time * 4.2 + index * 1.3) * 0.2;
          const energy = Math.max(0.12, Math.min(1, 0.45 + wave1 + wave2 + wave3));
          bar.targetHeight = 4 + energy * (height - 6);
        } else {
          bar.targetHeight = 3;
        }

        // Smooth spring lerp
        bar.height += (bar.targetHeight - bar.height) * 0.18;

        const x = index * spacing + (spacing - barWidth) / 2;
        const y = (height - bar.height) / 2;

        // Warm gold/cream glowing gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + bar.height);
        if (isPlaying) {
          gradient.addColorStop(0, "rgba(214, 185, 140, 0.95)"); // gold
          gradient.addColorStop(0.5, "rgba(238, 233, 223, 0.9)"); // cream
          gradient.addColorStop(1, "rgba(214, 185, 140, 0.7)");
        } else {
          gradient.addColorStop(0, "rgba(238, 233, 223, 0.25)");
          gradient.addColorStop(1, "rgba(238, 233, 223, 0.15)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, bar.height, 2);
        } else {
          ctx.rect(x, y, barWidth, bar.height);
        }
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, barCount]);

  return (
    <div
      className={`raahi-visualizer-container ${className}`}
      aria-hidden="true"
      title={isPlaying ? "Audio playing" : "Audio paused"}
    >
      <canvas
        ref={canvasRef}
        className="raahi-visualizer-canvas"
        style={{ width: "160px", height: "24px" }}
      />
    </div>
  );
}

