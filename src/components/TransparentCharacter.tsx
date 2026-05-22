import React, { useRef, useEffect, useState } from 'react';

interface TransparentCharacterProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  toleranceMultiplier?: number;
}

// Low-overhead client-side cache to ensure we never process the same image URL twice
const imageCache: Record<string, string> = {};

export function TransparentCharacter({ src, alt, className, style, toleranceMultiplier = 1.0 }: TransparentCharacterProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const activeSrcRef = useRef<string>(src);

  useEffect(() => {
    activeSrcRef.current = src;
    
    // Cache key containing both the src and the specific tolerance multiplier
    const cacheKey = `${src}_${toleranceMultiplier}`;
    if (imageCache[cacheKey]) {
      setProcessedSrc(imageCache[cacheKey]);
      return;
    }

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      // Guard against component unmounting or src changing during async loading
      if (activeSrcRef.current !== src) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 512;
      canvas.height = img.naturalHeight || img.height || 512;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessedSrc(src);
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // --- Multi-Level Bilinear Background Reference Sampling ---
        // Samples 6 reference points representing the sky and skyline background canvas
        // to handle smooth gradients from top to bottom perfectly without harming center.
        const sampleRgba = (x: number, y: number) => {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
        };

        const cA = sampleRgba(Math.min(15, width - 1), Math.min(15, height - 1)); // Top-Left
        const cB = sampleRgba(Math.max(width - 15, 0), Math.min(15, height - 1)); // Top-Right

        const cC = sampleRgba(Math.min(15, width - 1), Math.round(height / 2));  // Mid-Left
        const cD = sampleRgba(Math.max(width - 15, 0), Math.round(height / 2));  // Mid-Right

        const cE = sampleRgba(Math.min(15, width - 1), Math.max(height - 15, 0)); // Bottom-Left
        const cF = sampleRgba(Math.max(width - 15, 0), Math.max(height - 15, 0)); // Bottom-Right

        // Let's run a full pass over the image data buffer
        for (let y = 0; y < height; y++) {
          let bgL_R, bgL_G, bgL_B;
          let bgR_R, bgR_G, bgR_B;

          // Bilinearly interpolate from top to bottom
          if (y < height / 2) {
            const u = y / (height / 2); // vertical progress in upper half [0..1]
            bgL_R = (1 - u) * cA[0] + u * cC[0];
            bgL_G = (1 - u) * cA[1] + u * cC[1];
            bgL_B = (1 - u) * cA[2] + u * cC[2];

            bgR_R = (1 - u) * cB[0] + u * cD[0];
            bgR_G = (1 - u) * cB[1] + u * cD[1];
            bgR_B = (1 - u) * cB[2] + u * cD[2];
          } else {
            const u = (y - height / 2) / (height / 2); // vertical progress in lower half [0..1]
            bgL_R = (1 - u) * cC[0] + u * cE[0];
            bgL_G = (1 - u) * cC[1] + u * cE[1];
            bgL_B = (1 - u) * cC[2] + u * cE[2];

            bgR_R = (1 - u) * cD[0] + u * cF[0];
            bgR_G = (1 - u) * cD[1] + u * cF[1];
            bgR_B = (1 - u) * cD[2] + u * cF[2];
          }

          const pxFromTop = y / height;

          for (let x = 0; x < width; x++) {
            const v = x / width; // horizontal progress [0..1]
            const idx = (y * width + x) * 4;

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const originalAlpha = data[idx + 3];

            if (originalAlpha === 0) continue;

            // Interpolate the exact background reference color for this pixel coordinate
            const bgR = (1 - v) * bgL_R + v * bgR_R;
            const bgG = (1 - v) * bgL_G + v * bgR_G;
            const bgB = (1 - v) * bgL_B + v * bgR_B;

            // Compute distance in RGB color space
            const diff = Math.sqrt(
              0.3 * (r - bgR) ** 2 +
              0.59 * (g - bgG) ** 2 +
              0.11 * (b - bgB) ** 2
            );

            // --- Spatial Weighted Mask Calculations ---
            // Detect horizontal displacement from absolute center spine
            const pxFromCenter = Math.abs(x - width / 2) / (width / 2);

            // Define custom character bounding width constraints based on anatomy height
            let maxWidth = 0.0;
            if (pxFromTop >= 0.10 && pxFromTop < 0.28) {
              maxWidth = 0.35; // Head/Neck area
            } else if (pxFromTop >= 0.28 && pxFromTop < 0.65) {
              maxWidth = 0.52; // Flexing back/shoulders/arms
            } else if (pxFromTop >= 0.65 && pxFromTop < 0.98) {
              maxWidth = 0.44; // Core torso and legs
            }

            // Determine if inside character bounding envelope
            const insideChar = pxFromCenter < maxWidth && pxFromTop >= 0.10 && pxFromTop < 0.98;
            let protect = 0;
            if (insideChar) {
              // High core protection along the spine, fading smoothly to the edges
              protect = Math.pow(1 - (pxFromCenter / maxWidth), 1.4);
            }

            // Outside the protection zone, the background should be cleared aggressively.
            // Edge areas receive extremely high tolerance to wipe out skies, skylines or side lighting.
            const cornerWeight = Math.max(pxFromCenter, 1 - pxFromTop); 
            const bgTolerance = (24 + cornerWeight * 36) * toleranceMultiplier;
            const characterTolerance = 7.5 * toleranceMultiplier; // Extremely protective near the center spine

            // Linearly interpolate the tolerance and feather width
            const minTolerance = bgTolerance * (1 - protect) + characterTolerance * protect;
            const featherWidth = (14 * (1 - protect) + 22 * protect) * toleranceMultiplier;

            let alpha = originalAlpha;

            if (diff < minTolerance) {
              // Completely background
              alpha = 0;
            } else if (diff < minTolerance + featherWidth) {
              // Smooth transparent transition fade
              const ratio = (diff - minTolerance) / featherWidth;
              alpha = Math.round(ratio * originalAlpha);
            }

            // High protection core mapping (e.g. skin, chest, head, torso) must remain SOLID.
            if (protect > 0.12) {
              // Smoothly transition minimum alpha to 100% (originalAlpha) as we move deeper into the body
              const solidFactor = Math.min(1.0, (protect - 0.12) / 0.18); // 100% solid when protect >= 0.30
              const minAlpha = Math.round(originalAlpha * solidFactor);
              if (alpha < minAlpha) {
                alpha = minAlpha;
              }
            }

            data[idx + 3] = alpha;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        imageCache[cacheKey] = dataUrl;
        setProcessedSrc(dataUrl);
      } catch (err) {
        console.error('Canvas processing failed: fallback to raw image source', err);
        setProcessedSrc(src);
      } finally {
        setIsProcessing(false);
      }
    };

    img.onerror = () => {
      setProcessedSrc(src);
      setIsProcessing(false);
    };
  }, [src, toleranceMultiplier]);

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={`${className} ${isProcessing ? 'opacity-70 scale-98 blur-xs' : ''} transition-all duration-300`}
      style={style}
      referrerPolicy="no-referrer"
    />
  );
}
