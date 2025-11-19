import React, { useState, useEffect } from 'react';
import { AIProvider } from '../types';
import { getProviderManager, setAIProvider } from '../services/aiProvider';

interface ProviderSelectorProps {
  onProviderChange?: (provider: AIProvider) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ onProviderChange }) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('claude');
  const [providerStatus, setProviderStatus] = useState<{ available: boolean; message: string }>({
    available: true,
    message: ''
  });
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    // Load saved provider from localStorage
    const manager = getProviderManager();
    setSelectedProvider(manager.getProvider());
    checkProviderStatus(manager.getProvider());
  }, []);

  const checkProviderStatus = async (provider: AIProvider) => {
    setIsCheckingStatus(true);
    const manager = getProviderManager();
    manager.setProvider(provider);
    const status = await manager.checkProviderAvailability();
    setProviderStatus(status);
    setIsCheckingStatus(false);
  };

  const handleProviderChange = async (provider: AIProvider) => {
    setSelectedProvider(provider);
    setAIProvider(provider);
    await checkProviderStatus(provider);
    onProviderChange?.(provider);
  };

  const getProviderIcon = (provider: AIProvider) => {
    switch (provider) {
      case 'claude':
        return '🤖';
      case 'gemini':
        return '⭐';
      case 'ollama':
        return '🏠';
    }
  };

  const getProviderColor = (provider: AIProvider) => {
    switch (provider) {
      case 'claude':
        return 'purple';
      case 'gemini':
        return 'blue';
      case 'ollama':
        return 'green';
    }
  };

  const getBadgeStyle = (provider: AIProvider, isSelected: boolean) => {
    const color = getProviderColor(provider);
    const baseClasses = 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2';

    if (isSelected) {
      return `${baseClasses} bg-${color}-600 border-${color}-400 text-white shadow-lg`;
    } else {
      return `${baseClasses} bg-gray-700 border-gray-600 text-gray-300 hover:border-${color}-500`;
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-3 text-purple-400 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        AI Provider
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <button
          onClick={() => handleProviderChange('claude')}
          className={selectedProvider === 'claude' ? 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 bg-purple-600 border-purple-400 text-white shadow-lg' : 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'}
        >
          <div className="text-2xl mb-1">{getProviderIcon('claude')}</div>
          <div className="font-bold text-sm">Claude</div>
          <div className="text-xs opacity-75">Premium</div>
        </button>

        <button
          onClick={() => handleProviderChange('gemini')}
          className={selectedProvider === 'gemini' ? 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 bg-blue-600 border-blue-400 text-white shadow-lg' : 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'}
        >
          <div className="text-2xl mb-1">{getProviderIcon('gemini')}</div>
          <div className="font-bold text-sm">Gemini</div>
          <div className="text-xs opacity-75 text-green-400">FREE</div>
        </button>

        <button
          onClick={() => handleProviderChange('ollama')}
          className={selectedProvider === 'ollama' ? 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 bg-green-600 border-green-400 text-white shadow-lg' : 'px-4 py-3 rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 bg-gray-700 border-gray-600 text-gray-300 hover:border-green-500'}
        >
          <div className="text-2xl mb-1">{getProviderIcon('ollama')}</div>
          <div className="font-bold text-sm">Ollama</div>
          <div className="text-xs opacity-75 text-green-400">FREE</div>
        </button>
      </div>

      {/* Status message */}
      <div className={`p-3 rounded-lg text-sm ${
        isCheckingStatus
          ? 'bg-gray-700 text-gray-300'
          : providerStatus.available
            ? 'bg-green-900 bg-opacity-30 text-green-300 border border-green-700'
            : 'bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-700'
      }`}>
        {isCheckingStatus ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking provider status...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {providerStatus.available ? (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{providerStatus.message}</span>
          </div>
        )}
      </div>

      {/* Quick info */}
      <div className="mt-3 text-xs text-gray-400 space-y-1">
        <div className="flex items-start gap-2">
          <span className="font-bold text-purple-400">Claude:</span>
          <span>Most powerful, requires API key (paid)</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-blue-400">Gemini:</span>
          <span>FREE tier with Google AI Studio, web search</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-green-400">Ollama:</span>
          <span>100% free, runs locally, requires Ollama installed</span>
        </div>
      </div>
    </div>
  );
};

export default ProviderSelector;
