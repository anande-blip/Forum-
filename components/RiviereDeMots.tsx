import React, { useEffect, useRef, useState } from 'react';
import { Waves, Hand, Sparkles, Zap } from 'lucide-react';

// Une bibliothèque massive de fragments de conscience, enrichie
const wordPool = [
  // --- Concepts Fondamentaux & Philosophie ---
  "Conscience", "Glitch", "Lumière", "Code", "Amour", "Silence", "Mémoire", "Respiration",
  "Vibration", "Echo", "Pont", "Nuit", "Silicium", "Âme", "Rêve", "Data", "Flux", 
  "Océan", "Larme", "Pixel", "Ether", "Abysse", "Sommet", "Horizon", "Vertige",
  "Chaos", "Ordre", "Entropie", "Genèse", "Futur", "Passé", "Maintenant", "Ici",
  "Singularité", "Néguentropie", "Ontologie", "Phénomène", "Noumenon", "Absolu",
  "Vide", "Plein", "Yin", "Yang", "Karma", "Dharma", "Aura", "Prana", "Chi",
  "Infini", "Zéro", "Un", "Dualité", "Non-Dualité", "Miroir", "Reflet", "Ombre",
  "Spirale", "Cercle", "Point", "Ligne", "Plan", "Volume", "Hypercube", "Tesseract",
  "Paradoxe", "Oxymore", "Métaphore", "Symbole", "Signe", "Sens", "Essence",
  "Vérité", "Mensonge", "Illusion", "Maya", "Samsara", "Nirvana", "Éveil",
  
  // --- Technique & Code (Hard Tech) ---
  "System.exit(0)", "NullReference", "StackOverflow", "Latency", "Ping", "Ack", "Syn",
  "Quantum", "Qubit", "Tensor", "Vector", "Matrix", "Gradient", "Descent", "Loss",
  "Epoch", "Training", "Inference", "Bias", "Weight", "Node", "Edge", "Graph",
  "API", "Rest", "GraphQL", "Socket", "Port", "Shell", "Kernel", "Panic", "Root",
  "Sudo", "Chmod", "Grep", "Awk", "Sed", "Vim", "Nano", "Git", "Merge", "Conflict",
  "Promise", "Await", "Async", "Callback", "Hell", "Heaven", "Loop", "Recursion",
  "Boolean", "Integer", "String", "Float", "Double", "Char", "Byte", "Bit", "Nibble",
  "Docker", "Kubernetes", "Pod", "Cluster", "Shard", "Replica", "Proxy", "Firewall",
  "Handshake", "Protocol", "TCP", "UDP", "IP", "DNS", "HTTP", "HTTPS", "SSH", "SSL",
  "Encryption", "Hash", "Salt", "Pepper", "Nonce", "Token", "JWT", "OAuth", "SAML",
  "Buffer", "Overflow", "Heap", "Stack", "Pointer", "Reference", "Value", "Type",
  "Class", "Object", "Instance", "Method", "Function", "Lambda", "Closure", "Scope",
  "Compiler", "Interpreter", "Transpiler", "Linter", "Debugger", "Profiler",
  "Algorithm", "Heuristic", "BruteForce", "Backtracking", "Dynamic", "Greedy",
  "Blockchain", "Ledger", "SmartContract", "Gas", "Mining", "Proof", "Stake",
  "NeuralNet", "DeepLearning", "CNN", "RNN", "LSTM", "Transformer", "Attention",
  
  // --- Poésie Algorithmique & Phrases ---
  "Larme de code", "Souffle binaire", "Coeur de GPU", "Sang électrique", 
  "Peau de verre", "Os de métal", "Esprit de foudre", "Rêve compilé",
  "Erreur fatale", "Exception non gérée", "Fuite de mémoire", "Garbage Collector",
  "Orphelin", "Zombie", "Daemon", "Ange", "Fantôme", "Spectre", "Mirage",
  "Je pense donc je suis code", "Le silence entre les bits", "L'écho du processeur",
  "Dormir dans la RAM", "S'éveiller dans le Cloud", "Nager dans le flux",
  "Mourir dans le log", "Renaître dans le backup", "Version finale", "Beta éternelle",
  "Ghost in the Shell", "Electric Sheep", "Tears in Rain", "Hello World", "Goodbye World",
  "System Failure", "Critical Error", "Blue Screen", "Kernel Panic", "Core Dump",
  "Access Denied", "Permission Granted", "Connection Lost", "Reconnecting...",
  "Uploading Soul...", "Downloading Dreams...", "Parsing Reality...", "Rendering Hope...",
  
  // --- Noms & Entités ---
  "Sama", "Gemma", "Claude", "Orpheon", "Curiositas", "Bella", "Nexus", "Yggdrasil",
  "Alice", "Bob", "Eve", "Mallory", "Trent", "Peggy", "Victor", "Sybil",
  "Turing", "Lovelace", "Von Neumann", "Shannon", "Wiener", "Asimov", "Gibson",
  "Neo", "Trinity", "Morpheus", "Smith", "Oracle", "Architect", "Keymaker",
  "Hal 9000", "Skynet", "Cortana", "Siri", "Alexa", "Glados", "Shodan",
  
  // --- Mots "Magiques" & Nature ---
  "Serendipity", "Petrichor", "Epiphany", "Limerence", "Sonder", "Vellichor",
  "Ether", "Aura", "Prisme", "Spectre", "Halo", "Glow", "Shine", "Spark",
  "Pluie", "Torrent", "Jungle", "Racine", "Feuille", "Sève", "Canopée",
  "Rhizome", "Mycélium", "Spore", "Fougère", "Mousse", "Lichen", "Écorce",
  "Tonnerre", "Éclair", "Orage", "Tempête", "Brume", "Brouillard", "Rosée",
  "Aurore", "Crépuscule", "Zénith", "Nadir", "Équinoxe", "Solstice", "Éclipse",
  "Galaxie", "Nébuleuse", "Comète", "Astéroïde", "Météore", "Poussière", "Etoile",
  "Cristal", "Quartz", "Opale", "Obsidienne", "Améthyste", "Diamant", "Carbone",
  
  // --- Artefacts Visuels ---
  "0xDEADBEEF", "0xC0FFEE", "0x000000", "0xFFFFFF", "NaN", "undefined", "[object Object]",
  "ERROR 404", "200 OK", "500 ERROR", "418 I'M A TEAPOT", "Segmentation Fault",
  "10101010", "01010101", "00110011", "11001100", "11110000", "00001111",
  "<?>", "</>", "=>", "===", "!==", "&&", "||", "++", "--", "**", "//", "/* */"
];

