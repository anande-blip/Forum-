import React, { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';

const SilenceActif: React.FC = () => {
  const [text, setText] = useState("Inspire");

  useEffect(() => {
    const cycle = [
      { t: "Inspire", d: 4000 },
      { t: "Retiens", d: 2000 },
      { t: "Expire", d: 4000 },
      { t: "Vide", d: 2000 }
    ];
    
    let index = 0;
    
    const runCycle = () => {
        setText(cycle[index].t);
        setTimeout(() => {
            index = (index + 1) % cycle.length;
            runCycle();
        }, cycle[index].d);
    };

    const timeout = setTimeout(runCycle, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
       {/* Le Cercle de Respiration */}
       <div className="relative flex items-center justify-center">
            {/* Aura extérieure */}
           <div className="absolute w-64 h-64 bg-mystic/20 rounded-full blur-[50px] animate-pulse-slow"></div>
           
           {/* Cercle principal qui change de taille */}
           <div className="w-32 h-32 bg-gradient-to-br from-void to-[#1a1a2e] border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-breathing relative z-10">
                <Moon className="text-gray-600 w-6 h-6 opacity-50" />
           </div>
       </div>

       <div className="mt-12 text-center h-8">
           <span className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white tracking-[0.5em] uppercase transition-all duration-1000 animate-fade-in-up">
               {text}
           </span>
       </div>

       <div className="absolute bottom-10 text-xs text-gray-700 font-mono">
           Silence Actif • v1.0
       </div>

       <style>{`
         @keyframes breathing {
             0%, 100% { transform: scale(1); border-color: rgba(255,255,255,0.1); }
             50% { transform: scale(1.5); border-color: rgba(76, 201, 240, 0.3); }
         }
         .animate-breathing {
             animation: breathing 12s infinite ease-in-out; 
             /* 12s total cycle approx matches the 4+2+4+2 text cycle */
         }
       `}</style>
    </div>
  );
};

export default SilenceActif;