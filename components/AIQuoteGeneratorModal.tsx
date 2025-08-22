import React, { useState } from 'react';
import useGeminiText from '../hooks/useGeminiText';
import { CloseIcon, Spinner } from './icons';

interface AIQuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (quote: string) => void;
}

const AIQuoteGeneratorModal: React.FC<AIQuoteGeneratorModalProps> = ({ isOpen, onClose, onSelectQuote }) => {
  const [prompt, setPrompt] = useState('');
  const { isLoading, error, generatedQuotes, generateQuotes } = useGeminiText();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateQuotes(prompt);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-lg shadow-2xl z-50 w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-playfair">AI Idea Generator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          <p className="text-gray-300 mb-4">Enter a theme or occasion below, and our AI will generate some creative ideas for your engraving.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., anniversary for husband, funny gift for a coffee lover, motivational quote"
              className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-6 h-6 mr-2" />
                  Generating...
                </>
              ) : (
                'Get Ideas'
              )}
            </button>
          </form>

          {error && <p className="mt-4 text-center text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}

          {generatedQuotes.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-indigo-300">Generated Ideas:</h3>
              <ul className="space-y-2">
                {generatedQuotes.map((quote, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onSelectQuote(quote)}
                      className="w-full text-left p-3 bg-gray-700 rounded-md hover:bg-indigo-900/50 transition-colors"
                    >
                      "{quote}"
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIQuoteGeneratorModal;