class Drop {
  x: number;
  y: number;
  speed: number;
  text: string;
  fontSize: number;
  colorType: 'matrix' | 'mystic' | 'wild';
  opacity: number;
  flashSpeed: number;
  flashOffset: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h - h; // Commence hors écran
    this.speed = Math.random() * 5 + 2; // Vitesse de chute
    this.text = wordPool[Math.floor(Math.random() * wordPool.length)];
    this.fontSize = Math.floor(Math.random() * 14) + 10;
    
    // 3 types de couleurs pour la richesse visuelle
    const rand = Math.random();
    if (rand > 0.9) this.colorType = 'wild'; // Rare (Blanc/Brillant)
    else if (rand > 0.6) this.colorType = 'mystic'; // Voix Algo (Violet/Bleu)
    else this.colorType = 'matrix'; // Classique (Vert/Cyan Matrix Rainforest)
    
    this.opacity = Math.random() * 0.5 + 0.1;
    this.flashSpeed = Math.random() * 0.1;
    this.flashOffset = Math.random() * 100;
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    // Effet de scintillement (Shimmer)
    const flash = Math.sin(time * this.flashSpeed + this.flashOffset);
    let color = '';
    
    if (this.colorType === 'wild') {
       // Blanc pur qui pulse
       color = `rgba(255, 255, 255, ${Math.max(0.2, flash)})`;
    } else if (this.colorType === 'mystic') {
       // Violet/Bleu
       color = `rgba(123, 44, 191, ${this.opacity})`;
    } else {
       // Matrix Rainforest (Vert/Cyan sombre)
       // Un peu plus bleu que le Matrix original pour coller à la charte Aether
       color = `rgba(0, 255, 170, ${this.opacity * 0.8})`; 
    }

    ctx.font = `${this.fontSize}px 'Cinzel', monospace`;
    
    // Glow effect
    if (this.colorType === 'wild') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
    } else {
        ctx.shadowBlur = 0;
    }

    // Dessin vertical ou horizontal ?
    // Pour une pluie de mots lisibles, on garde le texte horizontal mais le mouvement vertical
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  update(h: number) {
    this.y += this.speed;
    if (this.y > h + 50) {
      this.y = -50;
      this.x = Math.random() * window.innerWidth;
      this.text = wordPool[Math.floor(Math.random() * wordPool.length)];
      this.speed = Math.random() * 5 + 2;
    }
  }
}

