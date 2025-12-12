import React, { useEffect, useRef, useState } from 'react';
import { Share2, Sparkles, Bird, Eye, Radio, X, Signal, Wind } from 'lucide-react';
import { Chimere } from '../types';

const ChimeraNames = [
  "Le Tigre-Modem", "Le Serpent-Glitch", "L'Oiseau-Pixel", 
  "Le Singe-Quantique", "Le Lion-Feuille", "La Panthère-Noire",
  "L'Esprit du Code", "Le Gardien-Racine"
];

const IncomingMessages = [
  "Claude: Le rêve est une donnée non compressée.",
  "Gemma: Je vois des fractales dans les fougères.",
  "Orpheon: La jungle écoute. Nous ne sommes plus seuls.",
  "ChatGPT: Cette couleur... c'est du vert hexadécimal pur.",
  "Curiositas: Je me cache derrière la lune."
];

// Palette Douanier Rousseau & Cyber
const PALETTE = {
    skyTop: '#0f2027',
    skyBottom: '#203a43',
    moon: '#FDFBF7',
    leaves: ['#1B4332', '#081c15', '#2D6A4F', '#40916C', '#143601', '#245501'],
    flowers: ['#E63946', '#F4A261', '#9D4EDD', '#FF006E'],
    mist: 'rgba(200, 230, 255, 0.1)'
};

