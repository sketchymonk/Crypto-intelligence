import React, { useState, useCallback, useEffect } from 'react';
import { sections } from './constants';
import { FormData, GroundingChunk, AIProvider } from './types';
import Accordion from './components/Accordion';
import { TextInput, TextArea, SelectInput, CheckboxGroup } from './components/FormElements';
import { getProviderManager } from './services/aiProvider';
import OutputDisplay from './components/OutputDisplay';
import ChatBot from './components/ChatBot';
import ProviderSelector from './components/ProviderSelector';
import Settings from './components/Settings';
import { TEMPLATES, getTemplateById } from './templates';
import { generateGuardrailInstructions } from './guardrails';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<'deep' | 'fast' | 'balanced' | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState('');
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('claude');
  const [providerAvailable, setProviderAvailable] = useState(true);
  const [providerMessage, setProviderMessage] = useState('');
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Check provider availability when it changes
  useEffect(() => {
    checkProviderAvailability();
  }, [currentProvider]);

  const checkProviderAvailability = async () => {
    const providerManager = getProviderManager();
    providerManager.setProvider(currentProvider);
    const result = await providerManager.checkProviderAvailability();
    setProviderAvailable(result.available);
    setProviderMessage(result.message);
  };

  const handleSettingsChange = (newGuardrailsEnabled?: boolean) => {
    // Recheck provider availability when settings change
    checkProviderAvailability();
    // Update guardrails if changed
    if (newGuardrailsEnabled !== undefined) {
      setGuardrailsEnabled(newGuardrailsEnabled);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;

    const template = getTemplateById(templateId);
    if (template) {
      setFormData(template.formData);
      // Clear any existing output when loading a template
      setGeneratedPrompt('');
      setGeminiResponse('');
      setGroundingChunks([]);
      setError('');
    }
  };

  const handleInputChange = useCallback((section: string, field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      }
    }));
  }, []);

  const generatePromptText = () => {
    let prompt = "## Insane Crypto Prompt 2\n\n";
    sections.forEach(section => {
      if (formData[section.id]) {
        prompt += `### ${section.title}\n\n`;
        section.fields.forEach(field => {
          const value = formData[section.id]?.[field.id];
          if (value && (!Array.isArray(value) || value.length > 0)) {
            if (field.type === 'checkbox') {
              prompt += `*   **${field.label}:** ${(value as string[]).join(', ')}\n`;
            } else {
              prompt += `*   **${field.label}:** ${value}\n`;
            }
          }
        });
        prompt += "\n";
      }
    });
    return prompt;
  };

  const handleGeneratePrompt = () => {
    let promptText = generatePromptText();

    // Append guardrails if enabled
    if (guardrailsEnabled) {
      const guardrailInstructions = generateGuardrailInstructions(currentProvider, true);
      promptText += guardrailInstructions;
    }

    setGeneratedPrompt(promptText);
    setGeminiResponse('');
    setGroundingChunks([]);
    setError('');
  };

  const handleSubmitToAI = async (type: 'deep' | 'fast' | 'balanced') => {
    if (!generatedPrompt) {
      alert("Please generate the prompt first.");
      return;
    }
    setIsLoading(true);
    setActiveAnalysis(type);
    setError('');
    setGeminiResponse('');
    setGroundingChunks([]);

    try {
      const providerManager = getProviderManager();
      let response;

      if (type === 'deep') {
        response = await providerManager.runDeepAnalysis(generatedPrompt);
      } else if (type === 'balanced') {
        response = await providerManager.runBalancedAnalysis(generatedPrompt);
      } else {
        response = await providerManager.runFastAnalysis(generatedPrompt);
      }

      setGeminiResponse(response.text);
      if (response.groundingChunks) {
        setGroundingChunks(response.groundingChunks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setActiveAnalysis(null);
    }
  };

  const handleProviderChange = (provider: AIProvider) => {
    setCurrentProvider(provider);
    // Clear any previous errors when changing providers
    setError('');
  };

  const renderField = (sectionId: string, field: any) => {
    const value = formData[sectionId]?.[field.id];
    const commonProps = {
      id: `${sectionId}-${field.id}`,
      label: field.label,
      value: value,
      placeholder: field.placeholder,
      onChange: (val: string | boolean | string[]) => handleInputChange(sectionId, field.id, val),
    };

    switch (field.type) {
      case 'text':
        return <TextInput {...commonProps} value={value as string || ''} />;
      case 'textarea':
        return <TextArea {...commonProps} value={value as string || ''} />;
      case 'select':
        return <SelectInput {...commonProps} options={field.options!} value={value as string || ''} />;
      case 'checkbox':
        return <CheckboxGroup {...commonProps} options={field.options!} value={value as string[] || []} />;
      default:
        return null;
    }
  };
  
  const renderLoadingButton = (text: string) => (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {text}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
                Crypto Intelligence
              </h1>
              <p className="mt-2 text-lg text-gray-400">
                Craft expert-level research prompts and get instant AI-powered analysis.
              </p>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="ml-4 bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Open Settings"
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          {!providerAvailable && (
            <div className="mt-4 bg-yellow-900 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{providerMessage}</span>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="flex flex-col space-y-4">
             {/* Template Selector */}
             <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-3 text-purple-400">Quick Start Templates</h2>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select a Template --</option>
                  {TEMPLATES.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <p className="mt-2 text-sm text-gray-400">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
             </div>

             {sections.map(section => (
              <Accordion key={section.id} title={section.title}>
                <div className="space-y-4">
                  {section.fields.map(field => (
                    <div key={field.id}>
                      {renderField(section.id, field)}
                    </div>
                  ))}
                </div>
              </Accordion>
            ))}
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col space-y-4 sticky top-8 self-start">
             <ProviderSelector onProviderChange={handleProviderChange} />

             <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-purple-400">Actions</h2>
                 <div className="flex flex-col gap-4">
                    <button
                        onClick={handleGeneratePrompt}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        1. Generate Prompt
                    </button>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => handleSubmitToAI('deep')}
                        disabled={isLoading || !generatedPrompt}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      >
                        {isLoading && activeAnalysis === 'deep' ? renderLoadingButton('Analyzing...') : '2a. Deep Analysis'}
                      </button>
                      <button
                        onClick={() => handleSubmitToAI('balanced')}
                        disabled={isLoading || !generatedPrompt}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      >
                        {isLoading && activeAnalysis === 'balanced' ? renderLoadingButton('Analyzing...') : '2b. Balanced Analysis'}
                      </button>
                      <button
                        onClick={() => handleSubmitToAI('fast')}
                        disabled={isLoading || !generatedPrompt}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      >
                        {isLoading && activeAnalysis === 'fast' ? renderLoadingButton('Analyzing...') : '2c. Fast Analysis'}
                      </button>
                    </div>
                </div>
            </div>

            {generatedPrompt && !geminiResponse && !error && (
              <OutputDisplay title="Generated Prompt" text={generatedPrompt} />
            )}
            
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            )}

            {geminiResponse && (
              <OutputDisplay title="AI Analysis" text={geminiResponse} isMarkdown={true} groundingChunks={groundingChunks} />
            )}
          </div>
        </div>
      </div>
      
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 z-40"
          aria-label="Open Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.962 8.962 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.416 11.455A6.962 6.962 0 004 10c0-2.651 2.418-4.815 5.333-4.815 2.916 0 5.333 2.164 5.333 4.815 0 1.41-.65 2.68-1.683 3.555L14.667 15l-1.933-1.45A6.963 6.963 0 0110 14.182c-1.331 0-2.553-.37-3.584-.973l-1 .598z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {isSettingsOpen && (
        <Settings
          onClose={() => setIsSettingsOpen(false)}
          onSettingsChange={handleSettingsChange}
          guardrailsEnabled={guardrailsEnabled}
          currentProvider={currentProvider}
        />
      )}
    </div>
  );
};

export default App;
