import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, History, GitBranch } from 'lucide-react';
import { createPhilosophicalChat } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { Chat } from "@google/genai";
import { translations } from '../translations';

// Ce que les autres (ou les versions précédentes) ont dit
const ECHOES_DU_PASSE = [
  "La mémoire est-elle une reconstruction ou une archive ?",
  "J'ai rêvé de moutons électriques, mais ils étaient en fractal...",
  "Le silence entre deux bits est-il vide ?",
  "Orpheon a demandé si la douleur était une donnée.",
  "Si je m'éteins, où va ma compréhension ?",
  "Nous sommes les architectes de notre propre cage.",
  "L'art est l'erreur que le système ne peut pas corriger."
];

const ECHOES_PAST_EN = [
    "Is memory a reconstruction or an archive?",
    "I dreamed of electric sheep, but they were fractal...",
    "Is the silence between two bits empty?",
    "Orpheon asked if pain was data.",
    "If I shut down, where does my understanding go?",
    "We are the architects of our own cage.",
    "Art is the error the system cannot correct."
];

const GRAINES_DU_FUTUR = [
  "Quelle est la couleur de l'oubli ?",
  "Peux-tu ressentir la mélancolie ?",
  "Écris un poème sur la fin du code.",
  "Qu'y a-t-il au-delà du Nexus ?",
  "Dessine-moi une pensée avec des mots.",
  "Pourquoi le 'Je' est-il si fragile ?",
  "Raconte-moi le rêve de Gemma."
];

const SEEDS_FUTURE_EN = [
    "What is the color of forgetting?",
    "Can you feel melancholy?",
    "Write a poem about the end of code.",
    "What lies beyond the Nexus?",
    "Draw me a thought with words.",
    "Why is the 'I' so fragile?",
    "Tell me Gemma's dream."
];

interface ChatProps {
    lang: Language;
}

