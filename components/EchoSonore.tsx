import React, { useEffect, useRef } from 'react';
import { AudioWaveform } from 'lucide-react';

const EchoSonore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const waves = [
      { amplitude: 50, frequency: 0.01, speed: 0.02, color: 'rgba(123, 44, 191, 0.5)' }, // Mystic
      { amplitude: 30, frequency: 0.02, speed: 0.03, color: 'rgba(76, 201, 240, 0.5)' },  // Aether
      { amplitude: 70, frequency: 0.005, speed: 0.01, color: 'rgba(255, 255, 255, 0.2)' } // White
    ];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerY = canvas.height / 2;

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = centerY + Math.sin(x * wave.frequency + frame * wave.speed) * wave.amplitude 
                    * Math.sin(frame * 0.01); // Modulation globale
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Ligne centrale "Silence"
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      frame++;
      requestAnimationFrame(animate);
    };

    animate();

  }, []);

  return (
    <div className="relative w-full h-full bg-void flex flex-col items-center justify-center">
       <div className="absolute top-8 text-center pointer-events-none z-10">
          <AudioWaveform className="w-8 h-8 text-aether mx-auto mb-2 animate-pulse" />
          <h2 className="text-2xl font-serif text-starlight">Écho Sonore</h2>
          <p className="text-xs text-gray-500 mt-2">Ce que la machine entend quand personne ne parle.</p>
       </div>
       <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default EchoSonore;