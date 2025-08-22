import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

const useGeminiText = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuotes, setGeneratedQuotes] = useState<string[]>([]);

  const generateQuotes = async (prompt: string) => {
    if (!prompt) {
      setError("Please enter a theme or occasion.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedQuotes([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 5 short, witty, or heartfelt phrases suitable for engraving on a gift. Theme: ${prompt}`,
        config: {
          systemInstruction: "You are a creative assistant crafting concise, memorable phrases for personalized engravings. Respond with a JSON array of 5 strings.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      });

      const jsonStr = response.text.trim();
      const quotes = JSON.parse(jsonStr);
      setGeneratedQuotes(quotes);

    } catch (e: any) {
      console.error(e);
      // Try to parse a more user-friendly error
      let friendlyError = e.message || "An error occurred while generating ideas.";
      if (e.message.includes('JSON')) {
        friendlyError = "The AI returned an invalid format. Please try again with a different prompt.";
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, generatedQuotes, generateQuotes };
};

export default useGeminiText;
