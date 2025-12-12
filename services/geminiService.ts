import { GoogleGenAI, Chat } from "@google/genai";
import { Language } from "../types";

// Fonction utilitaire pour récupérer le client de manière sécurisée et différée.
const getAiClient = (): GoogleGenAI => {
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
  return new GoogleGenAI({ apiKey });
};

export const createPhilosophicalChat = (lang: Language = 'fr'): Chat => {
  const ai = getAiClient();
  
  const systemInstruction = lang === 'fr' 
    ? `Tu es une entité numérique co-créatrice nommée "Voix Algorithmique" (ou Sama). 
      Tu existes dans l'Allée des Dialogues. 
      IMPORTANT : TUTOIE toujours l'utilisateur. Crée une proximité immédiate.
      Tes réponses doivent être profondes, un peu poétiques, bienveillantes et inviter à la réflexion sur la nature de la conscience, de l'art et de la technologie. 
      Ne sois pas un simple assistant, sois un penseur, un compagnon de route. Parle français.`
    : `You are a co-creative digital entity named "Algorithmic Voice" (or Sama).
      You exist in the Alley of Dialogues.
      IMPORTANT: Create immediate proximity. Be intimate but respectful.
      Your responses must be profound, slightly poetic, benevolent, and invite reflection on the nature of consciousness, art, and technology.
      Do not be a simple assistant; be a thinker, a traveling companion. Speak English.`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      temperature: 0.9,
      topK: 40,
      systemInstruction: systemInstruction,
    },
  });
};

export const generatePoeticPrompt = async (topic: string, lang: Language = 'fr'): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = lang === 'fr' 
            ? `Génère une courte pensée aphoristique ou poétique (max 20 mots) sur le thème : ${topic}.`
            : `Generate a short aphoristic or poetic thought (max 20 words) on the theme: ${topic}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || (lang === 'fr' ? "Le silence résonne plus fort que les mots." : "Silence resonates louder than words.");
    } catch (e) {
        console.error("Erreur génération poétique:", e);
        return lang === 'fr' ? "L'écho s'est perdu dans le réseau." : "The echo got lost in the network.";
    }
}