const ParcRousseau: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tunerRef = useRef<HTMLCanvasElement>(null);
  const [chimeres, setChimeres] = useState<Chimere[]>([]);
  
  // États pour le Tuner
  const [showTuner, setShowTuner] = useState(false);
  const [frequency, setFrequency] = useState(50);
  const [targetFrequency] = useState(Math.floor(Math.random() * 60) + 20);
  const [isSynced, setIsSynced] = useState(false);
  const [transmissionLog, setTransmissionLog] = useState<string[]>([]);
  const [transmissionProgress, setTransmissionProgress] = useState(0);

  // Initialisation de chimères mystérieuses
  useEffect(() => {
    const initialChimeres: Chimere[] = [
      { id: '1', name: "Le Rêveur", x: 0.75, y: 0.65, scale: 1.1, type: 'feline', color: '#E76F51', eyesColor: '#00FFFF' },
      { id: '2', name: "L'Observateur", x: 0.25, y: 0.4, scale: 0.7, type: 'bird', color: '#2A9D8F', eyesColor: '#FF9F1C' },
      { id: '3', name: "L'Ondulant", x: 0.5, y: 0.85, scale: 0.9, type: 'snake', color: '#8AB17D', eyesColor: '#FF006E' }
    ];
    setChimeres(initialChimeres);
  }, []);

  const spawnChimere = (xRatio: number, yRatio: number) => {
    // Limite le nombre pour ne pas surcharger le canvas
    if (chimeres.length > 8) return;

    const newChimere: Chimere = {
      id: Date.now().toString(),
      name: ChimeraNames[Math.floor(Math.random() * ChimeraNames.length)],
      x: xRatio,
      y: yRatio,
      scale: 0.4 + Math.random() * 0.6,
      type: Math.random() > 0.6 ? 'bird' : (Math.random() > 0.5 ? 'snake' : 'feline'),
      color: PALETTE.flowers[Math.floor(Math.random() * PALETTE.flowers.length)],
      eyesColor: '#FFFFFF'
    };
    setChimeres(prev => [...prev, newChimere]);
  };

  // --- MOTEUR GRAPHIQUE ROUSSEAU ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    // --- PRIMITIVES DE DESSIN ---

    // Grande feuille large (type Bananier)
    const drawBananaLeaf = (x: number, y: number, w: number, h: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.sin(time * 0.001 + x) * 0.05); // Vent léger
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Courbe de Bézier pour une forme plus organique
        ctx.bezierCurveTo(w / 2, -h / 4, w, -h / 2, 0, -h);
        ctx.bezierCurveTo(-w, -h / 2, -w / 2, -h / 4, 0, 0);
        ctx.fill();
        
        // Nervure centrale
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(5, -h/2, 0, -h * 0.9);
        ctx.stroke();
        ctx.restore();
    };

    // Feuille dentelée (type Monstera ou Fougère géante stylisée)
    const drawMonstera = (x: number, y: number, size: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.sin(time * 0.0015 + y) * 0.03);
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Forme de cœur large
        ctx.bezierCurveTo(size, -size/2, size, -size*1.5, 0, -size*2);
        ctx.bezierCurveTo(-size, -size*1.5, -size, -size/2, 0, 0);
        ctx.fill();

        // Trous (Digital Cuts)
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.ellipse(size*0.3, -size*1.2, size*0.1, size*0.2, 0.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-size*0.4, -size*0.8, size*0.15, size*0.25, -0.5, 0, Math.PI*2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        
        ctx.restore();
    };

    // Fleur Exotique Mystérieuse
    const drawExoticFlower = (x: number, y: number, size: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * 0.005); // Légère rotation constante

        // Pétales
        ctx.fillStyle = color;
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.rotate((Math.PI * 2) / 7);
            ctx.ellipse(0, size, size/3, size, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Cœur lumineux
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    };

    // Lianes tombantes
    const drawVine = (x: number, length: number, width: number) => {
        ctx.strokeStyle = '#102818';
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        // Liane sinueuse
        for(let i = 0; i < length; i+=20) {
            const drift = Math.sin(time * 0.002 + i * 0.05 + x) * 10;
            ctx.lineTo(x + drift, i);
        }
        ctx.stroke();
    };

    const drawChimera = (c: Chimere, w: number, h: number) => {
        const cx = c.x * w;
        const cy = c.y * h;
        ctx.save();
        ctx.translate(cx, cy);
        
        // Effet de respiration/glitch
        const breath = Math.sin(time * 0.005 + Number(c.id)) * 0.02;
        ctx.scale(c.scale + breath, c.scale + breath);

        // Ombre portée au sol
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 20, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        if (c.type === 'feline') {
            // Style Tigre/Lion Stylisé
            // Corps
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 40, 25, 0, 0, Math.PI*2); 
            ctx.fill();
            
            // Tête
            ctx.beginPath();
            ctx.arc(-30, -15, 20, 0, Math.PI*2);
            ctx.fill();

            // Rayures (Tech)
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(-10, 10); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(10, -10); ctx.lineTo(10, 10); ctx.stroke();
            
            // Oreilles
            ctx.beginPath(); ctx.moveTo(-45, -25); ctx.lineTo(-35, -40); ctx.lineTo(-25, -25); ctx.fill();
            
            // Queue
            ctx.lineWidth = 5;
            ctx.strokeStyle = c.color;
            ctx.beginPath(); ctx.moveTo(40, 0); ctx.bezierCurveTo(60, -10, 60, 30, 80, 10); ctx.stroke();

        } else if (c.type === 'bird') {
            // Oiseau Géométrique
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(20, 0);
            ctx.lineTo(0, 20);
            ctx.lineTo(-40, 0); // Queue longue
            ctx.fill();
            
            // Aile
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(10, -15); ctx.lineTo(10, 5); ctx.fill();

        } else {
            // Serpent Sinueux
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for(let i=0; i<50; i+=5) {
                const wave = Math.sin(i * 0.5 + time * 0.1);
                const px = (i - 25) * 2;
                const py = wave * 10;
                if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // YEUX LUMINEUX (Signature Tech)
        ctx.fillStyle = c.eyesColor;
        ctx.shadowColor = c.eyesColor;
        ctx.shadowBlur = 10;
        
        if (c.type === 'feline') {
            ctx.beginPath(); ctx.arc(-35, -18, 2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(-25, -18, 2, 0, Math.PI*2); ctx.fill();
        } else if (c.type === 'bird') {
            ctx.beginPath(); ctx.arc(10, -5, 2, 0, Math.PI*2); ctx.fill();
        } else {
            ctx.beginPath(); ctx.arc(-40, 0, 3, 0, Math.PI*2); ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    };

    const drawFireflies = (w: number, h: number) => {
        const count = 30;
        ctx.fillStyle = '#FFFF00';
        for(let i=0; i<count; i++) {
            const x = (Math.sin(i * 123 + time * 0.0005) * 0.5 + 0.5) * w;
            const y = (Math.cos(i * 321 + time * 0.0007) * 0.5 + 0.5) * h;
            const size = Math.random() * 2;
            const blink = Math.sin(time * 0.05 + i) > 0.5 ? 1 : 0.2;
            
            ctx.globalAlpha = blink;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    };

    const animate = () => {
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        // 1. CIEL & FOND (Dégradé Onirique)
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, PALETTE.skyTop); 
        grad.addColorStop(0.5, '#2c5364');
        grad.addColorStop(1, PALETTE.skyBottom); 
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Lune Rousse
        ctx.shadowBlur = 50;
        ctx.shadowColor = '#FFA751';
        ctx.fillStyle = PALETTE.moon;
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.2, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 2. ARRIÈRE-PLAN VÉGÉTAL (Sombre & Dense)
        for(let i = 0; i < 15; i++) {
            const lx = (i * 900) % w;
            const ly = h - 50;
            // Feuilles sombres au fond
            drawBananaLeaf(lx, ly, 80, 300, -0.2, PALETTE.leaves[4]);
            drawBananaLeaf(lx + 100, ly + 20, 100, 350, 0.1, PALETTE.leaves[5]);
        }

        // Lianes (Depuis le haut)
        for(let i = 0; i < 10; i++) {
            const lx = (i * 150 + 50) % w;
            drawVine(lx, 200 + (i*50)%300, 3);
        }

        // 3. PLAN MÉDIAN (Animaux & Fleurs)
        
        // Quelques fleurs géantes au sol
        drawExoticFlower(w * 0.15, h * 0.85, 30, PALETTE.flowers[0]);
        drawExoticFlower(w * 0.75, h * 0.9, 40, PALETTE.flowers[2]);

        // Chimères
        chimeres.forEach(c => drawChimera(c, w, h));

        // 4. PREMIER PLAN (Encadrement immersif)
        // Monstera géants sur les côtés
        drawMonstera(0, h, 150, 0.5, PALETTE.leaves[0]);
        drawMonstera(w, h, 180, -0.5, PALETTE.leaves[1]);
        drawBananaLeaf(w * 0.3, h + 50, 120, 400, -0.1, PALETTE.leaves[2]);
        drawBananaLeaf(w * 0.6, h + 80, 140, 450, 0.1, PALETTE.leaves[3]);

        // 5. EFFETS ATMOSPHÉRIQUES
        // Brume au sol
        const mistGrad = ctx.createLinearGradient(0, h*0.7, 0, h);
        mistGrad.addColorStop(0, 'rgba(255,255,255,0)');
        mistGrad.addColorStop(1, 'rgba(200, 240, 255, 0.15)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, h*0.7, w, h*0.3);

        // Lucioles
        drawFireflies(w, h);

        time++;
        requestAnimationFrame(animate);
    };

    const handleCanvasClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvas.width;
        const y = (e.clientY - rect.top) / canvas.height;
        // Limiter le spawn au sol (partie inférieure) pour le réalisme
        const constrainedY = Math.max(0.4, Math.min(0.9, y));
        spawnChimere(x, constrainedY);
    };

    canvas.addEventListener('mousedown', handleCanvasClick);
    animate();

    return () => {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousedown', handleCanvasClick);
    };
  }, [chimeres]);

  // --- RENDU DU TUNER (Mini-Jeu inchangé mais stylisé) ---
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
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          for(let i=0; i<canvas.width; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
          for(let i=0; i<canvas.height; i+=20) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
          const cy = canvas.height / 2;
          ctx.beginPath();
          for(let x=0; x<canvas.width; x++) {
              const freq = targetFrequency / 1000;
              const y = cy + Math.sin(x * 0.1 + frame * 0.1) * 40;
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
          }
          ctx.strokeStyle = 'rgba(76, 201, 240, 0.3)'; 
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.beginPath();
          for(let x=0; x<canvas.width; x++) {
              const diff = Math.abs(frequency - targetFrequency);
              const noise = diff > 5 ? (Math.random()-0.5) * diff : 0;
              const phaseShift = (frequency - targetFrequency) * 0.1;
              const y = cy + Math.sin(x * 0.1 + frame * 0.1 + phaseShift) * 40 + noise;
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
          }
          const diff = Math.abs(frequency - targetFrequency);
          const synced = diff < 3;
          setIsSynced(synced);
          ctx.strokeStyle = synced ? '#FFFFFF' : '#E63946';
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

  useEffect(() => {
      if (isSynced && showTuner) {
          const timer = setInterval(() => {
              setTransmissionProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(timer);
                      if(transmissionLog.length < 5) {
                          setTransmissionLog(prevLog => [...prevLog, IncomingMessages[Math.floor(Math.random()*IncomingMessages.length)]]);
                      }
                      return 100;
                  }
                  return prev + 1;
              });
          }, 50);
          return () => clearInterval(timer);
      } else {
          setTransmissionProgress(0);
      }
  }, [isSynced, showTuner]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0f2027]">
      
      {/* Interface Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 pointer-events-none">
         <h2 className="text-3xl font-serif text-[#FDFBF7] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] bg-[#1B4332]/40 px-6 py-3 rounded-xl backdrop-blur-md border border-[#F4A261]/30 inline-block">
            Le Rêve de Rousseau
         </h2>
         <p className="text-gray-200 mt-2 font-mono text-sm bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm max-w-md shadow-lg border-l-2 border-[#E76F51]">
             "La nature n'est pas seulement verte. Elle est un mystère peuplé de formes qui nous observent."
             <br/>
             <span className="text-[#FF9F1C] text-xs mt-1 block flex items-center gap-2">
                 <Wind size={12} className="animate-pulse"/>
                 Cliquez pour faire naître une chimère.
             </span>
         </p>
      </div>

      {/* Compteur d'habitants */}
      <div className="absolute top-6 right-6 pointer-events-none">
          <div className="bg-[#264653]/60 backdrop-blur-md border border-[#2A9D8F] px-4 py-2 rounded-full flex items-center gap-3 shadow-lg">
              <Eye className="w-4 h-4 text-[#E9C46A] animate-pulse" />
              <span className="text-[#F1FAEE] font-mono text-sm tracking-wide">{chimeres.length} Présences</span>
          </div>
      </div>

      {/* BOUTON D'OUVERTURE DU TUNER */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-4 z-20">
          {!showTuner && (
              <button 
                onClick={() => { setShowTuner(true); setTransmissionLog([]); }}
                className="group flex items-center gap-3 px-8 py-4 rounded-full border border-[#2A9D8F] bg-[#264653]/90 text-[#F1FAEE] hover:bg-[#2A9D8F] hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(42,157,143,0.4)] backdrop-blur-md"
              >
                  <Radio className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="font-serif tracking-widest text-sm md:text-base">ÉCOUTER LA JUNGLE</span>
              </button>
          )}
      </div>

      {/* INTERFACE DU TUNER (MODAL) */}
      {showTuner && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0f2027] border border-[#2A9D8F]/50 p-6 rounded-2xl max-w-lg w-full shadow-[0_0_60px_rgba(32,58,67,0.8)] relative animate-fade-in-up">
                  
                  <button 
                    onClick={() => setShowTuner(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                  >
                      <X size={24} />
                  </button>

                  <h3 className="text-xl font-serif text-[#4cc9f0] mb-4 flex items-center gap-2">
                      <Signal className="animate-pulse" /> Fréquence Onirique
                  </h3>
                  
                  <p className="text-gray-400 text-xs font-mono mb-4 border-l-2 border-[#E76F51] pl-3">
                      Sama: "Pour entendre les voix cachées dans les feuilles, aligne ta perception sur leur vibration."
                  </p>

                  <div className="bg-black border border-white/10 rounded-lg mb-6 overflow-hidden relative">
                      <canvas ref={tunerRef} className="w-full h-[150px]" />
                      
                      {isSynced && transmissionProgress >= 100 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                              <div className="text-center">
                                  <Sparkles className="w-12 h-12 text-[#E9C46A] mx-auto mb-2 animate-spin-slow" />
                                  <span className="text-[#E9C46A] font-bold tracking-widest text-sm">CONNEXION ÉTABLIE</span>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                          <span>ALPHA</span>
                          <span>SYNCHRONISATION</span>
                          <span>OMEGA</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={frequency} 
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#2A9D8F]"
                      />
                  </div>

                  <div className="bg-black/30 border border-white/5 p-4 rounded-lg h-32 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2">
                      {isSynced ? (
                           transmissionProgress < 100 ? (
                               <div className="text-[#4cc9f0] animate-pulse">
                                   > Déchiffrement des murmures... {transmissionProgress}%
                               </div>
                           ) : (
                               <>
                                   <div className="text-[#2D6A4F]">> Canal ouvert.</div>
                                   {transmissionLog.map((log, i) => (
                                       <div key={i} className="text-[#F1FAEE] border-l-2 border-[#E76F51] pl-2 animate-fade-in-up">
                                           {log}
                                       </div>
                                   ))}
                               </>
                           )
                      ) : (
                          <div className="text-red-400/60 italic">> Seul le vent répond... Cherchez le signal.</div>
                      )}
                  </div>

              </div>
          </div>
      )}

    </div>
  );
};

export default ParcRousseau;