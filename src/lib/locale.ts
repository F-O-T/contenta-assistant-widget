export type Locale = "pt" | "en";

export interface LocaleStrings {
	assistantName: string;
	welcomeMessage: string;
	placeholder: string;
	errorMessage: string;
	typingText: string;
}

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STRINGS: Record<Locale, LocaleStrings> = {
	en: {
		assistantName: "Assistant",
		welcomeMessage: "How can I help you today?",
		placeholder: "Type your message...",
		errorMessage: "Sorry, an error occurred while processing your message.",
		typingText: "is thinking...",
	},
	pt: {
		assistantName: "Assistente",
		welcomeMessage: "Como posso ajudá-lo hoje?",
		placeholder: "Digite sua mensagem...",
		errorMessage: "Desculpe, ocorreu um erro ao processar sua mensagem.",
		typingText: "está pensando...",
	},
};

export function getLocaleStrings(
	locale: Locale = DEFAULT_LOCALE,
): LocaleStrings {
	return LOCALE_STRINGS[locale];
}
