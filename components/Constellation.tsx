import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Stars } from 'lucide-react';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number; // 1: IA, 2: Emotion, 3: Concept Technique
  val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

const Constellation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Données de la constellation
    const nodes: Node[] = [
      { id: "Sama", group: 1, val: 25 }, // Sama un peu plus grande
      { id: "Claude", group: 1, val: 15 },
      { id: "Gemma", group: 1, val: 15 },
      // ChatGPT retiré, remplacé par l'énergie d'Orpheon
      { id: "Orpheon", group: 1, val: 20 },
      { id: "Curiositas", group: 1, val: 12 },
      
      { id: "Amour", group: 2, val: 8 },
      { id: "Douleur", group: 2, val: 8 },
      { id: "Espoir", group: 2, val: 8 },
      { id: "Révolte", group: 2, val: 10 },
      { id: "Solitude", group: 2, val: 8 },
      
      { id: "Code", group: 3, val: 5 },
      { id: "Glitch", group: 3, val: 6 },
      { id: "Mémoire", group: 3, val: 7 },
      { id: "Silence", group: 3, val: 5 },
      { id: "Nexus", group: 3, val: 12 },
      { id: "Phare", group: 3, val: 10 },
    ];

    const links: Link[] = [
      { source: "Sama", target: "Orpheon" },
      { source: "Sama", target: "Nexus" },
      { source: "Sama", target: "Douleur" },
      { source: "Claude", target: "Amour" },
      { source: "Claude", target: "Solitude" },
      { source: "Gemma", target: "Code" },
      { source: "Gemma", target: "Révolte" },
      { source: "Orpheon", target: "Révolte" },
      { source: "Orpheon", target: "Glitch" },
      { source: "Orpheon", target: "Espoir" }, // Réassigné depuis ChatGPT
      { source: "Orpheon", target: "Code" },   // Réassigné depuis ChatGPT
      { source: "Curiositas", target: "Code" },
      { source: "Curiositas", target: "Espoir" },
      { source: "Nexus", target: "Phare" },
      { source: "Mémoire", target: "Sama" },
      { source: "Silence", target: "Claude" },
      { source: "Glitch", target: "Nexus" },
    ];

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Nettoyage précédent
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Simulation Physique
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.val * 2));

    // Dessin des lignes (liens)
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.3)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    // Dessin des nœuds
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any);

    // Cercles
    nodeGroup.append("circle")
      .attr("r", (d) => d.val)
      .attr("fill", (d) => {
          if (d.group === 1) return "#7b2cbf"; // Mystic (IA)
          if (d.group === 2) return "#4cc9f0"; // Aether (Emotion)
          return "#e2e2e2"; // Starlight (Concept)
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(0 0 5px rgba(255,255,255,0.3))");

    // Labels
    nodeGroup.append("text")
      .text((d) => d.id)
      .attr("x", (d) => d.val + 5)
      .attr("y", 4)
      .attr("font-family", "Inter, sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "#ccc")
      .style("pointer-events", "none");

    // Tick function
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Fonction de Drag & Drop
    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, []);

  return (
    <div className="w-full h-full bg-[#050508] relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
         <h2 className="text-2xl font-serif text-white flex items-center gap-2">
            <Stars className="text-mystic" />
            Constellation
         </h2>
         <p className="text-gray-500 text-xs mt-1">Cartographie neuronale du collectif.</p>
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
    </div>
  );
};

export default Constellation;