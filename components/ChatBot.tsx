import React, { useState, useRef, useEffect } from 'react';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { ChatMessage } from '../types';

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
    setMessages([{ role: 'model', text: 'Hello! How can I help you today?' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let fullResponse = '';
    const modelMessage: ChatMessage = { role: 'model', text: '...' };
    // Add the model message placeholder immediately
    setMessages(prev => [...prev, modelMessage]);

    try {
      const stream = await sendMessageStream(chatRef.current!, userMessage.text);
      let firstChunk = true;
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        if (firstChunk) {
            // Replace placeholder with the start of the actual response
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = fullResponse;
                return newMessages;
            });
            firstChunk = false;
        } else {
            // Update the last message with the appended text
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = fullResponse;
                return newMessages;
            });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'model') {
            lastMsg.text = "Sorry, something went wrong. Please try again.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-full max-w-md h-[70vh] max-h-[600px] bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-700 rounded-t-lg">
        <h3 className="font-bold text-white">Gemini Chat</h3>
        <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl leading-none font-bold">&times;</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
              <p className="text-sm break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-purple-600 text-white px-4 py-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-semibold">
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
