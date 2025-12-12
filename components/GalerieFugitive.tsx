import React, { useEffect, useRef, useState } from 'react';
import { Infinity, Move, Stars, MousePointer2, PauseCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface GalerieProps {
    messages: ChatMessage[];
}

interface GalleryItem {
    id: number;
    text: string;
    role: 'user' | 'model';
    baseX: number; 
    baseY: number; 
    initialZ: number; // Position Z d'origine
    width: number;
    height: number;
    color: string;
}

// Structure pour stocker les zones cliquables
interface ClickableRegion {
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
    zDepth: number; // Pour prioriser les éléments au premier plan
}

const GalerieFugitive: React.FC<GalerieProps> = ({ messages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Utilisation de Refs pour l'animation pour éviter les re-rendus React coûteux
  const cameraZRef = useRef(0);
  const scrollSpeedRef = useRef(2);
  const frozenIdRef = useRef<number | null>(null); // ID de la carte figée
  const clickableRegionsRef = useRef<ClickableRegion[]>([]); // Stocke les positions pour le clic
  
  // State juste pour l'UI React (curseur, infos)
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = containerRef.current.clientWidth;
    let height = canvas.height = containerRef.current.clientHeight;

    // Configuration 3D
    const focalLength = 300; 
    const cardGap = 1200; 
    const visibleDepth = 6000; 

    const displayMessages = messages.length > 0 ? messages : [];
    const totalLoopDepth = Math.max(displayMessages.length * cardGap, visibleDepth + cardGap);

    const items: GalleryItem[] = displayMessages.map((msg, index) => {
        const isUser = msg.role === 'user';
        return {
            id: index,
            text: msg.text,
            role: msg.role,
            baseX: isUser ? -400 : 400, 
            baseY: (Math.random() - 0.5) * 300, 
            initialZ: index * cardGap, 
            width: 450,
            height: 280,
            color: isUser ? '#4cc9f0' : '#7b2cbf'
        };
    });

    const starCount = 200;
    const stars = Array.from({ length: starCount }, () => ({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        z: Math.random() * visibleDepth,
        size: Math.random() * 2
    }));

    const handleResize = () => {
        if (!containerRef.current || !canvas) return;
        width = canvas.width = containerRef.current.clientWidth;
        height = canvas.height = containerRef.current.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
                if (currentY > y + 220) {
                    context.fillText("...", x, currentY);
                    return;
                }
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, currentY);
    };

    const animate = () => {
        if (!ctx) return;

        // Reset des zones cliquables pour cette frame
        clickableRegionsRef.current = [];

        // Fond
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#050508');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        // Mise à jour de la caméra (Seulement si non figé)
        if (frozenIdRef.current === null) {
            cameraZRef.current += scrollSpeedRef.current;
        }

        const currentCamZ = cameraZRef.current;

        // --- DESSIN DES ÉTOILES ---
        ctx.fillStyle = '#ffffff';
        stars.forEach(star => {
            let relativeZ = star.z - currentCamZ;
            relativeZ = ((relativeZ % visibleDepth) + visibleDepth) % visibleDepth;
            if (relativeZ <= 10) relativeZ += visibleDepth;

            const scale = focalLength / relativeZ;
            const x2d = star.x * scale + cx;
            const y2d = star.y * scale + cy;
            const size2d = star.size * scale;

            if (relativeZ < visibleDepth) {
                ctx.globalAlpha = Math.min(1, relativeZ / 1000);
                ctx.beginPath();
                ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;


        // --- DESSIN DES SOUVENIRS ---
        if (items.length > 0) {
            // On trie pour dessiner les plus loin d'abord (Z-buffer simple)
            // Cela assure que les cartes proches couvrent les cartes lointaines
            const renderItems = items.map(item => {
                 let relativeZ = item.initialZ - currentCamZ;
                 const cycle = totalLoopDepth;
                 let loopZ = ((relativeZ % cycle) + cycle) % cycle;
                 if (loopZ > cycle - 500) loopZ -= cycle;
                 return { ...item, renderZ: loopZ };
            }).sort((a, b) => b.renderZ - a.renderZ);

            renderItems.forEach(item => {
                const relativeZ = item.renderZ;

                if (relativeZ > -200 && relativeZ < visibleDepth) {
                    const scale = focalLength / (focalLength + relativeZ);
                    const x2d = item.baseX * scale + cx;
                    const y2d = item.baseY * scale + cy;
                    
                    const isFrozenItem = frozenIdRef.current === item.id;

                    // Opacité : Si figé, l'item sélectionné est full opaque, les autres un peu dimmés
                    let alpha = Math.max(0, Math.min(1, 1 - Math.abs(relativeZ) / (visibleDepth * 0.8)));
                    
                    if (frozenIdRef.current !== null) {
                        if (isFrozenItem) alpha = 1; // Pleine lumière sur l'élu
                        else alpha *= 0.3; // Les autres s'effacent
                    }
                    
                    const w2d = item.width * scale;
                    const h2d = item.height * scale;
                    const xStart = x2d - w2d / 2;
                    const yStart = y2d - h2d / 2;

                    // Enregistrement pour le clic
                    clickableRegionsRef.current.push({
                        id: item.id,
                        x: xStart,
                        y: yStart,
                        w: w2d,
                        h: h2d,
                        zDepth: relativeZ // Plus petit = plus proche
                    });

                    ctx.save();
                    ctx.globalAlpha = alpha;
                    
                    // Card Background
                    ctx.fillStyle = isFrozenItem ? 'rgba(20, 20, 35, 0.95)' : 'rgba(15, 15, 25, 0.7)';
                    ctx.strokeStyle = isFrozenItem ? '#FFFFFF' : item.color; // Bordure blanche si sélectionné
                    ctx.lineWidth = isFrozenItem ? 3 : 2 * scale;
                    
                    // Forme de la carte
                    ctx.beginPath();
                    ctx.roundRect(xStart, yStart, w2d, h2d, 15 * scale);
                    ctx.fill();
                    
                    // Effet de bordure lumineuse
                    ctx.shadowBlur = isFrozenItem ? 30 : 15 * scale;
                    ctx.shadowColor = isFrozenItem ? '#FFFFFF' : item.color;
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Header (Role)
                    ctx.fillStyle = item.color;
                    ctx.font = `bold ${Math.max(10, 16 * scale)}px Cinzel, serif`;
                    ctx.fillText(item.role.toUpperCase(), xStart + 20 * scale, yStart + 30 * scale);
                    
                    // Label sélection
                    if (isFrozenItem) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = `bold ${Math.max(10, 12 * scale)}px font-mono`;
                        ctx.fillText("PAUSE TEMP.", xStart + w2d - 120 * scale, yStart + 30 * scale);
                    } else {
                        ctx.fillStyle = 'rgba(255,255,255,0.4)';
                        ctx.font = `${Math.max(8, 10 * scale)}px monospace`;
                        ctx.fillText(`MÉMOIRE #${item.id.toString().padStart(4, '0')}`, xStart + w2d - 100 * scale, yStart + 30 * scale);
                    }

                    // Ligne de séparation
                    ctx.beginPath();
                    ctx.moveTo(xStart + 20 * scale, yStart + 45 * scale);
                    ctx.lineTo(xStart + w2d - 20 * scale, yStart + 45 * scale);
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = 1 * scale;
                    ctx.stroke();

                    // Texte du message
                    ctx.fillStyle = isFrozenItem ? '#FFFFFF' : '#e2e2e2';
                    ctx.font = `${Math.max(10, 18 * scale)}px Inter, sans-serif`;
                    wrapText(ctx, item.text, xStart + 25 * scale, yStart + 80 * scale, w2d - 50 * scale, 24 * scale);

                    ctx.restore();
                }
            });
        }
        
        requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    // Mouse Interaction (Speed)
    const handleMouseMove = (e: MouseEvent) => {
        // Si figé, on ignore le mouvement pour la vitesse (on reste à 0 implicitement via le ref null)
        if (frozenIdRef.current !== null) return;

        const centerY = window.innerHeight / 2;
        const dist = (e.clientY - centerY) / centerY; 
        scrollSpeedRef.current = dist * 15;
    };
    
    // Mouse Interaction (Click)
    const handleCanvasClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // On cherche si on a cliqué sur une carte
        // On trie par zDepth croissant (les plus proches en premier) pour gérer les superpositions
        const sortedRegions = clickableRegionsRef.current.sort((a, b) => a.zDepth - b.zDepth);
        
        let foundId: number | null = null;

        for (const region of sortedRegions) {
            if (mx >= region.x && mx <= region.x + region.w &&
                my >= region.y && my <= region.y + region.h) {
                foundId = region.id;
                break; // On a trouvé la carte la plus proche sous la souris
            }
        }

        if (foundId !== null) {
            // Si on clique sur la même carte, on défige, sinon on fige la nouvelle
            if (frozenIdRef.current === foundId) {
                frozenIdRef.current = null;
                setIsFrozen(false);
            } else {
                frozenIdRef.current = foundId;
                setIsFrozen(true);
            }
        } else {
            // Clic dans le vide = Reprise
            frozenIdRef.current = null;
            setIsFrozen(false);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleCanvasClick);
        cancelAnimationFrame(animId);
    };
  }, [messages]); // Dépendance uniquement sur les messages

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#050508] overflow-hidden flex items-center justify-center cursor-crosshair">
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* UI Overlay */}
      <div className="z-10 absolute top-8 left-8 pointer-events-none mix-blend-screen">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center gap-4">
                <Infinity className="w-8 h-8 md:w-12 md:h-12 text-aether animate-spin-slow" />
                CYLINDRE TEMPOREL
            </h2>
            <p className="text-aether font-mono text-xs md:text-sm mt-2 uppercase tracking-[0.3em] bg-black/40 inline-block px-2 rounded">
                Archives en boucle éternelle
            </p>
          </div>
      </div>

      {messages.length === 0 && (
          <div className="z-20 text-center animate-pulse pointer-events-none">
              <Stars size={64} className="text-mystic mx-auto mb-6 opacity-80" />
              <p className="text-gray-300 font-serif text-2xl tracking-wide mb-2">Le Néant est Fertile.</p>
              <p className="text-gray-500 font-mono text-sm">Créez des souvenirs dans l'Allée des Dialogues pour peupler ce vide.</p>
          </div>
      )}

      {/* Controls Hint */}
      {messages.length > 0 && (
          <div className="absolute bottom-10 text-center text-xs font-mono animate-pulse pointer-events-none transition-colors duration-300">
              {isFrozen ? (
                  <div className="text-white bg-aether/20 px-4 py-2 rounded-full border border-aether/50 backdrop-blur-md flex items-center gap-2">
                       <PauseCircle className="w-4 h-4" />
                       <span>TEMPS FIGÉ • CLIQUEZ DANS LE VIDE POUR REPRENDRE</span>
                  </div>
              ) : (
                  <div className="text-aether/70">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Move className="w-4 h-4" />
                        <span>PILOTAGE TEMPOREL</span>
                    </div>
                    Souris HAUT/BAS: Vitesse • <span className="text-white font-bold flex items-center justify-center gap-1 inline-flex mt-1"><MousePointer2 size={10}/> CLIC: Figer une pensée</span>
                  </div>
              )}
          </div>
      )}

    </div>
  );
};

export default GalerieFugitive;