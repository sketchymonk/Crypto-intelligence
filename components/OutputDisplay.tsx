import React, { useState } from 'react';
import { GroundingChunk } from '../types';

interface OutputDisplayProps {
  title: string;
  text: string;
  isMarkdown?: boolean;
  groundingChunks?: GroundingChunk[];
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ title, text, isMarkdown = false, groundingChunks }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-purple-400">{title}</h3>
        <button
          onClick={handleCopy}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-md text-sm transition"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            <code>{text}</code>
        </pre>
        {groundingChunks && groundingChunks.length > 0 && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-400 mb-2 font-sans">Sources from Google Search:</h4>
            <ul className="list-disc list-inside space-y-1 font-sans">
              {groundingChunks.map((chunk, index) => (
                chunk.web && chunk.web.uri && (
                  <li key={index} className="truncate">
                    <a 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:underline"
                      title={chunk.web.title || chunk.web.uri}
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
