/**
 * Pre-processes high-resolution images for transmission to Gemini Vision API.
 * Keeps payload lightweight (~250-500KB) while maintaining high visual fidelity,
 * preventing network timeouts and payload-limit errors on large camera RAW/JPEG exports.
 */
export async function optimizeImageForAnalysis(
  dataUrl: string,
  maxDim = 2048,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve) => {
    // If it is already small enough, return immediately
    if (dataUrl.length < 1024 * 1024) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.onload = () => {
      // If dimensions are within maxDim and size is modest, resolve
      if (img.naturalWidth <= maxDim && img.naturalHeight <= maxDim && dataUrl.length < 2 * 1024 * 1024) {
        return resolve(dataUrl);
      }

      const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      // Export as high-quality compressed JPEG for transmission
      const optimized = canvas.toDataURL('image/jpeg', quality);
      resolve(optimized);
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
