import React, { useRef, useEffect, useState } from 'react';

interface TransparentCharacterProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

// Low-overhead client-side cache to ensure we never process the same image URL twice
const imageCache: Record<string, string> = {};

export function TransparentCharacter({ src, alt, className, style }: TransparentCharacterProps) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const activeSrcRef = useRef<string>(src);

  useEffect(() => {
    activeSrcRef.current = src;
    
    // If already cached, apply immediately
    if (imageCache[src]) {
      setProcessedSrc(imageCache[src]);
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

        // --- Bilinear Background Reference Sampling ---
        // We sample multiple corner points representing the background canvas
        // Point A: top-left area
        // Point B: top-right area
        // Point C: mid-left area
        // Point D: mid-right area
        const sampleRgba = (x: number, y: number) => {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
        };

        const cA = sampleRgba(Math.min(15, width - 1), Math.min(15, height - 1));
        const cB = sampleRgba(Math.max(width - 15, 0), Math.min(15, height - 1));
        const cC = sampleRgba(Math.min(15, width - 1), Math.min(height / 3, height - 1));
        const cD = sampleRgba(Math.max(width - 15, 0), Math.min(height / 3, height - 1));

        // Let's run a full pass over the image data buffer
        for (let y = 0; y < height; y++) {
          const u = y / height; // vertical progress [0..1]
          
          // Interpolate the background left and right edge colors at this height level
          const bgL_R = (1 - u) * cA[0] + u * cC[0];
          const bgL_G = (1 - u) * cA[1] + u * cC[1];
          const bgL_B = (1 - u) * cA[2] + u * cC[2];

          const bgR_R = (1 - u) * cB[0] + u * cD[0];
          const bgR_G = (1 - u) * cB[1] + u * cD[1];
          const bgR_B = (1 - u) * cB[2] + u * cD[2];

          for (let x = 0; x < width; x++) {
            const v = x / width; // horizontal progress [0..1]
            const idx = (y * width + x) * 4;

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const originalAlpha = data[idx + 3];

            if (originalAlpha === 0) continue;

            // Interpolate the exact background reference color for this pixel coordinates
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
            // Character sits strictly in the center and bottom, head around y=0.2.
            // Edge and corner regions are 100% background and require higher chroma tolerance.
            const distX = Math.abs(x - width / 2) / (width / 2); // 0 at center, 1 at sides
            const distY = y / height; // 0 at top, 1 at bottom

            // Be highly aggressive at the top and left/right limits, but preserve central torso/head areas
            const edgeForce = Math.pow(distX, 1.8); // exponential falloff away from spine
            const topForce = Math.max(0, 1 - distY / 0.3); // aggressive near the top ceiling
            const outerWeight = Math.max(edgeForce, topForce);

            // Calculate precise lower and upper similarity limit
            // Centers get super protective tolerances (~16), edges get aggressive wide matching (~52)
            const minTolerance = 14 + outerWeight * 38;
            const featherWidth = 24;

            let alpha = originalAlpha;

            if (diff < minTolerance) {
              // Completely background
              alpha = 0;
            } else if (diff < minTolerance + featherWidth) {
              // Smooth transparent transition fade
              const ratio = (diff - minTolerance) / featherWidth;
              alpha = Math.round(ratio * originalAlpha);
            }

            data[idx + 3] = alpha;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        imageCache[src] = dataUrl;
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
  }, [src]);

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
