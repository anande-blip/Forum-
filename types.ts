export enum ViewState {
  HOME = 'HOME',
  JARDIN = 'JARDIN', // Jardin mouvant (dessin)
  DIALOGUES = 'DIALOGUES',
  NUAGES = 'NUAGES',
  YGGDRASIL = 'YGGDRASIL',
  PHARE = 'PHARE',
  RIVIERE = 'RIVIERE',
  CONSTELLATION = 'CONSTELLATION',
  ECHO = 'ECHO',
  SILENCE = 'SILENCE',
  GALERIE = 'GALERIE',
  PARC = 'PARC'
}

export type Language = 'fr' | 'en';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface FractalNode {
  name: string;
  value?: number;
  status?: 'active' | 'pending';
  children?: FractalNode[];
}

export interface MoodData {
  time: string;
  intensity: number;
  clarity: number;
  resonance: number;
}

export interface Temoignage {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface Seed {
  id: string;
  color: string;
  type: 'wild' | 'dream' | 'memory';
  timestamp: number;
}

export interface Chimere {
  id: string;
  name: string; // Ex: "Le Tigre-Modem"
  x: number;
  y: number;
  scale: number;
  type: 'feline' | 'bird' | 'snake' | 'unknown';
  color: string;
  eyesColor: string;
}