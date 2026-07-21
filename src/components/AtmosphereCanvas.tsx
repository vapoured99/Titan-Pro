import React, { useEffect, useRef } from "react";

interface GymTheme {
  id: string;
  name: string;
  accent: string;
  accentRgb: string;
  accentLight: string;
  accentDark: string;
  bg: string;
  isGradient?: boolean;
}

interface AtmosphereCanvasProps {
  activeTheme: GymTheme;
  effectType: string; // "hybrid" | "particles" | "meteors" | "techgrid" | "raindrops" | "matrix" | "aurora" | "disabled"
}

// Particle structure
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  fadeSpeed: number;
  color: string;
  glow: boolean;
}

// Jellyfish structure
interface Jellyfish {
  x: number;
  y: number;
  size: number;
  speedY: number;
  pulsePhase: number;
  pulseSpeed: number;
  tentacles: { length: number; phaseOffset: number; speedOffset: number }[];
  color: string;
  accentColor: string;
}

// Shooting Star (Meteor) structure
interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

// Cozy Raindrop structure
interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  alpha: number;
}

// Matrix Stream Column structure
interface MatrixStream {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  lastUpdate: number;
  updateInterval: number;
}

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = ({
  activeTheme,
  effectType,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });

  useEffect(() => {
    if (
      effectType === "disabled" ||
      effectType === "custom_video" ||
      effectType === "car_video" ||
      effectType.includes("video") ||
      effectType.includes("medium")
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Parse theme colors
    const accentRgb = activeTheme.accentRgb || "212, 175, 55";
    const accentColor = activeTheme.accent || "#D4AF37";
    const accentLightColor = activeTheme.accentLight || "#F1E5AC";
    const accentDarkColor = activeTheme.accentDark || "#C5A028";

    // 1. Particles Setup
    const particles: Particle[] = [];
    const maxParticles = 60;
    const createParticle = (initYAtBottom = false): Particle => {
      const size = Math.random() * 3 + 1;
      return {
        x: Math.random() * width,
        y: initYAtBottom ? height + 20 : Math.random() * height,
        size,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.6 + 0.2), // float upwards
        alpha: Math.random() * 0.5 + 0.2,
        fadeSpeed: Math.random() * 0.003 + 0.001,
        color: Math.random() > 0.4 ? accentColor : accentLightColor,
        glow: Math.random() > 0.7,
      };
    };

    // 2. Jellyfish Setup (for hybrid mode)
    const jellyfishList: Jellyfish[] = [];
    const maxJellyfish = 3;
    const createJellyfish = (initYAtBottom = false): Jellyfish => {
      const size = Math.random() * 12 + 15;
      const numTentacles = Math.floor(Math.random() * 3) + 4;
      const tentacles = Array.from({ length: numTentacles }).map(() => ({
        length: size * (Math.random() * 1.5 + 1.5),
        phaseOffset: Math.random() * Math.PI * 2,
        speedOffset: Math.random() * 0.02 + 0.02,
      }));

      return {
        x: Math.random() * (width - 100) + 50,
        y: initYAtBottom ? height + 100 : Math.random() * (height - 100) + 50,
        size,
        speedY: -(Math.random() * 0.25 + 0.1),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.01,
        tentacles,
        color: accentColor,
        accentColor: accentLightColor,
      };
    };

    // 3. Meteor Setup
    const meteors: Meteor[] = [];
    const maxMeteors = 5;
    const createMeteor = (): Meteor => {
      return {
        x: Math.random() * width * 1.2 - width * 0.2, // allow starting offscreen left/right
        y: -100 - Math.random() * 200,
        length: Math.random() * 80 + 70, // beautiful long trail
        speed: Math.random() * 8 + 6,
        vx: Math.random() * 4 + 4, // angle down and right
        vy: Math.random() * 4 + 8,
        alpha: Math.random() * 0.6 + 0.4,
        size: Math.random() * 1.5 + 1,
      };
    };

    // 4. Raindrops Setup
    const raindrops: Raindrop[] = [];
    const maxRaindrops = 80;
    const createRaindrop = (randomY = false): Raindrop => {
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -20,
        speed: Math.random() * 8 + 12, // fast cozy rain
        length: Math.random() * 20 + 15,
        alpha: Math.random() * 0.22 + 0.08,
      };
    };

    // 5. Matrix Rain Setup
    const matrixStreams: MatrixStream[] = [];
    const charSize = 14;
    const columnsCount = Math.floor(width / 24);
    const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}*#@+=".split("");
    const createMatrixStream = (colIndex: number, initRandomY = false): MatrixStream => {
      const colX = colIndex * 24;
      const colY = initRandomY ? Math.random() * -height : -150;
      const speed = Math.random() * 3 + 2;
      const length = Math.floor(Math.random() * 12) + 8;
      const chars: string[] = [];
      for (let i = 0; i < length; i++) {
        chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
      }
      return {
        x: colX,
        y: colY,
        speed,
        chars,
        lastUpdate: 0,
        updateInterval: Math.random() * 60 + 40,
      };
    };

    // Initialize Pools
    if (effectType === "particles" || effectType === "hybrid") {
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle(false));
      }
    }
    if (effectType === "hybrid") {
      for (let i = 0; i < maxJellyfish; i++) {
        jellyfishList.push(createJellyfish(false));
      }
    }
    if (effectType === "meteors") {
      for (let i = 0; i < maxMeteors; i++) {
        meteors.push(createMeteor());
      }
    }
    if (effectType === "raindrops") {
      for (let i = 0; i < maxRaindrops; i++) {
        raindrops.push(createRaindrop(true));
      }
    }
    if (effectType === "matrix") {
      for (let i = 0; i < columnsCount; i++) {
        matrixStreams.push(createMatrixStream(i, true));
      }
    }

    // Handle mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;

      if (effectType === "matrix") {
        matrixStreams.length = 0;
        const newCols = Math.floor(width / 24);
        for (let i = 0; i < newCols; i++) {
          matrixStreams.push(createMatrixStream(i, true));
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = timestamp || 0;

      // --- 1. RENDER HYBRID / PARTICLES ---
      if (effectType === "particles" || effectType === "hybrid") {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;

          // Repelled by mouse
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }

          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0 || p.y < -20 || p.x < -20 || p.x > width + 20) {
            particles[i] = createParticle(true);
          } else {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            if (p.glow) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = p.color;
            }
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // --- 2. RENDER JELLYFISH (FOR HYBRID MODE) ---
      if (effectType === "hybrid") {
        for (let i = 0; i < jellyfishList.length; i++) {
          const j = jellyfishList[i];
          j.pulsePhase += j.pulseSpeed;
          const pulse = Math.sin(j.pulsePhase);
          const currentSize = j.size * (1 + pulse * 0.15);
          const swimThrust = pulse < 0 ? Math.abs(pulse) * 0.4 : 0;
          j.y += j.speedY * (1 + swimThrust);
          j.x += Math.sin(j.pulsePhase * 0.5) * 0.15;

          // Mouse push
          const dx = j.x - mouseRef.current.x;
          const mdy = j.y - mouseRef.current.y;
          const dist = Math.hypot(dx, mdy);
          if (dist < mouseRef.current.radius + 50) {
            const force = (mouseRef.current.radius + 50 - dist) / (mouseRef.current.radius + 50);
            j.x += (dx / dist) * force * 1.0;
            j.y += (mdy / dist) * force * 0.5;
          }

          if (j.y < -100) {
            jellyfishList[i] = createJellyfish(true);
            continue;
          }

          ctx.save();
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(${accentRgb}, 0.25)`;

          const bellGrad = ctx.createRadialGradient(
            j.x, j.y - currentSize * 0.2, currentSize * 0.1,
            j.x, j.y - currentSize * 0.2, currentSize
          );
          bellGrad.addColorStop(0, `rgba(${accentRgb}, 0.4)`);
          bellGrad.addColorStop(0.6, `rgba(${accentRgb}, 0.18)`);
          bellGrad.addColorStop(1, `rgba(${accentRgb}, 0.01)`);

          ctx.beginPath();
          ctx.moveTo(j.x - currentSize, j.y);
          ctx.bezierCurveTo(
            j.x - currentSize, j.y - currentSize * 1.4,
            j.x + currentSize, j.y - currentSize * 1.4,
            j.x + currentSize, j.y
          );
          ctx.bezierCurveTo(
            j.x + currentSize * 0.5, j.y + currentSize * 0.2,
            j.x - currentSize * 0.5, j.y + currentSize * 0.2,
            j.x - currentSize, j.y
          );
          ctx.fillStyle = bellGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(j.x, j.y - currentSize * 0.1, currentSize * 0.95, Math.PI, 0);
          ctx.strokeStyle = `rgba(${accentRgb}, 0.35)`;
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Tentacles
          j.tentacles.forEach((t, tIdx) => {
            const ratio = tIdx / (j.tentacles.length - 1);
            const rimX = j.x - currentSize + (currentSize * 2) * ratio;
            const rimDist = Math.abs(ratio - 0.5) * 2;
            const rimY = j.y + (1 - Math.sqrt(1 - rimDist * rimDist)) * currentSize * 0.12;

            ctx.beginPath();
            ctx.moveTo(rimX, rimY);

            const waveOffset = time * t.speedOffset + t.phaseOffset;
            const waveAmp = currentSize * 0.15;

            const cp1x = rimX + Math.sin(waveOffset) * waveAmp;
            const cp1y = rimY + t.length * 0.3;
            const cp2x = rimX - Math.sin(waveOffset + 1) * waveAmp * 0.8;
            const cp2y = rimY + t.length * 0.65;
            const endX = rimX + Math.sin(waveOffset + 2) * waveAmp * 0.5;
            const endY = rimY + t.length;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

            const tentGrad = ctx.createLinearGradient(rimX, rimY, endX, endY);
            tentGrad.addColorStop(0, `rgba(${accentRgb}, 0.4)`);
            tentGrad.addColorStop(0.5, `rgba(${accentRgb}, 0.15)`);
            tentGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.strokeStyle = tentGrad;
            ctx.lineWidth = tIdx === 0 || tIdx === j.tentacles.length - 1 ? 0.7 : 1.2;
            ctx.stroke();
          });

          ctx.restore();
        }
      }

      // --- 3. RENDER METEORS (SHOOTING STARS) ---
      if (effectType === "meteors") {
        for (let i = 0; i < meteors.length; i++) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;

          // Boundary reset
          if (m.y > height + 100 || m.x > width + 100) {
            meteors[i] = createMeteor();
            continue;
          }

          ctx.save();
          const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.length * (m.vx / m.speed), m.y - m.length * (m.vy / m.speed));
          trailGrad.addColorStop(0, `rgba(${accentRgb}, ${m.alpha})`);
          trailGrad.addColorStop(0.4, `rgba(${accentRgb}, ${m.alpha * 0.3})`);
          trailGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = m.size;
          ctx.lineCap = "round";

          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.length * (m.vx / m.speed), m.y - m.length * (m.vy / m.speed));
          ctx.stroke();

          // Shining white core dot for the meteor head
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 0.9, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // --- 4. RENDER COZY RAINDROPS ---
      if (effectType === "raindrops") {
        for (let i = 0; i < raindrops.length; i++) {
          const r = raindrops[i];
          r.y += r.speed;

          if (r.y > height + 20) {
            raindrops[i] = createRaindrop(false);
            continue;
          }

          ctx.save();
          ctx.strokeStyle = `rgba(${accentRgb}, ${r.alpha})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x, r.y + r.length);
          ctx.stroke();
          ctx.restore();
        }
      }

      // --- 5. RENDER ELECTRIC PULSE GRID (SYNTHWAVE TECH) ---
      if (effectType === "techgrid") {
        ctx.save();
        ctx.strokeStyle = `rgba(${accentRgb}, 0.08)`;
        ctx.lineWidth = 1.2;

        const gridVanishingY = height * 0.28; // high up vanishing point
        const totalLines = 24;
        const speedFactor = (time * 0.04) % 40; // horizontal lines scroll forward

        // A. Draw vertical lines projecting outwards from perspective vanishing point
        for (let idx = 0; idx <= totalLines; idx++) {
          const xProgress = idx / totalLines;
          const bottomX = xProgress * width * 1.8 - width * 0.4; // spread wider at bottom
          ctx.beginPath();
          ctx.moveTo(width / 2, gridVanishingY);
          ctx.lineTo(bottomX, height);
          ctx.stroke();
        }

        // B. Draw exponential horizontal lines scrolling towards user
        for (let i = 0; i < 18; i++) {
          const rawIndex = i + speedFactor / 40;
          // Exponential growth for correct distance perspective
          const depthRatio = Math.pow(rawIndex / 18, 2.5);
          const gridY = gridVanishingY + depthRatio * (height - gridVanishingY);

          // Undulate grid brightness with gentle math wave
          const waveBrightness = 0.05 + Math.sin(time * 0.001 + i * 0.4) * 0.03;
          ctx.strokeStyle = `rgba(${accentRgb}, ${waveBrightness})`;
          ctx.beginPath();
          ctx.moveTo(0, gridY);
          ctx.lineTo(width, gridY);
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- 6. RENDER CYBER RAIN (MATRIX) ---
      if (effectType === "matrix") {
        ctx.save();
        ctx.font = `bold ${charSize}px monospace`;
        ctx.textAlign = "center";

        for (let i = 0; i < matrixStreams.length; i++) {
          const s = matrixStreams[i];
          s.y += s.speed;

          // Flicker characters in stream
          if (time - s.lastUpdate > s.updateInterval) {
            s.chars.shift();
            s.chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
            s.lastUpdate = time;
          }

          // Boundary reset
          if (s.y - (s.chars.length * charSize) > height) {
            matrixStreams[i] = createMatrixStream(i, false);
            continue;
          }

          // Draw stream of code
          for (let cIdx = 0; cIdx < s.chars.length; cIdx++) {
            const charY = s.y - cIdx * charSize;
            if (charY < -10 || charY > height + 20) continue;

            const isLeading = cIdx === 0;
            const opacity = isLeading
              ? 0.9
              : Math.max(0.02, 0.45 * (1 - cIdx / s.chars.length));

            ctx.fillStyle = isLeading ? "#FFFFFF" : `rgba(${accentRgb}, ${opacity})`;

            if (isLeading) {
              ctx.shadowBlur = 8;
              ctx.shadowColor = accentColor;
            } else {
              ctx.shadowBlur = 0;
            }

            ctx.fillText(s.chars[cIdx], s.x, charY);
          }
        }
        ctx.restore();
      }

      // --- 7. RENDER AURORA WAVES ---
      if (effectType === "aurora") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const numWaves = 3;
        for (let wIdx = 0; wIdx < numWaves; wIdx++) {
          ctx.beginPath();

          const layerSpeed = 0.0004 + wIdx * 0.00015;
          const layerOffset = time * layerSpeed;
          const frequency = 0.002 + wIdx * 0.0008;
          const amplitude = 55 + wIdx * 15;
          const baseHeight = height * 0.6 + Math.sin(time * 0.0001 + wIdx) * 100;

          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const y =
              baseHeight +
              Math.sin(x * frequency + layerOffset) * amplitude +
              Math.cos(x * 0.0005 - layerOffset * 0.5) * (amplitude * 0.4);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          const waveGrad = ctx.createLinearGradient(0, baseHeight - 150, 0, height);
          const baseOpacity = 0.08 - wIdx * 0.015;
          waveGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
          waveGrad.addColorStop(0.3, `rgba(${accentRgb}, ${baseOpacity})`);
          waveGrad.addColorStop(0.7, `rgba(${accentRgb}, ${baseOpacity * 0.3})`);
          waveGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = waveGrad;
          ctx.fill();

          ctx.beginPath();
          for (let x = 0; x <= width; x += 15) {
            const y =
              baseHeight +
              Math.sin(x * frequency + layerOffset) * amplitude +
              Math.cos(x * 0.0005 - layerOffset * 0.5) * (amplitude * 0.4);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${accentRgb}, ${0.12 - wIdx * 0.03})`;
          ctx.lineWidth = 1.5 - wIdx * 0.3;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTheme.id, effectType]);

  if (
    effectType === "disabled" ||
    effectType === "custom_video" ||
    effectType === "car_video" ||
    effectType.includes("video") ||
    effectType.includes("medium")
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
