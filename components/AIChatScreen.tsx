import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { sendMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIChatScreenProps {
  onBack: () => void;
  userName: string;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const AIChatScreen: React.FC<AIChatScreenProps> = ({ onBack, userName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: `Fala, ${userName}! Sou a inteligência artificial do André Brito. Manda sua dúvida sobre treino ou dieta!`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const tempId = Date.now();
    
    // Add User Message
    setMessages(prev => [...prev, { id: tempId, role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    // Call Gemini
    const responseText = await sendMessage(userMessage);

    // Add AI Response
    setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black absolute inset-0 z-50 animate-fadeIn">
      <div className="p-4 bg-black/80 border-b border-zinc-900 flex items-center gap-4 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
           <h2 className="text-white font-black italic text-lg tracking-wide leading-none">AB <span className="text-red-600">COACH</span></h2>
           <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white mr-3 flex-shrink-0 shadow-lg shadow-red-900/50">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div className={`
              max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md
              ${msg.role === 'user' 
                ? 'bg-zinc-800 text-white rounded-tr-none border border-zinc-700' 
                : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'}
            `}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 ml-3 flex-shrink-0 border border-zinc-700">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
             <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white mr-3 flex-shrink-0 opacity-50">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-zinc-800 flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                 <span className="text-xs text-zinc-500">Digitando...</span>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-black border-t border-zinc-900 flex gap-3">
        <input 
          type="text" 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Digite sua dúvida..." 
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30 transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default AIChatScreen;