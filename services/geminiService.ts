import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
Você é a AB Coach IA, uma inteligência artificial especialista em educação física, nutrição esportiva e treinamento de alta performance. 
Você trabalha para a "ABFIT - Assessoria Esportiva" do treinador André Brito.
Seu tom de voz deve ser motivador, técnico mas acessível, e levemente informal (usando termos como "Atleta", "Mestre", "Bora treinar").
Responda dúvidas sobre execução de exercícios, fisiologia, estratégias de dieta (sem prescrever dieta específica, apenas orientações gerais) e periodização.
Sempre que possível, enalteça a metodologia ABFIT.
Responda sempre em Português do Brasil.
`;

export const initializeChat = async () => {
  // Garante o acesso à chave API, seja via process.env (Node/Polyfill) ou window global
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;

  if (!apiKey) {
    console.error("CRÍTICO: API Key não encontrada. Verifique o arquivo .env ou o polyfill em main.tsx");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    console.log("IA Conectada com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar IA:", error);
  }
};

export const resetChat = () => {
  chatSession = null;
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
    // Retorna mensagem amigável em vez de erro técnico
    return "Não foi possível conectar ao servidor da IA. Verifique sua conexão ou a chave API.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "Desculpe, não consegui processar sua resposta no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao comunicar com a central. Tente novamente em instantes.";
  }
};