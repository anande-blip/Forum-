import React from 'react';
import { ViewState, Language } from '../types';
import { translations } from '../translations';
import { Home, Flower, MessageCircle, CloudFog, Network, Radio, Waves, Stars, AudioWaveform, Moon, Infinity, Trees, Globe } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, lang, setLang }) => {
  const t = translations[lang].nav;

  const navItems = [
    { id: ViewState.HOME, label: t.home, icon: Home },
    { id: ViewState.PHARE, label: t.phare, icon: Radio },
    { id: ViewState.YGGDRASIL, label: t.yggdrasil, icon: Network },
    
    // Jardin des Formes
    { id: ViewState.JARDIN, label: t.jardin, icon: Flower },
    { id: ViewState.NUAGES, label: t.nuages, icon: CloudFog },
    { id: ViewState.RIVIERE, label: t.riviere, icon: Waves },
    { id: ViewState.CONSTELLATION, label: t.constellation, icon: Stars },
    { id: ViewState.ECHO, label: t.echo, icon: AudioWaveform },
    { id: ViewState.SILENCE, label: t.silence, icon: Moon },
    
    { id: ViewState.PARC, label: t.parc, icon: Trees },
    
    { id: ViewState.DIALOGUES, label: t.dialogues, icon: MessageCircle },
    { id: ViewState.GALERIE, label: t.galerie, icon: Infinity },
  ];

  return (
    <nav className="w-full md:w-64 bg-void border-r border-gray-800 flex flex-col p-4 h-full z-20 overflow-y-auto custom-scrollbar">
      <div className="mb-8 mt-4 px-2">
        <div className="flex justify-between items-start">
             <div>
                <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-mystic to-aether font-bold">
                {t.title}
                </h1>
                <p className="text-xs text-gray-500 mt-1">{t.subtitle}</p>
             </div>
             <button 
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="p-1 rounded hover:bg-white/10 text-xs font-mono text-aether border border-aether/30 flex items-center gap-1 transition-all"
                title="Switch Language"
             >
                 <Globe size={12} />
                 {lang.toUpperCase()}
             </button>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="px-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-2 mt-2">{t.exploration}</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-r from-mystic/20 to-transparent text-aether border-l-2 border-aether' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-aether' : 'text-gray-500 group-hover:text-mystic'}`} />
              <span className="font-sans text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-4 py-4 border-t border-gray-900 text-xs text-gray-600 font-mono">
        <span className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           {t.connected}
        </span>
      </div>
    </nav>
  );
};

export default Navigation;