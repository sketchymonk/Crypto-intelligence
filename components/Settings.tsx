import React, { useState, useEffect } from 'react';
import { AIProvider } from '../types';
import * as claudeService from '../services/claudeService';
import * as geminiService from '../services/geminiService';
import * as ollamaService from '../services/ollamaService';
import { getGuardrailDescription } from '../guardrails';

interface SettingsProps {
  onClose: () => void;
  onSettingsChange?: (guardrailsEnabled?: boolean) => void;
  guardrailsEnabled?: boolean;
  currentProvider?: AIProvider;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onSettingsChange, guardrailsEnabled = true, currentProvider = 'claude' }) => {
  const [activeTab, setActiveTab] = useState<AIProvider>(currentProvider);
  const [localGuardrailsEnabled, setLocalGuardrailsEnabled] = useState(guardrailsEnabled);

  // Claude state
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [claudeKeySet, setClaudeKeySet] = useState(false);
  const [claudeMaskedKey, setClaudeMaskedKey] = useState<string | null>(null);

  // Gemini state
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiKeySet, setGeminiKeySet] = useState(false);
  const [geminiMaskedKey, setGeminiMaskedKey] = useState<string | null>(null);

  // Ollama state
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.1:8b');

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkAllKeys();
  }, []);

  const checkAllKeys = () => {
    // Claude
    const hasClaudeKey = claudeService.hasApiKey();
    setClaudeKeySet(hasClaudeKey);
    if (hasClaudeKey) {
      setClaudeMaskedKey(claudeService.getMaskedApiKey());
    }

    // Gemini
    const hasGeminiKey = geminiService.hasApiKey();
    setGeminiKeySet(hasGeminiKey);
    if (hasGeminiKey) {
      setGeminiMaskedKey(geminiService.getMaskedApiKey());
    }

    // Ollama
    const ollamaConfig = ollamaService.getConfig();
    setOllamaBaseUrl(ollamaConfig.baseUrl);
    setOllamaModel(ollamaConfig.model);
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Claude handlers
  const handleSaveClaudeKey = () => {
    if (!claudeApiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }
    if (!claudeApiKey.trim().startsWith('sk-ant-')) {
      alert('Invalid Anthropic API key format. Keys should start with "sk-ant-"');
      return;
    }
    claudeService.saveApiKey(claudeApiKey);
    setClaudeApiKey('');
    checkAllKeys();
    showSuccessToast('Claude API key saved!');
    onSettingsChange?.();
  };

  const handleClearClaudeKey = () => {
    if (confirm('Remove Claude API key?')) {
      claudeService.clearApiKey();
      checkAllKeys();
      showSuccessToast('Claude API key removed');
      onSettingsChange?.();
    }
  };

  // Gemini handlers
  const handleSaveGeminiKey = () => {
    if (!geminiApiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }
    geminiService.saveApiKey(geminiApiKey);
    setGeminiApiKey('');
    checkAllKeys();
    showSuccessToast('Gemini API key saved!');
    onSettingsChange?.();
  };

  const handleClearGeminiKey = () => {
    if (confirm('Remove Gemini API key?')) {
      geminiService.clearApiKey();
      checkAllKeys();
      showSuccessToast('Gemini API key removed');
      onSettingsChange?.();
    }
  };

  // Ollama handlers
  const handleSaveOllamaConfig = () => {
    if (!ollamaBaseUrl.trim()) {
      alert('Please enter a valid base URL');
      return;
    }
    ollamaService.saveConfig(ollamaBaseUrl, ollamaModel);
    showSuccessToast('Ollama configuration saved!');
    onSettingsChange?.();
  };

  const handleClearOllamaConfig = () => {
    if (confirm('Reset Ollama configuration to defaults?')) {
      ollamaService.clearConfig();
      checkAllKeys();
      showSuccessToast('Ollama configuration reset');
      onSettingsChange?.();
    }
  };

  const handleGuardrailsToggle = () => {
    const newValue = !localGuardrailsEnabled;
    setLocalGuardrailsEnabled(newValue);
    onSettingsChange?.(newValue);
    showSuccessToast(`Data guardrails ${newValue ? 'enabled' : 'disabled'}`);
  };

  const renderClaudeTab = () => (
    <div className="space-y-4">
      <div className="bg-blue-900 border border-blue-700 text-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Claude (Anthropic)</h4>
        <p className="text-sm">Premium AI with extended thinking modes. Paid service.</p>
      </div>

      {claudeKeySet ? (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current API Key</p>
                <code className="text-green-400 font-mono">{claudeMaskedKey}</code>
              </div>
              <div className="flex items-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Active</span>
              </div>
            </div>
          </div>
          <button onClick={handleClearClaudeKey} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Remove API Key
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="claude-api-key" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your API Key
            </label>
            <input
              id="claude-api-key"
              type="password"
              value={claudeApiKey}
              onChange={(e) => setClaudeApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveClaudeKey()}
            />
          </div>
          <button onClick={handleSaveClaudeKey} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Save API Key
          </button>
          <p className="text-sm text-gray-400">
            Get your API key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Anthropic Console</a>
          </p>
        </div>
      )}
    </div>
  );

  const renderGeminiTab = () => (
    <div className="space-y-4">
      <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Gemini (Google)</h4>
        <p className="text-sm">FREE tier available! Includes web search grounding.</p>
      </div>

      {geminiKeySet ? (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current API Key</p>
                <code className="text-green-400 font-mono">{geminiMaskedKey}</code>
              </div>
              <div className="flex items-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Active</span>
              </div>
            </div>
          </div>
          <button onClick={handleClearGeminiKey} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Remove API Key
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your API Key (FREE!)
            </label>
            <input
              id="gemini-api-key"
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Your Google AI Studio API key..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveGeminiKey()}
            />
          </div>
          <button onClick={handleSaveGeminiKey} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Save API Key
          </button>
          <p className="text-sm text-gray-400">
            Get your FREE API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">Google AI Studio</a>
          </p>
        </div>
      )}
    </div>
  );

  const renderOllamaTab = () => (
    <div className="space-y-4">
      <div className="bg-orange-900 border border-orange-700 text-orange-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Ollama (Local)</h4>
        <p className="text-sm">100% FREE - runs entirely on your machine!</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="ollama-url" className="block text-sm font-medium text-gray-300 mb-2">
            Base URL
          </label>
          <input
            id="ollama-url"
            type="text"
            value={ollamaBaseUrl}
            onChange={(e) => setOllamaBaseUrl(e.target.value)}
            placeholder="http://localhost:11434"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="ollama-model" className="block text-sm font-medium text-gray-300 mb-2">
            Default Model
          </label>
          <input
            id="ollama-model"
            type="text"
            value={ollamaModel}
            onChange={(e) => setOllamaModel(e.target.value)}
            placeholder="llama3.1:8b"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveOllamaConfig} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Save Configuration
          </button>
          <button onClick={handleClearOllamaConfig} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Reset
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Install Ollama from <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">ollama.com</a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">AI Provider Settings</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors" aria-label="Close settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-900">
          <button
            onClick={() => setActiveTab('claude')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'claude'
                ? 'bg-gray-800 text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Claude (Premium)
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'gemini'
                ? 'bg-gray-800 text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Gemini (FREE)
          </button>
          <button
            onClick={() => setActiveTab('ollama')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'ollama'
                ? 'bg-gray-800 text-orange-400 border-b-2 border-orange-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Ollama (Local)
          </button>
        </div>

        {/* Guardrails Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-850">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Data Freshness Guardrails</h3>
              <p className="text-sm text-gray-400">
                {getGuardrailDescription(currentProvider)}
              </p>
            </div>
            <button
              onClick={handleGuardrailsToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                localGuardrailsEnabled ? 'bg-purple-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={localGuardrailsEnabled}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  localGuardrailsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {localGuardrailsEnabled ? (
              <span className="text-green-400">✓ Enabled - AI will be instructed to prioritize fresh data and verify sources</span>
            ) : (
              <span className="text-gray-400">Disabled - Standard analysis without special data freshness requirements</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'claude' && renderClaudeTab()}
          {activeTab === 'gemini' && renderGeminiTab()}
          {activeTab === 'ollama' && renderOllamaTab()}
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="absolute bottom-4 right-4 bg-green-900 border border-green-700 text-green-200 p-3 rounded-lg flex items-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Security Note */}
        <div className="border-t border-gray-700 p-6 bg-gray-900">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">Security & Privacy</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p>All API keys are stored locally in your browser and never sent to any server except the respective AI provider.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
