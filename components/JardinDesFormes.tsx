import React, { useEffect, useRef, useState } from 'react';
import { Flower, Wind, CheckCircle2 } from 'lucide-react';
import { Seed } from '../types';

interface JardinProps {
  onCapture?: (seed: Seed) => void;
}

const JardinDesFormes: React.FC<JardinProps> = ({ onCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dominantHue, setDominantHue] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: VineParticle[] = [];
    let hue = Math.random() * 360;

    // Particule organique type "Vigne"
    class VineParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      angle: number;
      angleVel: number;

      constructor(x: number, y: number, baseHue: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.angleVel = (Math.random() - 0.5) * 0.2; // Tendance à tourner
        this.speedX = Math.cos(this.angle);
        this.speedY = Math.sin(this.angle);
        this.life = 100;
        
        // Variation de couleur organique
        const h = baseHue + (Math.random() - 0.5) * 40;
        const s = 70 + Math.random() * 30;
        const l = 50 + Math.random() * 20;
        this.color = `hsl(${h}, ${s}%, ${l}%)`;
      }

      update() {
        // Mouvement organique (Perlin noise simulé par angle aléatoire)
        this.angle += (Math.random() - 0.5) * 0.5; 
        this.x += Math.cos(this.angle) * 2;
        this.y += Math.sin(this.angle) * 2;
        
        this.life -= 0.5;
        if (this.size > 0.1) this.size -= 0.02;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset pour performance
      }
    }

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Semer des graines de vigne
      for (let i = 0; i < 3; i++) {
        particles.push(new VineParticle(x, y, hue));
      }
      hue = (hue + 1) % 360;
      setDominantHue(hue);
    };

    const animate = () => {
      if (!ctx) return;
      // Trainée (Trail effect) pour aspect organique
      ctx.fillStyle = 'rgba(10, 10, 18, 0.05)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0 || particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCapture = () => {
    if (onCapture && !isCapturing) {
      setIsCapturing(true);
      
      // Créer une graine basée sur la couleur actuelle
      const seed: Seed = {
        id: Date.now().toString(),
        color: `hsl(${dominantHue}, 70%, 60%)`,
        type: Math.random() > 0.5 ? 'dream' : 'wild',
        timestamp: Date.now()
      };
      
      // Le délai de transition est géré par App.tsx, ici on gère juste l'état visuel immédiat
      onCapture(seed);
    }
  };

  return (
    <div className="relative w-full h-full bg-void overflow-hidden flex flex-col group">
      
      {/* Interface Flottante */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none animate-fade-in-up">
        <h2 className="text-3xl font-serif text-starlight opacity-90 drop-shadow-md">Jardin des Formes</h2>
        <p className="text-aether/70 font-mono text-sm mt-2 flex items-center gap-2">
           <Wind size={14} className="animate-pulse"/>
           Sèmez avec votre mouvement...
        </p>
      </div>

      {/* Bouton de Capture */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={handleCapture}
          disabled={isCapturing}
          className={`
            flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-500 shadow-[0_0_20px_rgba(123,44,191,0.2)]
            ${isCapturing 
                ? 'bg-green-500/20 border-green-500/50 text-green-400 scale-105 cursor-default' 
                : 'bg-void/40 backdrop-blur-md border-mystic/30 text-mystic hover:bg-mystic hover:text-white hover:shadow-[0_0_40px_rgba(123,44,191,0.6)] group-hover:scale-105'
            }
          `}
        >
          {isCapturing ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                <span className="font-serif tracking-widest text-sm">ESSENCE CAPTURÉE</span>
              </>
          ) : (
              <>
                <Flower className="w-5 h-5 animate-spin-slow" />
                <span className="font-serif tracking-widest text-sm">CUEILLIR UNE ESSENCE</span>
              </>
          )}
        </button>
        <p className={`text-center text-xs text-gray-500 mt-2 transition-opacity duration-300 ${isCapturing ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          Pour la planter près d'Yggdrasil
        </p>
      </div>

      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

export default JardinDesFormes;