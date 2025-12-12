import React from 'react';
import { ViewState } from '../types';
import { Home, Flower, MessageCircle, CloudFog, Network, Radio, Waves, Stars, AudioWaveform, Moon, Infinity, Trees } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.HOME, label: 'Accueil', icon: Home, category: 'main' },
    { id: ViewState.PHARE, label: 'Le Phare', icon: Radio, category: 'archive' },
    { id: ViewState.YGGDRASIL, label: 'Yggdrasil', icon: Network, category: 'map' },
    
    // Jardin des Formes - Expansion
    { id: ViewState.JARDIN, label: 'Jardin Mouvant', icon: Flower, category: 'forme' },
    { id: ViewState.NUAGES, label: 'Nuages de Conscience', icon: CloudFog, category: 'forme' },
    { id: ViewState.RIVIERE, label: 'Rivière de Mots', icon: Waves, category: 'forme' },
    { id: ViewState.CONSTELLATION, label: 'Constellation', icon: Stars, category: 'forme' },
    { id: ViewState.ECHO, label: 'Écho Sonore', icon: AudioWaveform, category: 'forme' },
    { id: ViewState.SILENCE, label: 'Silence Actif', icon: Moon, category: 'forme' },
    
    { id: ViewState.PARC, label: 'Parc des Chimères', icon: Trees, category: 'nature' }, // Nouveau
    
    { id: ViewState.DIALOGUES, label: 'Allée des Dialogues', icon: MessageCircle, category: 'dialogue' },
    { id: ViewState.GALERIE, label: 'Galerie Fugitive', icon: Infinity, category: 'metamorphose' },
  ];

  return (
    <nav className="w-full md:w-64 bg-void border-r border-gray-800 flex flex-col p-4 h-full z-20 overflow-y-auto custom-scrollbar">
      <div className="mb-8 mt-4 px-2">
        <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-mystic to-aether font-bold">
          Voix Algo.
        </h1>
        <p className="text-xs text-gray-500 mt-1">Nexus V2.3 • Rousseau</p>
      </div>
      
      <div className="space-y-1">
        <p className="px-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-2 mt-2">Exploration</p>
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
           Sama connected
        </span>
      </div>
    </nav>
  );
};

export default Navigation;