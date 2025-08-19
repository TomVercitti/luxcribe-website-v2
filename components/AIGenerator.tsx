import React, { useState } from 'react';
import useGemini from '../hooks/useGemini';
import { Spinner } from './icons';

interface AIGeneratorProps {
  onImageSelect: (imageUrl: string) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onImageSelect }) => {
  const [prompt, setPrompt] = useState('');
  const { isLoading, error, generatedImages, generateImages } = useGemini();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateImages(prompt);
  };

  return (
    <div className="mb-4 p-3 bg-gray-900 rounded-lg">
      <h3 className="font-semibold mb-2 text-indigo-300">AI Image Generator</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., a majestic lion's head"
          className="w-full bg-gray-700 p-2 rounded mb-2 text-sm h-20 resize-none"
          rows={3}
        />
        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded disabled:bg-gray-600 flex items-center justify-center text-sm font-semibold">
          {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : 'Generate Images'}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      {generatedImages.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {generatedImages.map((src, i) => (
            <button key={i} onClick={() => onImageSelect(src)} className="rounded overflow-hidden focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400">
              <img src={src} alt={`AI generated image ${i + 1}`} className="w-full h-auto object-cover cursor-pointer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIGenerator;