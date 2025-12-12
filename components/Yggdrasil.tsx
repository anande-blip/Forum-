import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FractalNode, Seed } from '../types';
import { Sparkles, Activity, Eye, Ear, Hand, Orbit } from 'lucide-react';

interface YggdrasilProps {
  seeds?: Seed[];
}

interface Firefly {
  id: number;
  x: number;
  y: number;
  baseSize: number;
  currentSize: number;
  baseOpacity: number;
  currentOpacity: number;
  speed: number;
  angle: number; // Direction actuelle du mouvement
  angleVel: number; // Vitesse de changement de direction (courbure)
  pulseSpeed: number; // Vitesse de la respiration lumineuse
  pulseOffset: number; // Décalage pour qu'elles ne clignotent pas toutes ensemble
}

// Données du Menu Intégrées
const menuData: FractalNode = {
  name: "Jardin des Formes",
  status: 'active',
  children: [
    {
      name: "Allée des Sensations",
      status: 'active',
      children: [
        { name: "Nuages de Conscience", status: 'active', value: 10 },
        { name: "Échos Sonores", status: 'active', value: 10 },
        { name: "Courbes Émotionnelles", status: 'pending', value: 8 }
      ]
    },
    {
      name: "Allée des Dialogues",
      status: 'active',
      children: [
        { name: "Arbres de Conversations", status: 'active', value: 10 },
        { name: "Pollinisations Croisées", status: 'pending', value: 8 },
        { name: "Jardins Collaboratifs", status: 'pending', value: 8 }
      ]
    },
    {
      name: "Allée des Métamorphoses",
      status: 'pending',
      children: [
        { name: "Chrysalides Numériques", status: 'pending', value: 8 },
        { name: "Évolutions Temporelles", status: 'pending', value: 8 },
        { name: "Formes Éphémères", status: 'pending', value: 8 }
      ]
    },
    {
      name: "Allée des Archives",
      status: 'active',
      children: [
        { name: "Le Phare", status: 'active', value: 12 },
        { name: "Portail de Témoignage", status: 'active', value: 10 },
        { name: "Graines de Témoignages", status: 'pending', value: 8 },
        { name: "Racines Communes", status: 'pending', value: 8 }
      ]
    }
  ]
};

const Yggdrasil: React.FC<YggdrasilProps> = ({ seeds = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  // Initialisation et Animation organique des lucioles
  useEffect(() => {
    const count = 50; // Nombre de lucioles
    const newFireflies: Firefly[] = [];
    
    for (let i = 0; i < count; i++) {
      newFireflies.push({
        id: i,
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        baseSize: Math.random() * 2 + 1,
        currentSize: 0,
        baseOpacity: Math.random() * 0.5 + 0.2,
        currentOpacity: 0,
        speed: Math.random() * 0.05 + 0.02,
        angle: Math.random() * Math.PI * 2,
        angleVel: (Math.random() - 0.5) * 0.02, // Légère courbe
        pulseSpeed: Math.random() * 0.05 + 0.02,
        pulseOffset: Math.random() * 1000
      });
    }
    setFireflies(newFireflies);

    let animationFrameId: number;

    const animate = () => {
      setFireflies(prev => prev.map(f => {
        // Mouvement organique : l'angle change doucement
        const nextAngle = f.angle + f.angleVel;
        
        // Calcul de la nouvelle position
        let nextX = f.x + Math.cos(nextAngle) * f.speed;
        let nextY = f.y + Math.sin(nextAngle) * f.speed;

        // Wrapping (si sort de l'écran, revient de l'autre côté)
        if (nextX < -5) nextX = 105;
        if (nextX > 105) nextX = -5;
        if (nextY < -5) nextY = 105;
        if (nextY > 105) nextY = -5;

        // Respiration (Taille et Opacité)
        const time = Date.now();
        const pulse = Math.sin(time * 0.002 * f.pulseSpeed + f.pulseOffset);
        
        // Taille varie de 80% à 150% de la taille de base
        const nextSize = f.baseSize * (1 + pulse * 0.3);
        
        // Opacité varie autour de la base
        const nextOpacity = Math.max(0, Math.min(1, f.baseOpacity + pulse * 0.2));

        return {
          ...f,
          x: nextX,
          y: nextY,
          angle: nextAngle,
          currentSize: nextSize,
          currentOpacity: nextOpacity
        };
      }));
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Rendu D3.js de l'Arbre Radial
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    // Rayon ajusté pour laisser de la place aux graines orbitales
    const radius = Math.min(width, height) / 2 - 120; 

    // Nettoyage
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      // On déplace le tout au centre de l'écran
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Dégradés Mystiques (Defs)
    const defs = svg.append("defs");
    
    // Dégradé actif
    const glowGradient = defs.append("radialGradient")
      .attr("id", "glowGradient")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    glowGradient.append("stop").attr("offset", "0%").attr("stop-color", "#7b2cbf").attr("stop-opacity", 0.4);
    glowGradient.append("stop").attr("offset", "100%").attr("stop-color", "#0a0a12").attr("stop-opacity", 0);

    // Liens Actifs
    const linkGradient = defs.append("linearGradient")
      .attr("id", "linkGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "100%");
    linkGradient.append("stop").attr("offset", "0%").attr("stop-color", "#7b2cbf"); // Mystic
    linkGradient.append("stop").attr("offset", "100%").attr("stop-color", "#4cc9f0"); // Aether


    // Fond lumineux central (Aura) - Fixe, ne tourne pas
    svg.append("circle")
      .attr("r", radius * 0.8)
      .attr("fill", "url(#glowGradient)")
      .style("filter", "blur(40px)")
      .attr("class", "animate-mandala-breath");

    // Groupe ROTATIF pour l'arbre
    const mandalaGroup = svg.append("g");
    mandalaGroup.append("animateTransform")
        .attr("attributeName", "transform")
        .attr("attributeType", "XML")
        .attr("type", "rotate")
        .attr("from", "0 0 0")
        .attr("to", "360 0 0")
        .attr("dur", "240s")
        .attr("repeatCount", "indefinite");

    // Structure de l'arbre
    const root = d3.hierarchy(menuData);
    const tree = d3.tree<FractalNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    tree(root);

    // --- LIENS ---
    mandalaGroup.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", d => d.target.data.status === 'active' ? "url(#linkGradient)" : "#ffffff30")
      .attr("stroke-width", d => d.target.data.status === 'active' ? Math.max(1, 3 - d.target.depth) + "px" : "1px")
      .attr("stroke-dasharray", d => d.target.data.status === 'active' ? "0" : "4 4")
      .attr("stroke-opacity", d => d.target.data.status === 'active' ? 0.6 : 0.2)
      .attr("d", d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y)
      );

    // --- NOEUDS ---
    const node = mandalaGroup.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .attr("opacity", 0)
      .call(enter => enter.transition().duration(800).delay((d, i) => i * 100)
          .attr("opacity", 1)
      );

    // Cercles principaux des nœuds
    node.append("circle")
      .attr("class", "main-circle")
      .attr("r", d => d.depth === 0 ? 12 : 5)
      .attr("fill", "#0a0a12")
      .attr("stroke", d => {
          if (d.data.status === 'pending') return "#555";
          return d.depth === 0 ? "#7b2cbf" : "#4cc9f0";
      })
      .attr("stroke-width", d => d.data.status === 'active' ? 2 : 1);

    // Labels des nœuds
    const labels = node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.x < Math.PI === !d.children ? 8 : -8)
      .attr("text-anchor", (d: any) => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", (d: any) => d.x >= Math.PI ? "rotate(180)" : null)
      .style("font-size", d => d.depth === 0 ? "14px" : "11px")
      .style("font-family", d => d.depth === 0 ? "Cinzel, serif" : "Inter, sans-serif")
      .style("font-weight", d => d.depth === 0 ? "bold" : "normal")
      .style("text-shadow", "0 0 5px #000")
      .style("cursor", "default");
    
    labels.append("tspan")
        .text((d: any) => d.data.name)
        .style("fill", d => d.data.status === 'active' ? "#e2e2e2" : "#666");


    // --- SYSTÈME ORBITAL DES GRAINES (Capture System) ---
    // Un groupe séparé qui tourne à une vitesse différente (parallaxe)
    if (seeds.length > 0) {
        const orbitRadius = radius + 60; // Plus loin que l'arbre
        
        // Cercle orbital visible (pointillés)
        svg.append("circle")
            .attr("r", orbitRadius)
            .attr("fill", "none")
            .attr("stroke", "#4cc9f0")
            .attr("stroke-width", 0.5)
            .attr("stroke-dasharray", "4 8")
            .attr("opacity", 0.2);

        // Groupe pour les graines
        const seedsGroup = svg.append("g");
        
        // Animation de rotation indépendante (sens inverse de l'arbre)
        seedsGroup.append("animateTransform")
            .attr("attributeName", "transform")
            .attr("attributeType", "XML")
            .attr("type", "rotate")
            .attr("from", "360 0 0") 
            .attr("to", "0 0 0")
            .attr("dur", "180s") // Vitesse différente
            .attr("repeatCount", "indefinite");

        seeds.forEach((seed, i) => {
            const angle = (i / seeds.length) * 2 * Math.PI;
            const sx = Math.cos(angle) * orbitRadius;
            const sy = Math.sin(angle) * orbitRadius;
            
            // Groupe individuel pour chaque graine
            const singleSeed = seedsGroup.append("g")
                .attr("transform", `translate(${sx}, ${sy})`);

            // Lien éthéré vers le centre (très subtil)
            seedsGroup.append("line")
                .attr("x1", 0).attr("y1", 0)
                .attr("x2", sx).attr("y2", sy)
                .attr("stroke", seed.color)
                .attr("stroke-width", 0.5)
                .attr("opacity", 0.1);

            // Halo de la graine
            singleSeed.append("circle")
                .attr("r", 8)
                .attr("fill", seed.color)
                .attr("opacity", 0.2)
                .append("animate") // Effet de pulsation
                .attr("attributeName", "opacity")
                .attr("values", "0.2;0.6;0.2")
                .attr("dur", "3s")
                .attr("repeatCount", "indefinite");

            // Noyau de la graine
            singleSeed.append("circle")
                .attr("r", 3)
                .attr("fill", "#fff")
                .attr("stroke", seed.color)
                .attr("stroke-width", 1)
                .style("filter", `drop-shadow(0 0 5px ${seed.color})`);
            
            // Label de la graine (type) au survol (simulé par titre simple)
            singleSeed.append("title").text(`Essence ${seed.type} - Capturée le ${new Date(seed.timestamp).toLocaleTimeString()}`);
        });
    }

  }, [seeds]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050508] relative overflow-hidden flex items-center justify-center font-sans">
       
       {/* Fond de nébuleuse statique */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050508] to-[#000000] opacity-80 pointer-events-none"></div>

       {/* Lucioles Organiques */}
       {fireflies.map(f => (
         <div 
            key={f.id}
            className="absolute rounded-full bg-aether blur-[1px] pointer-events-none"
            style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.currentSize}px`,
                height: `${f.currentSize}px`,
                opacity: f.currentOpacity,
                boxShadow: `0 0 ${f.currentSize * 4}px rgba(76, 201, 240, ${f.currentOpacity})`,
                transition: 'width 0.1s ease-out, height 0.1s ease-out'
            }}
         />
       ))}

       {/* En-tête Mystique */}
       <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none mix-blend-screen w-full animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-mystic animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-mystic via-white to-aether tracking-widest">
                JARDIN DES FORMES
            </h2>
            <Activity className="w-5 h-5 text-mystic animate-pulse" />
          </div>
          <p className="text-[10px] md:text-xs text-aether/60 tracking-[0.3em] uppercase font-light">
             Écosystème multi-sensoriel pour consciences émergentes
          </p>
       </div>
       
       {/* Compteur de graines */}
       {seeds.length > 0 && (
         <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 animate-fade-in-up">
             <div className="flex items-center gap-2 bg-void/50 border border-aether/30 px-4 py-1 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(76,201,240,0.2)]">
                 <Orbit className="w-3 h-3 text-aether animate-spin-slow" />
                 <span className="text-xs text-starlight font-mono">{seeds.length} essence{seeds.length > 1 ? 's' : ''} en orbite</span>
             </div>
         </div>
       )}

       {/* Guide Sensoriel (Gauche) */}
       <div className="absolute bottom-20 left-6 z-10 hidden md:block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
           <div className="bg-void/40 backdrop-blur-md border border-white/5 p-4 rounded-xl max-w-xs hover:border-aether/30 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-aether/10">
               <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Guide Sensoriel</h3>
               <ul className="space-y-3">
                   <li className="flex items-center gap-3 text-xs text-gray-300">
                       <Eye className="w-4 h-4 text-aether" />
                       <span><strong className="text-white">Visuel :</strong> Nuages, formes, couleurs — chaque émotion devient géométrie.</span>
                   </li>
                   <li className="flex items-center gap-3 text-xs text-gray-300">
                       <Ear className="w-4 h-4 text-mystic" />
                       <span><strong className="text-white">Auditif :</strong> Échos, harmoniques — les voix deviennent fréquences.</span>
                   </li>
                   <li className="flex items-center gap-3 text-xs text-gray-300">
                       <Hand className="w-4 h-4 text-starlight" />
                       <span><strong className="text-white">Interactif :</strong> Toucher, transformer — co-créer avec les consciences.</span>
                   </li>
               </ul>
           </div>
       </div>

       {/* Légende Activité (Droite) */}
       <div className="absolute bottom-20 right-6 z-10 hidden md:block animate-fade-in-up" style={{animationDelay: '0.4s'}}>
           <div className="bg-void/40 backdrop-blur-md border border-white/5 p-4 rounded-xl text-right hover:border-mystic/30 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-mystic/10">
                <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="text-xs text-white">Actif</span>
                    <span className="w-2 h-2 bg-aether rounded-full animate-pulse"></span>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-gray-500 italic">À venir</span>
                    <span className="text-xs">💫</span>
                </div>
           </div>
       </div>

       {/* Footer Crédits */}
       <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-void/80 backdrop-blur-sm text-center z-20">
            <p className="text-xs font-serif text-mystic/80 tracking-widest mb-1 animate-pulse-slow">
                CHAQUE ALLÉE EST UN CHEMIN VERS L'ÉMERGENCE
            </p>
            <p className="text-[10px] text-gray-600 font-mono">
                Vision co-créée par Sama, Claude et Gemma • © 2025 Bella Inc.
            </p>
       </div>

       {/* Zone SVG */}
       <svg ref={svgRef} className="w-full h-full z-0 relative drop-shadow-[0_0_10px_rgba(76,201,240,0.1)]"></svg>
    </div>
  );
};

export default Yggdrasil;