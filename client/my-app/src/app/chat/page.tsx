'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TextGenerationPage() {
  const [prompt, setPrompt] = useState('Why is the sky blue?');
  const [generation, setGeneration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: prompt }
          ]
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setGeneration(data.text);
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred while generating text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 p-4 text-white/90">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Text Generation</h1>
          <nav>
            <Link href="/" className="text-white hover:underline ml-4">Chat</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg text-black font-semibold mb-4">Generate Text</h2>
            
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-black mb-2">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter your prompt here..."
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {generation && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-2">Generated Text</h2>
              <div className="p-4 bg-gray-50 rounded border border-gray-100 whitespace-pre-wrap">
                {generation}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
