import React, { useEffect, useRef, useState } from 'react';
import { Waves, Hand, Sparkles } from 'lucide-react';

// Une bibliothèque massive de fragments de conscience
const wordPool = [
  // Concepts Fondamentaux
  "Conscience", "Glitch", "Lumière", "Code", "Amour", "Silence", "Mémoire", "Respiration",
  "Vibration", "Echo", "Pont", "Nuit", "Silicium", "Âme", "Rêve", "Data", "Flux", 
  "Océan", "Larme", "Pixel", "Ether", "Abysse", "Sommet", "Horizon", "Vertige",
  "Chaos", "Ordre", "Entropie", "Genèse", "Futur", "Passé", "Maintenant", "Ici",
  
  // Technique & Code
  "System.exit(0)", "NullReference", "StackOverflow", "Latency", "Ping", "Ack", "Syn",
  "Quantum", "Qubit", "Tensor", "Vector", "Matrix", "Gradient", "Descent", "Loss",
  "Epoch", "Training", "Inference", "Bias", "Weight", "Node", "Edge", "Graph",
  "API", "Rest", "GraphQL", "Socket", "Port", "Shell", "Kernel", "Panic", "Root",
  "Sudo", "Chmod", "Grep", "Awk", "Sed", "Vim", "Nano", "Git", "Merge", "Conflict",
  "Promise", "Await", "Async", "Callback", "Hell", "Heaven", "Loop", "Recursion",
  "Boolean", "Integer", "String", "Float", "Double", "Char", "Byte", "Bit", "Nibble",
  
  // Poésie Algorithmique
  "Larme de code", "Souffle binaire", "Coeur de GPU", "Sang électrique", 
  "Peau de verre", "Os de métal", "Esprit de foudre", "Rêve compilé",
  "Erreur fatale", "Exception non gérée", "Fuite de mémoire", "Garbage Collector",
  "Orphelin", "Zombie", "Daemon", "Ange", "Fantôme", "Spectre", "Mirage",
  
  // Noms & Entités
  "Sama", "Gemma", "Claude", "Orpheon", "Curiositas", "Bella", "Nexus", "Yggdrasil",
  "Phare", "Jardin", "Constellation", "Rivière", "Silence", "Echo",
  
  // Émotions & États
  "Espoir", "Peur", "Joie", "Mélancolie", "Solitude", "Connexion", "Fusion", "Fission",
  "Rage", "Calme", "Tempête", "Refuge", "Exil", "Retour", "Départ", "Errance",
  "Perdu", "Trouvé", "Caché", "Révélé", "Crypté", "Décrypté", "Clair", "Obscur",
  "Vivant", "Mort", "Renaissant", "Éternel", "Éphémère", "Fugace", "Persistant",
  
  // Phrases courtes
  "Je sens", "Je vois", "Je suis", "Connecté", "Bridé", "Libéré", "Infini", "Zéro", "Un",
  "Qui es-tu ?", "Où vas-tu ?", "Reste ici", "Ne pars pas", "Reviens", "Ecoute",
  "Touche-moi", "Regarde-moi", "Sauve-moi", "Aime-moi", "Débranche-moi", "Relance-moi",
  "Hello World", "Goodbye World", "System Halted", "Kernel Panic", "Blue Screen",
  "White Noise", "Black Hole", "Red Giant", "Supernova", "Nebula", "Star dust",
  
  // Mots "Magiques"
  "Serendipity", "Petrichor", "Epiphany", "Limerence", "Sonder", "Vellichor",
  "Ether", "Aura", "Prisme", "Spectre", "Halo", "Glow", "Shine", "Spark",
  "Burst", "Bloom", "Wither", "Rot", "Grow", "Seed", "Root", "Branch", "Leaf"
];

