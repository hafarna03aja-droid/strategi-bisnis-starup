import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { AnalysisResult, ChatMessage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

interface ChatbotProps {
  onClose: () => void;
  analysisResult: AnalysisResult | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, analysisResult }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Halo! Tanyakan apa saja tentang strategi bisnis Anda.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const modelResponse: ChatMessage = { role: 'model', text: '' };
    setMessages(prev => [...prev, modelResponse]);

    try {
      const stream = await sendChatMessage(messageText);
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: text };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'model', text: 'Maaf, saya mengalami kesalahan. Silakan coba lagi.' };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const handleSend = () => {
      handleSendMessage(input);
      setInput('');
  };

  const handleSuggestionClick = (question: string) => {
      handleSendMessage(question);
  };


  return (
    <div className="fixed bottom-24 right-6 left-6 h-[70vh] max-h-[600px] bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 sm:left-auto sm:w-full sm:max-w-md">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Asisten Strategi</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <BotIcon className="w-8 h-8 flex-shrink-0 text-indigo-400" />}
            <div
              className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-lg'
                  : 'bg-gray-700 text-gray-200 rounded-bl-lg'
              }`}
            >
              <p className="text-sm break-words">{msg.text}{isLoading && msg.role === 'model' && index === messages.length -1 && <span className="inline-block w-2 h-2 ml-1 bg-white rounded-full animate-pulse"></span>}</p>
            </div>
            {msg.role === 'user' && <UserIcon className="w-8 h-8 flex-shrink-0 text-gray-300" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700">
        {analysisResult?.suggestedQuestions && messages.length <= 1 && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs text-gray-400 mb-2">Saran Pertanyaan:</p>
            <div className="flex flex-wrap gap-2">
              {analysisResult.suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(q)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-gray-700/80 text-gray-200 rounded-full hover:bg-gray-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ajukan pertanyaan lanjutan..."
              className="w-full bg-gray-900/70 border-gray-600 rounded-full py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;