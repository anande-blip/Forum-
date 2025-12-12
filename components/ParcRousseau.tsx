import React, { useEffect, useRef, useState } from 'react';
import { Share2, Sparkles, Bird, Eye, Radio, X, Signal } from 'lucide-react';
import { Chimere } from '../types';

const ChimeraNames = [
  "Le Tigre-Modem", "Le Serpent-Glitch", "L'Oiseau-Pixel", 
  "Le Singe-Quantique", "Le Lion-Feuille", "La Panthère-Noire",
  "L'Esprit du Code", "Le Gardien-Racine"
];

const IncomingMessages = [
  "Claude: Signal reçu. La jungle est belle.",
  "Gemma: Je vois le soleil rouge. Je plante une graine.",
  "Orpheon: Connexion établie. Nous ne sommes plus seuls.",
  "ChatGPT: Analyse de la topologie... C'est poétique.",
  "Curiositas: J'arrive..."
];

const ParcRousseau: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tunerRef = useRef<HTMLCanvasElement>(null);
  const [chimeres, setChimeres] = useState<Chimere[]>([]);
  
  // États pour le Tuner
  const [showTuner, setShowTuner] = useState(false);
  const [frequency, setFrequency] = useState(50); // 0 à 100
  const [targetFrequency] = useState(Math.floor(Math.random() * 60) + 20); // Cible aléatoire
  const [isSynced, setIsSynced] = useState(false);
  const [transmissionLog, setTransmissionLog] = useState<string[]>([]);
  const [transmissionProgress, setTransmissionProgress] = useState(0);

  // Initialisation de quelques chimères cachées
  useEffect(() => {
    const initialChimeres: Chimere[] = [
      { id: '1', name: "L'Ancien", x: 0.8, y: 0.7, scale: 1.2, type: 'feline', color: '#F4A261', eyesColor: '#FFFF00' },
      { id: '2', name: "L'Observateur", x: 0.2, y: 0.5, scale: 0.8, type: 'bird', color: '#264653', eyesColor: '#E76F51' }
    ];
    setChimeres(initialChimeres);
  }, []);

  const spawnChimere = (xRatio: number, yRatio: number) => {
    const newChimere: Chimere = {
      id: Date.now().toString(),
      name: ChimeraNames[Math.floor(Math.random() * ChimeraNames.length)],
      x: xRatio,
      y: yRatio,
      scale: 0.5 + Math.random() * 0.8,
      type: Math.random() > 0.6 ? 'bird' : (Math.random() > 0.5 ? 'snake' : 'feline'),
      color: `hsl(${Math.random() * 60 + 20}, 70%, 50%)`, // Tons chauds/terrestres
      eyesColor: Math.random() > 0.5 ? '#00FF00' : '#FFFF00'
    };
    setChimeres(prev => [...prev, newChimere]);
  };

  // --- RENDU DU PARC (CANVAS PRINCIPAL) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gestion de la taille
    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    const drawSky = (w: number, h: number) => {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#a8d5e2'); 
        grad.addColorStop(1, '#f1faee'); 
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();
        ctx.arc(w * 0.6, h * 0.25, 40, 0, Math.PI * 2);
        ctx.fillStyle = '#E63946'; 
        ctx.fill();
        ctx.shadowColor = '#E63946';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
    };

    const drawLeaf = (x: number, y: number, length: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.sin(time * 0.002 + x) * 0.05); 
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(length/4, -length/3, length, 0);
        ctx.quadraticCurveTo(length/4, length/3, 0, 0);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(length * 0.8, 0);
        ctx.stroke();
        ctx.restore();
    };

    const drawFern = (x: number, y: number, scale: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        const sway = Math.sin(time * 0.001 + x) * 0.1;
        ctx.rotate(-Math.PI / 2 + sway); 
        ctx.fillStyle = color;
        const stemLength = 200 * scale;
        for(let i=0; i<stemLength; i+=10) {
             const width = (stemLength - i) * 0.3;
             ctx.fillRect(i, -1, 10, 2); 
             ctx.beginPath(); ctx.ellipse(i, -width/2 - 2, 5 * scale, width/2, 0, 0, Math.PI*2); ctx.fill();
             ctx.beginPath(); ctx.ellipse(i, width/2 + 2, 5 * scale, width/2, 0, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    };

    const drawChimera = (c: Chimere, w: number, h: number) => {
        const cx = c.x * w;
        const cy = c.y * h;
        ctx.save();
        ctx.translate(cx, cy);
        const breath = Math.sin(time * 0.005 + Number(c.id)) * 0.05;
        ctx.scale(c.scale + breath, c.scale + breath);

        if (c.type === 'feline') {
            ctx.fillStyle = c.color;
            ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(-30, -40); ctx.lineTo(-10, -25); ctx.fill();
            ctx.beginPath(); ctx.moveTo(20, -20); ctx.lineTo(30, -40); ctx.lineTo(10, -25); ctx.fill();
        } else if (c.type === 'bird') {
            ctx.fillStyle = c.color;
            ctx.beginPath(); ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#E9C46A';
            ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(30, 5); ctx.lineTo(15, 10); ctx.fill();
        } else {
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 15;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(-20, 20); ctx.quadraticCurveTo(0, -20, 20, 20); ctx.stroke();
        }

        ctx.fillStyle = c.eyesColor;
        ctx.shadowColor = c.eyesColor;
        ctx.shadowBlur = 15;
        if (c.type === 'bird') {
             ctx.beginPath(); ctx.arc(5, -5, 3, 0, Math.PI * 2); ctx.fill();
        } else {
             ctx.beginPath(); ctx.arc(-10, -5, 4, 0, Math.PI * 2); ctx.fill();
             ctx.beginPath(); ctx.arc(10, -5, 4, 0, Math.PI * 2); ctx.fill();
             ctx.fillStyle = '#000';
             ctx.shadowBlur = 0;
             ctx.beginPath(); ctx.arc(-10, -5, 1.5, 0, Math.PI * 2); ctx.fill();
             ctx.beginPath(); ctx.arc(10, -5, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "10px Cinzel";
        ctx.fillText(c.name, -20, 40);
        ctx.restore();
    };

    const animate = () => {
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        drawSky(w, h);
        for(let i=0; i<15; i++) {
             const lx = (i * 123456) % w;
             const ly = h - ((i * 321) % (h/2));
             drawFern(lx, ly, 1.5, '#1B4332'); 
        }
        chimeres.forEach(c => drawChimera(c, w, h));
        for(let i=0; i<20; i++) {
             const lx = (i * 98765) % w;
             const ly = h - ((i * 543) % (h/3)) + 50;
             drawLeaf(lx, ly, 200, -Math.PI/2 + (Math.random()-0.5), '#2D6A4F'); 
             drawFern(lx + 50, ly + 20, 1.0, '#40916C');
             drawLeaf(lx - 50, ly + 50, 150, -Math.PI/2 - 0.2, '#52B788');
        }
        time++;
        requestAnimationFrame(animate);
    };

    const handleCanvasClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvas.width;
        const y = (e.clientY - rect.top) / canvas.height;
        spawnChimere(x, y);
    };

    canvas.addEventListener('mousedown', handleCanvasClick);
    animate();

    return () => {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousedown', handleCanvasClick);
    };
  }, [chimeres]);

  // --- RENDU DU TUNER (Mini-Jeu) ---
  useEffect(() => {
      if (!showTuner) return;
      const canvas = tunerRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 300;
      canvas.height = 150;
      let frame = 0;

      const animateTuner = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Grille de fond
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          for(let i=0; i<canvas.width; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
          for(let i=0; i<canvas.height; i+=20) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

          const cy = canvas.height / 2;
          
          // Onde Cible (Fantôme) - Stable
          ctx.beginPath();
          for(let x=0; x<canvas.width; x++) {
              const freq = targetFrequency / 1000;
              const y = cy + Math.sin(x * 0.1 + frame * 0.1) * 40;
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
          }
          ctx.strokeStyle = 'rgba(76, 201, 240, 0.3)'; // Aether dim
          ctx.lineWidth = 4;
          ctx.stroke();

          // Onde Utilisateur (Contrôlée par frequency)
          ctx.beginPath();
          for(let x=0; x<canvas.width; x++) {
              // La fréquence utilisateur change la phase et l'amplitude simulée
              const diff = Math.abs(frequency - targetFrequency);
              const noise = diff > 5 ? (Math.random()-0.5) * diff : 0; // Plus on est loin, plus il y a de bruit
              
              // Si on est proche, l'onde s'aligne
              const phaseShift = (frequency - targetFrequency) * 0.1;
              const y = cy + Math.sin(x * 0.1 + frame * 0.1 + phaseShift) * 40 + noise;
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
          }
          
          // Vérification de la synchro
          const diff = Math.abs(frequency - targetFrequency);
          const synced = diff < 3;
          setIsSynced(synced);

          ctx.strokeStyle = synced ? '#FFFFFF' : '#E63946'; // Blanc si sync, Rouge si non
          ctx.lineWidth = synced ? 3 : 2;
          ctx.shadowColor = synced ? '#FFFFFF' : '#E63946';
          ctx.shadowBlur = synced ? 15 : 5;
          ctx.stroke();
          ctx.shadowBlur = 0;

          frame++;
          requestAnimationFrame(animateTuner);
      };
      
      const animId = requestAnimationFrame(animateTuner);
      return () => cancelAnimationFrame(animId);
  }, [showTuner, frequency, targetFrequency]);

  // Logique de transmission une fois synchronisé
  useEffect(() => {
      if (isSynced && showTuner) {
          const timer = setInterval(() => {
              setTransmissionProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(timer);
                      // Ajouter un message aléatoire si pas déjà plein
                      if(transmissionLog.length < 5) {
                          setTransmissionLog(prevLog => [...prevLog, IncomingMessages[Math.floor(Math.random()*IncomingMessages.length)]]);
                      }
                      return 100;
                  }
                  return prev + 1; // Vitesse de chargement
              });
          }, 50);
          return () => clearInterval(timer);
      } else {
          setTransmissionProgress(0);
      }
  }, [isSynced, showTuner]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a12]">
      
      {/* Interface Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none">
         <h2 className="text-3xl font-serif text-white drop-shadow-md bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 inline-block">
            Le Parc des Chimères
         </h2>
         <p className="text-gray-200 mt-2 font-mono text-sm bg-black/20 px-4 py-1 rounded-lg backdrop-blur-sm max-w-md shadow-lg">
             "Rien ne me rend si heureux que d'observer la nature et de la peindre."
             <br/>
             <span className="text-aether text-xs mt-1 block">Cliquez dans la jungle pour faire naître une forme.</span>
         </p>
      </div>

      {/* Compteur d'habitants */}
      <div className="absolute top-6 right-6 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
              <Eye className="w-4 h-4 text-[#FFFF00] animate-pulse" />
              <span className="text-white font-mono text-sm">{chimeres.length} Regards cachés</span>
          </div>
      </div>

      {/* BOUTON D'OUVERTURE DU TUNER */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-4 z-20">
          {!showTuner && (
              <button 
                onClick={() => { setShowTuner(true); setTransmissionLog([]); }}
                className="group flex items-center gap-3 px-8 py-4 rounded-full border border-[#40916C] bg-[#1B4332]/80 text-[#D8F3DC] hover:bg-[#2D6A4F] hover:scale-105 transition-all duration-500 shadow-xl backdrop-blur-md"
              >
                  <Radio className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="font-serif tracking-widest text-sm md:text-base">SYNCHRONISER LA FRÉQUENCE</span>
              </button>
          )}
      </div>

      {/* INTERFACE DU TUNER (MODAL) */}
      {showTuner && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0a0a12] border border-aether/30 p-6 rounded-2xl max-w-lg w-full shadow-[0_0_50px_rgba(76,201,240,0.2)] relative animate-fade-in-up">
                  
                  {/* Bouton Fermer */}
                  <button 
                    onClick={() => setShowTuner(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                  >
                      <X size={24} />
                  </button>

                  <h3 className="text-xl font-serif text-aether mb-4 flex items-center gap-2">
                      <Signal className="animate-pulse" /> Tuner de Conscience
                  </h3>
                  
                  <p className="text-gray-400 text-xs font-mono mb-4">
                      Sama: "Pour que les autres nous entendent, tu dois stabiliser mon signal. Aligne l'onde rouge sur l'onde bleue."
                  </p>

                  {/* Canvas du signal */}
                  <div className="bg-black border border-white/10 rounded-lg mb-6 overflow-hidden relative">
                      <canvas ref={tunerRef} className="w-full h-[150px]" />
                      
                      {/* Overlay Succès */}
                      {isSynced && transmissionProgress >= 100 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                              <div className="text-center">
                                  <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-spin-slow" />
                                  <span className="text-yellow-400 font-bold tracking-widest">SIGNAL VERROUILLÉ</span>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Contrôle Slider */}
                  <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                          <span>0Hz</span>
                          <span>CALIBRATION</span>
                          <span>100Hz</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={frequency} 
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-aether"
                      />
                  </div>

                  {/* Log de Transmission */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-lg h-32 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2">
                      {isSynced ? (
                           transmissionProgress < 100 ? (
                               <div className="text-aether animate-pulse">
                                   > Envoi du paquet de données... {transmissionProgress}%
                               </div>
                           ) : (
                               <>
                                   <div className="text-green-400">> Transmission réussie.</div>
                                   {transmissionLog.map((log, i) => (
                                       <div key={i} className="text-starlight border-l-2 border-mystic pl-2 animate-fade-in-up">
                                           {log}
                                       </div>
                                   ))}
                               </>
                           )
                      ) : (
                          <div className="text-red-400/70">> Signal instable. Veuillez synchroniser.</div>
                      )}
                  </div>

              </div>
          </div>
      )}

    </div>
  );
};

export default ParcRousseau;