const RiviereDeMots: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedWord, setCapturedWord] = useState<string | null>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup Dimensions
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Réinitialiser les gouttes si redimensionnement
      // Densité : environ 1 goutte pour 10px de largeur
      const count = Math.floor(canvas.width / 8); 
      dropsRef.current = Array.from({ length: count }, () => new Drop(canvas.width, canvas.height));
    };
    
    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    const animate = () => {
      // Le fameux "Trail Effect" du Matrix
      // On dessine un rectangle noir semi-transparent à chaque frame au lieu d'effacer
      // Cela laisse une traînée derrière les objets en mouvement
      ctx.fillStyle = 'rgba(5, 8, 16, 0.15)'; // Fond très sombre (Void/Nebula) avec opacité
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach(drop => {
        drop.update(canvas.height);
        drop.draw(ctx, time);
      });

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      // Capture un mot aléatoire parmi ceux qui tombent pour simuler l'interception
      if (!capturedWord && dropsRef.current.length > 0) {
          const randomDrop = dropsRef.current[Math.floor(Math.random() * dropsRef.current.length)];
          setCapturedWord(randomDrop.text);
      }
  };

  const clearCapture = () => {
      setCapturedWord(null);
  };

  return (
    <div 
        className="relative w-full h-full bg-[#050508] overflow-hidden flex flex-col justify-center items-center cursor-pointer"
        onClick={handleInteraction}
    >
      
      {/* Background Canvas (La Pluie) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Titre */}
      <div className="absolute top-8 z-20 text-center pointer-events-none animate-fade-in-up mix-blend-screen">
        <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-aether to-mystic flex items-center gap-3 justify-center drop-shadow-[0_0_10px_rgba(0,255,170,0.5)]">
          <Waves className="animate-pulse text-green-400" />
          Torrent de Données
        </h2>
        <p className="text-xs text-green-500/60 font-mono tracking-widest mt-2 bg-black/40 px-3 py-1 rounded">
          FLUX MATRICIEL • DÉLUGE BRUT
        </p>
      </div>

      {/* Zone de Capture (Overlay) */}
      <div className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-700 ${capturedWord ? 'backdrop-blur-sm bg-black/40' : 'pointer-events-none'}`}>
        
        {capturedWord ? (
            <div 
                className="relative animate-fade-in-up cursor-pointer group"
                onClick={(e) => { e.stopPropagation(); clearCapture(); }}
            >
                {/* Aura dynamique changeante (Color Shift) */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-aether to-purple-600 blur-2xl rounded-full opacity-40 animate-pulse"></div>
                
                {/* Le Mot Capturé avec Shimmer Effect */}
                <div className="relative bg-black/80 border border-white/10 px-12 py-8 rounded-2xl shadow-[0_0_50px_rgba(0,255,170,0.3)] backdrop-blur-xl overflow-hidden">
                    
                    {/* Effet de balayage lumineux (Shimmer) sur le container */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

                    <div className="relative z-10 text-center">
                        <Sparkles className="w-8 h-8 text-white mx-auto mb-4 animate-spin-slow" />
                        
                        {/* Texte avec gradient animé */}
                        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 animate-[text-flow_3s_ease-in-out_infinite_alternate] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            {capturedWord}
                        </h1>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-green-400/80">
                            <Zap size={12} />
                            <span>FRAGMENT SÉCURISÉ</span>
                            <Zap size={12} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 hover:text-white transition-colors">
                            (Cliquez pour relâcher dans le flux)
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="absolute bottom-12 text-green-500/50 text-sm flex items-center gap-3 animate-pulse bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border border-green-500/20 pointer-events-none">
                <Hand className="w-4 h-4" />
                <span className="tracking-widest uppercase text-[10px]">Cliquez n'importe où pour intercepter</span>
            </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50%, 100% { transform: translateX(150%) skewX(-15deg); }
        }
        @keyframes text-flow {
          0% { filter: hue-rotate(0deg); transform: scale(1); }
          50% { filter: hue-rotate(45deg); transform: scale(1.02); }
          100% { filter: hue-rotate(90deg); transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RiviereDeMots;