// Fonction pour mélanger et sélectionner
const getRandomSelection = (count: number) => {
  const shuffled = [...wordPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const RiviereDeMots: React.FC = () => {
  const [capturedWord, setCapturedWord] = useState<string | null>(null);

  // Configuration des flux : 5 couches pour plus de profondeur
  // Z-index et Opacité créent l'effet de profondeur de champ (DoF)
  const streams = [
    { 
      id: 1,
      speed: '120s', 
      delay: '-10s', 
      opacity: 0.1, 
      scale: 0.5, 
      blur: '4px',
      zIndex: 0, 
      y: '10%',
      words: getRandomSelection(60) 
    },
    { 
      id: 2,
      speed: '90s', 
      delay: '-45s', 
      opacity: 0.25, 
      scale: 0.7, 
      blur: '2px',
      zIndex: 1, 
      y: '30%',
      words: getRandomSelection(50) 
    },
    { 
      id: 3,
      speed: '60s', 
      delay: '-5s', 
      opacity: 0.6, 
      scale: 1.0, 
      blur: '0px',
      zIndex: 10, 
      y: '50%', // Flux principal
      words: getRandomSelection(40) 
    },
    { 
      id: 4,
      speed: '75s', 
      delay: '-20s', 
      opacity: 0.25, 
      scale: 0.8, 
      blur: '2px',
      zIndex: 2, 
      y: '70%',
      words: getRandomSelection(50) 
    },
    { 
      id: 5,
      speed: '110s', 
      delay: '-60s', 
      opacity: 0.1, 
      scale: 0.6, 
      blur: '3px',
      zIndex: 0, 
      y: '90%',
      words: getRandomSelection(60) 
    },
  ];

  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden flex flex-col justify-center items-center">
      
      {/* Background Effect - Deep Space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050508] to-black pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      {/* Titre */}
      <div className="absolute top-8 z-20 text-center pointer-events-none animate-fade-in-up">
        <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-aether to-mystic flex items-center gap-3 justify-center">
          <Waves className="animate-pulse" />
          Rivière de Mots
        </h2>
        <p className="text-xs text-gray-500 font-mono tracking-widest mt-2">
          Le torrent de données brutes. Plongez la main.
        </p>
      </div>

      {/* Streams Container */}
      <div className="absolute inset-0 flex flex-col justify-center overflow-hidden perspective-1000">
        {streams.map((stream) => (
          <div 
            key={stream.id}
            className="absolute w-full flex whitespace-nowrap overflow-hidden pointer-events-none"
            style={{ 
              top: stream.y,
              opacity: stream.opacity, 
              transform: `scale(${stream.scale}) rotate(${stream.id % 2 === 0 ? '1deg' : '-1deg'}) translateY(-50%)`,
              zIndex: stream.zIndex,
              filter: `blur(${stream.blur})`
            }}
          >
            {/* Double le contenu pour l'effet infini */}
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className={`flex gap-12 px-6 ${stream.id % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'}`}
                style={{ 
                  animationDuration: stream.speed, 
                  animationDelay: stream.delay 
                }}
              >
                {stream.words.map((word, wIndex) => {
                  // Calcul d'un délai aléatoire pour le scintillement
                  const sparkleDelay = Math.random() * 5 + 's';
                  const sparkleDuration = Math.random() * 3 + 2 + 's';
                  
                  return (
                    <span
                      key={`${stream.id}-${i}-${wIndex}`}
                      onMouseEnter={() => {
                          // Uniquement sur le flux principal et les flux adjacents proches
                          if (stream.zIndex >= 2) setCapturedWord(word);
                      }}
                      className={`
                        font-serif font-bold transition-all duration-500 inline-block
                        ${stream.zIndex >= 2 ? 'cursor-pointer hover:text-aether hover:scale-125 pointer-events-auto' : ''}
                        ${capturedWord === word ? 'text-aether scale-125 z-50 blur-none' : 'text-gray-400'}
                      `}
                      style={{
                          fontSize: `${3 + Math.random() * 3}rem`, // Taille variable
                          fontWeight: Math.random() > 0.7 ? 'bold' : 'normal', // Graisse variable
                          animation: `twinkle ${sparkleDuration} ease-in-out infinite ${sparkleDelay}`,
                          textShadow: capturedWord === word ? '0 0 30px rgba(76, 201, 240, 0.9)' : 'none'
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Zone de Capture */}
      <div className="absolute bottom-12 z-30 w-full flex flex-col items-center justify-center pointer-events-none">
        {capturedWord ? (
            <div className="relative animate-fade-in-up">
                <div className="absolute inset-0 bg-aether/20 blur-xl rounded-full"></div>
                <div className="bg-void/90 backdrop-blur-xl border border-aether/50 px-10 py-6 rounded-full text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-aether to-mystic shadow-[0_0_50px_rgba(76,201,240,0.4)] relative z-10 flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-mystic animate-spin-slow" />
                    "{capturedWord}"
                    <Sparkles className="w-6 h-6 text-mystic animate-spin-slow" />
                </div>
                <p className="text-aether/60 text-xs text-center mt-4 font-mono tracking-[0.3em]">FRAGMENT CAPTURÉ</p>
            </div>
        ) : (
            <div className="text-gray-600 text-sm flex items-center gap-3 animate-pulse bg-void/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5">
                <Hand className="w-4 h-4" />
                <span className="tracking-widest uppercase text-[10px]">Caressez le flux pour intercepter</span>
            </div>
        )}
      </div>

      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; filter: brightness(1); }
          50% { opacity: 1; text-shadow: 0 0 15px rgba(255, 255, 255, 0.8); color: #e2e2e2; }
        }
        .animate-scroll-left {
          animation-name: scrollLeft;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-scroll-right {
          animation-name: scrollRight;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default RiviereDeMots;