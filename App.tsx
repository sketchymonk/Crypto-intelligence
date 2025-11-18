import React, { useState, useCallback } from 'react';
import { sections } from './constants';
import { FormData, GroundingChunk } from './types';
import Accordion from './components/Accordion';
import { TextInput, TextArea, SelectInput, CheckboxGroup } from './components/FormElements';
import { runDeepAnalysis, runFastAnalysis, runSonnetThinkingAnalysis } from './services/claudeService';
import OutputDisplay from './components/OutputDisplay';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<'deep' | 'fast' | 'sonnet-thinking' | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [error, setError] = useState('');

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
    const promptText = generatePromptText();
    setGeneratedPrompt(promptText);
    setGeminiResponse('');
    setGroundingChunks([]);
    setError('');
  };

  const handleSubmitToAI = async (type: 'deep' | 'fast' | 'sonnet-thinking') => {
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
      let response;
      if (type === 'deep') {
        response = await runDeepAnalysis(generatedPrompt);
      } else if (type === 'sonnet-thinking') {
        response = await runSonnetThinkingAnalysis(generatedPrompt);
      } else {
        response = await runFastAnalysis(generatedPrompt);
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
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
            Insane Crypto Prompt Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Craft expert-level research prompts and get instant AI-powered analysis.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="flex flex-col space-y-4">
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
                        {isLoading && activeAnalysis === 'deep' ? renderLoadingButton('Analyzing...') : '2a. Deep Analysis (Opus + Thinking)'}
                      </button>
                      <button
                        onClick={() => handleSubmitToAI('sonnet-thinking')}
                        disabled={isLoading || !generatedPrompt}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      >
                        {isLoading && activeAnalysis === 'sonnet-thinking' ? renderLoadingButton('Analyzing...') : '2b. Balanced Analysis (Sonnet + Thinking)'}
                      </button>
                      <button
                        onClick={() => handleSubmitToAI('fast')}
                        disabled={isLoading || !generatedPrompt}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      >
                        {isLoading && activeAnalysis === 'fast' ? renderLoadingButton('Analyzing...') : '2c. Fast Analysis (Sonnet)'}
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
    </div>
  );
};

export default App;
