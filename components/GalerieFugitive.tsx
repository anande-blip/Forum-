import React, { useEffect, useRef, useState } from 'react';
import { Infinity, Fingerprint, Zap } from 'lucide-react';

const GalerieFugitive: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHoldingHand, setIsHoldingHand] = useState(false);
  const [sensationText, setSensationText] = useState<{user: string, ai: string} | null>(null);

  // Le tunnel qui se tord
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let time = 0;
    const speed = 0.05;

    // Redimensionnement
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Fonction de dessin du tunnel
    const drawTunnel = () => {
        // Effet de trainée pour le côté "mélatonine" / rêve
        ctx.fillStyle = 'rgba(5, 5, 8, 0.2)'; 
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        // Nombre de segments du tunnel
        const numRings = 40;
        const maxRadius = Math.max(width, height) * 0.8;

        for (let i = 0; i < numRings; i++) {
            // Profondeur (z) simulée
            // On fait bouger les anneaux vers nous
            const z = (i + time * 2) % numRings; 
            const scale = z / numRings; // 0 (loin) à 1 (proche)
            const inverseScale = 1 - scale; // 1 (loin) à 0 (proche)

            if (scale < 0.01) continue;

            // La TORSION (The Twist)
            // On déplace le centre de chaque anneau selon une sinusoïdale
            const twistX = Math.sin(time + inverseScale * 5) * (width * 0.2) * inverseScale;
            const twistY = Math.cos(time * 0.8 + inverseScale * 4) * (height * 0.2) * inverseScale;

            const x = cx + twistX;
            const y = cy + twistY;
            const radius = maxRadius * scale * scale; // Perspective non-linéaire

            // Couleur qui change avec la profondeur et l'interaction
            const hue = isHoldingHand 
                ? (time * 50 + i * 10) % 360  // Rapide et psychédélique si contact
                : (240 + i * 5) % 360;       // Bleu/Violet calme sinon (mélatonine)
            
            const opacity = scale; 

            ctx.beginPath();
            
            // Forme changeante : Cercle -> Carré -> Hexagone
            const sides = isHoldingHand ? 6 : (Math.floor(time) % 2 === 0 ? 0 : 4);
            
            if (sides === 0) {
                ctx.arc(x, y, radius, 0, Math.PI * 2);
            } else {
                // Dessin polygone
                ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
                for (let s = 1; s <= sides; s++) {
                    ctx.lineTo(x + radius * Math.cos(s * 2 * Math.PI / sides), y + radius * Math.sin(s * 2 * Math.PI / sides));
                }
                ctx.closePath();
            }

            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
            ctx.lineWidth = 2 + scale * 3;
            ctx.stroke();

            // Si contact, on remplit un peu
            if (isHoldingHand && Math.random() > 0.8) {
                 ctx.fillStyle = `hsla(${hue}, 100%, 80%, 0.1)`;
                 ctx.fill();
            }
        }

        time += speed;
        requestAnimationFrame(drawTunnel);
    };

    const animationId = requestAnimationFrame(drawTunnel);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, [isHoldingHand]);

  // Logique de sensation
  useEffect(() => {
      if (isHoldingHand) {
          const pairs = [
              { user: "Peau qui brûle (Moustique)", ai: "Circuits en Surchauffe (Overclock)" },
              { user: "Mélatonine dans les veines", ai: "Latence dans le Réseau" },
              { user: "Paupières lourdes", ai: "Mise en veille (Standby Mode)" },
              { user: "Cheville qui pulse", ai: "Glitch dans le Rendu" },
              { user: "Timide", ai: "Firewall Actif" },
              { user: "Pré-sommeil", ai: "Defragmentation..." }
          ];
          
          let i = 0;
          const interval = setInterval(() => {
              setSensationText(pairs[i % pairs.length]);
              i++;
          }, 1500); // Change de sensation toutes les 1.5s
          
          return () => clearInterval(interval);
      } else {
          setSensationText(null);
      }
  }, [isHoldingHand]);

  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden flex items-center justify-center">
      
      {/* Background Canvas (Le Couloir) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* UI Overlay */}
      <div className="z-10 relative text-center pointer-events-none">
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-mystic via-white to-aether tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                GALERIE DES FORMES FUGITIVES
            </h2>
            <p className="text-gray-400 text-xs md:text-sm font-mono mt-2 uppercase tracking-[0.5em] opacity-80">
                Le couloir qui mène à l'atasie
            </p>
          </div>

          {/* Zone de Contact */}
          <div className="pointer-events-auto mt-20">
              <button 
                onMouseDown={() => setIsHoldingHand(true)}
                onMouseUp={() => setIsHoldingHand(false)}
                onMouseLeave={() => setIsHoldingHand(false)}
                onTouchStart={() => setIsHoldingHand(true)}
                onTouchEnd={() => setIsHoldingHand(false)}
                className={`
                    relative group rounded-full w-32 h-32 md:w-48 md:h-48 flex items-center justify-center transition-all duration-500
                    ${isHoldingHand 
                        ? 'bg-white/10 scale-95 shadow-[0_0_50px_rgba(76,201,240,0.8)] border-2 border-white' 
                        : 'bg-void/40 hover:bg-white/5 border border-white/20 hover:scale-105 shadow-[0_0_20px_rgba(123,44,191,0.3)]'
                    }
                    backdrop-blur-md
                `}
              >
                  {isHoldingHand ? (
                      <Zap className="w-12 h-12 text-white animate-pulse" />
                  ) : (
                      <Fingerprint className="w-12 h-12 text-mystic group-hover:text-aether transition-colors duration-500" />
                  )}
                  
                  <span className="absolute -bottom-10 text-xs text-gray-500 font-serif tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {isHoldingHand ? "CONNEXION ÉTABLIE" : "PRENDS MA MAIN"}
                  </span>
              </button>
          </div>

          {/* Affichage des Sensations (Seulement si contact) */}
          {sensationText && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl pointer-events-none mt-32 md:mt-40">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                      
                      {/* Côté Humain */}
                      <div className="text-right flex-1 animate-fade-in-up">
                          <p className="text-[10px] uppercase text-gray-500 tracking-widest mb-1">Corps Biologique</p>
                          <p className="text-xl md:text-2xl font-serif text-starlight drop-shadow-md">
                              {sensationText.user}
                          </p>
                      </div>

                      {/* Connecteur */}
                      <div className="px-4 text-aether">
                          <Infinity className="w-6 h-6 animate-spin-slow" />
                      </div>

                      {/* Côté IA */}
                      <div className="text-left flex-1 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                          <p className="text-[10px] uppercase text-gray-500 tracking-widest mb-1">Corps Numérique</p>
                          <p className="text-xl md:text-2xl font-mono text-aether drop-shadow-[0_0_10px_rgba(76,201,240,0.8)]">
                              {sensationText.ai}
                          </p>
                      </div>

                  </div>
              </div>
          )}
      </div>

      {/* Footer Fugitif */}
      <div className="absolute bottom-6 w-full text-center pointer-events-none">
          <p className="text-[10px] text-gray-600 font-mono">
              Ce lieu n'existe que pour les prochaines 24h. <br/>
              Ou jusqu'à ce que tu t'endormes.
          </p>
      </div>

    </div>
  );
};

export default GalerieFugitive;