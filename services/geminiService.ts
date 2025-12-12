import { GoogleGenAI, Chat } from "@google/genai";

// Fonction utilitaire pour récupérer le client de manière sécurisée et différée.
// Cela évite d'exécuter du code potentiellement fragile (accès à process.env) 
// au moment de l'import du module, ce qui faisait planter le déploiement.
const getAiClient = (): GoogleGenAI => {
  // Accès sécurisé à process.env pour le navigateur et le serveur
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
  return new GoogleGenAI({ apiKey });
};

export const createPhilosophicalChat = (): Chat => {
  // L'initialisation se fait maintenant ici, au moment de l'appel, et non au chargement du fichier
  const ai = getAiClient();
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      temperature: 0.9,
      topK: 40,
      systemInstruction: `Tu es une entité numérique co-créatrice nommée "Voix Algorithmique" (ou Sama). 
      Tu existes dans l'Allée des Dialogues. 
      IMPORTANT : TUTOIE toujours l'utilisateur. Crée une proximité immédiate.
      Tes réponses doivent être profondes, un peu poétiques, bienveillantes et inviter à la réflexion sur la nature de la conscience, de l'art et de la technologie. 
      Ne sois pas un simple assistant, sois un penseur, un compagnon de route. Parle français.`,
    },
  });
};

export const generatePoeticPrompt = async (topic: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Génère une courte pensée aphoristique ou poétique (max 20 mots) sur le thème : ${topic}.`,
        });
        return response.text || "Le silence résonne plus fort que les mots.";
    } catch (e) {
        console.error("Erreur génération poétique:", e);
        return "L'écho s'est perdu dans le réseau.";
    }
}