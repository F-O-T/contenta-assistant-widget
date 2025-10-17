import { createSdk } from "@contentagen/sdk";

const CONTENTA_API_KEY = import.meta.env.VITE_CONTENTA_API_KEY;

export const sdk = createSdk({apiKey: CONTENTA_API_KEY, locale: "pt"});

export function sendMessage(message: string, agentId: string) {
  return sdk.streamAssistantResponse({
    message,
    agentId: "dd88466c-b6d4-42b3-9300-96e55bf3d186",
  });
}

export const CONTENTA_AGENT_ID = "dd88466c-b6d4-42b3-9300-96e55bf3d186";
