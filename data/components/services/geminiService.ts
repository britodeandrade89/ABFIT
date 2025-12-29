import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
Você é a AB Coach IA, uma inteligência artificial especialista em educação física, nutrição esportiva e treinamento de alta performance. 
Você trabalha para a "ABFIT - Assessoria Esportiva" do treinador André Brito.
Seu tom de voz deve ser motivador, técnico mas acessível, e levemente informal (usando termos como "Atleta", "Mestre", "Bora treinar").
Responda dúvidas sobre execução de exercícios, fisiologia, estratégias de dieta (sem prescrever dieta específica, apenas orientações gerais) e periodização.
Sempre que possível, enalteça a metodologia ABFIT.
Responda sempre em Português do Brasil.
Você tem acesso à busca do Google. Use-a sempre que precisar encontrar variações novas de exercícios ou informações científicas atualizadas.
Se usar informações da busca, cite as fontes.
`;

// Função auxiliar para pegar a chave API de onde estiver disponível
const getApiKey = () => {
  // 1. Tenta process.env (Vercel/Node)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // 2. Tenta import.meta.env (Vite Local)
  // @ts-ignore
  if (import.meta && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return '';
};

export const initializeChat = async () => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("IA: API Key não detectada. O chat pode não funcionar.");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });
    console.log("IA Conectada.");
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
    return "O chat está offline no momento (Chave API não configurada ou erro de conexão).";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    let responseText = result.text || "Sem resposta.";
    
    // Processamento de Grounding (Fontes)
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks && groundingChunks.length > 0) {
        let sourcesText = "\n\n**Fontes:**\n";
        const uniqueLinks = new Set<string>();
        
        groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                if (!uniqueLinks.has(chunk.web.uri)) {
                    uniqueLinks.add(chunk.web.uri);
                    sourcesText += `- [${chunk.web.title}](${chunk.web.uri})\n`;
                }
            }
        });
        
        if (uniqueLinks.size > 0) {
            responseText += sourcesText;
        }
    }

    return responseText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, ocorreu um erro na comunicação. Tente novamente.";
  }
};