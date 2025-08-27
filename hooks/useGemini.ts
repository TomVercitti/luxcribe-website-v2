import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const useGemini = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const generateImages = async (prompt: string) => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        // FIX: Updated deprecated model to the recommended one for image generation.
        model: 'imagen-4.0-generate-001',
        prompt: `A clean, simple, single-color, black and white, vector-style line art suitable for laser engraving on an Xtool S1. The design should be bold and clear with no shading or fine details. Subject: ${prompt}`,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      });

      const images = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
      setGeneratedImages(images);

    } catch (e: any) {
      console.error(e);
      setError(e.message || "An error occurred while generating images.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, generatedImages, generateImages };
};

export default useGemini;