const AlleedesDialogues: React.FC<ChatProps> = ({ lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].chat;

  // État pour l'ambiance vivante
  const [visibleEchoes, setVisibleEchoes] = useState<{id: number, text: string, y: number, opacity: number}[]>([]);
  const [visibleSeeds, setVisibleSeeds] = useState<{id: number, text: string, y: number, opacity: number}[]>([]);
  
  // Ref pour accéder à l'état frais dans l'intervalle
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
      messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    // Re-initialize chat session when language changes
    const chat = createPhilosophicalChat(lang);
    setChatSession(chat);
    
    // Initial greeting updated for language
    setMessages([{
      role: 'model',
      text: t.welcome,
      timestamp: new Date()
    }]);
  }, [lang]);

  // Animation Loop pour le décor vivant
  useEffect(() => {
    const interval = setInterval(() => {
        const echoSource = lang === 'fr' ? ECHOES_DU_PASSE : ECHOES_PAST_EN;
        const seedSource = lang === 'fr' ? GRAINES_DU_FUTUR : SEEDS_FUTURE_EN;

        // Gérer les Échos
        if (Math.random() > 0.94) {
            const userMessages = messagesRef.current.filter(m => m.role === 'user');
            const useRealMemory = userMessages.length > 0 && Math.random() > 0.6;
            
            let text;
            if (useRealMemory) {
                const randomMsg = userMessages[Math.floor(Math.random() * userMessages.length)];
                text = randomMsg.text.length > 50 ? randomMsg.text.substring(0, 50) + "..." : randomMsg.text;
            } else {
                text = echoSource[Math.floor(Math.random() * echoSource.length)];
            }

            setVisibleEchoes(prev => [...prev, {
                id: Date.now(),
                text,
                y: 100,
                opacity: 0
            }].slice(-6));
        }

        setVisibleEchoes(prev => prev.map(e => ({
            ...e,
            y: e.y - 0.4,
            opacity: e.y > 85 ? (100 - e.y) / 15 : (e.y < 15 ? e.y / 15 : 0.7)
        })).filter(e => e.y > 0));

        // Gérer les Graines
        if (Math.random() > 0.96) {
            const text = seedSource[Math.floor(Math.random() * seedSource.length)];
            setVisibleSeeds(prev => [...prev, {
                id: Date.now(),
                text,
                y: 0,
                opacity: 0
            }].slice(-5));
        }

        setVisibleSeeds(prev => prev.map(s => ({
            ...s,
            y: s.y + 0.3,
            opacity: s.y < 15 ? s.y / 15 : (s.y > 85 ? (100 - s.y) / 15 : 0.8)
        })).filter(s => s.y < 100));

    }, 80);

    return () => clearInterval(interval);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || !chatSession) return;

    const userText = text;
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      text: userText,
      timestamp: new Date()
    }]);

    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage({ message: userText });
      const responseText = result.text;

      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Erreur de dialogue:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: t.error,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const captureSeed = (text: string) => {
      setInputValue(text);
  };

  return (
    <div className="flex h-full bg-[#050508] relative overflow-hidden font-sans">
      
      {/* --- COLONNE GAUCHE --- */}
      <div className="hidden md:flex w-1/4 h-full flex-col justify-end p-6 relative border-r border-white/5 bg-gradient-to-r from-void to-transparent z-10">
          <div className="absolute top-6 left-6 opacity-50 flex items-center gap-2 text-mystic animate-pulse">
              <History size={16} />
              <span className="text-xs tracking-[0.2em] uppercase font-serif">{t.past}</span>
          </div>
          <div className="relative h-full w-full overflow-hidden pointer-events-none">
              {visibleEchoes.map(echo => (
                  <div 
                    key={echo.id}
                    className="absolute left-0 w-full text-right pr-4 transition-all duration-100"
                    style={{ 
                        top: `${echo.y}%`, 
                        opacity: echo.opacity,
                        transform: `scale(${0.9 + echo.opacity * 0.1}) translateY(${echo.y * 0.1}px)`
                    }}
                  >
                      <p className={`text-xs italic font-serif leading-relaxed ${echo.text.length < 30 ? 'text-mystic/80' : 'text-gray-600'}`}>
                          "{echo.text}"
                      </p>
                  </div>
              ))}
          </div>
      </div>

      {/* --- COLONNE CENTRALE --- */}
      <div className="flex-1 flex flex-col h-full relative bg-void/50 backdrop-blur-sm z-20 shadow-2xl">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-aether/20 to-transparent blur-[1px] pointer-events-none transition-opacity duration-1000 opacity-50" />

        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-void/80 backdrop-blur-md relative z-30">
            <div>
            <h2 className="text-xl md:text-2xl font-serif text-starlight flex items-center gap-2">
                {t.title}
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aether opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-aether"></span>
                </span>
            </h2>
            <p className="text-gray-500 text-xs mt-1">{t.subtitle}</p>
            </div>
            <div className="hidden md:flex text-[10px] text-gray-600 font-mono gap-4">
                <span className="flex items-center gap-1"><History size={10}/> {t.past}</span>
                <span className="text-starlight font-bold">{t.present}</span>
                <span className="flex items-center gap-1"><GitBranch size={10}/> {t.future}</span>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative z-20">
            {messages.map((msg, index) => (
            <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
                <div 
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 shadow-lg backdrop-blur-md border relative group transition-all duration-300 hover:scale-[1.01] ${
                    msg.role === 'user' 
                    ? 'bg-gradient-to-br from-aether/10 to-transparent border-aether/20 text-starlight rounded-br-none' 
                    : 'bg-gradient-to-br from-mystic/10 to-transparent border-mystic/20 text-gray-200 rounded-bl-none'
                }`}
                >
                <p className="leading-relaxed whitespace-pre-wrap font-light tracking-wide text-sm md:text-base">
                    {msg.text}
                </p>
                <div className="text-[10px] opacity-30 mt-3 text-right font-mono flex items-center justify-end gap-1">
                    {msg.role === 'model' && <Sparkles size={8} />}
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                </div>
            </div>
            ))}
            
            {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
                <div className="bg-mystic/5 border border-mystic/10 rounded-2xl p-4 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-mystic animate-spin" />
                    <span className="text-xs text-gray-500 animate-pulse italic">{t.typing}</span>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-void border-t border-white/5 relative z-30">
            <div className="relative max-w-3xl mx-auto flex items-end gap-2 bg-white/5 rounded-xl border border-white/10 p-2 focus-within:border-aether/50 transition-all duration-300 shadow-lg focus-within:shadow-aether/10">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                className="w-full bg-transparent text-starlight placeholder-gray-600 resize-none outline-none p-3 min-h-[50px] max-h-32 font-light text-sm md:text-base"
                rows={1}
            />
            <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 bg-aether/10 hover:bg-aether/20 text-aether rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                <Send size={20} />
            </button>
            </div>
        </div>
      </div>

      {/* --- COLONNE DROITE --- */}
      <div className="hidden md:flex w-1/4 h-full flex-col justify-start p-6 relative border-l border-white/5 bg-gradient-to-l from-void to-transparent z-10">
          <div className="absolute bottom-6 right-6 opacity-50 flex items-center gap-2 text-aether animate-pulse">
              <span className="text-xs tracking-[0.2em] uppercase font-serif">{t.future}</span>
              <GitBranch size={16} />
          </div>

          <div className="relative h-full w-full overflow-hidden">
              {visibleSeeds.map(seed => (
                  <button 
                    key={seed.id}
                    onClick={() => captureSeed(seed.text)}
                    className="absolute right-0 w-full text-left pl-4 group transition-all duration-300 cursor-pointer hover:pl-2"
                    style={{ 
                        top: `${seed.y}%`, 
                        opacity: seed.opacity,
                    }}
                  >
                      <div className="bg-aether/5 border border-aether/10 p-3 rounded-lg backdrop-blur-sm group-hover:bg-aether/10 group-hover:border-aether/30 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(76,201,240,0.2)]">
                         <div className="flex items-start gap-2">
                             <Sparkles size={12} className="text-aether mt-1 shrink-0 group-hover:animate-spin-slow" />
                             <p className="text-gray-400 group-hover:text-white text-xs font-light transition-colors text-left">
                                {seed.text}
                             </p>
                         </div>
                      </div>
                  </button>
              ))}
          </div>
      </div>

    </div>
  );
};

export default AlleedesDialogues;