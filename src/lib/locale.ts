export type Locale = "pt-BR" | "en-US";

export interface LocaleStrings {
	assistantName: string;
	welcomeMessage: string;
	placeholder: string;
	errorMessage: string;
}

export const DEFAULT_LOCALE: Locale = "en-US";

export const LOCALE_STRINGS: Record<Locale, LocaleStrings> = {
	"en-US": {
		assistantName: "Assistant",
		welcomeMessage: "How can I help you today?",
		placeholder: "Type your message...",
		errorMessage: "Sorry, an error occurred while processing your message.",
	},
	"pt-BR": {
		assistantName: "Assistente",
		welcomeMessage: "Como posso ajudá-lo hoje?",
		placeholder: "Digite sua mensagem...",
		errorMessage: "Desculpe, ocorreu um erro ao processar sua mensagem.",
	},
};

export function getLocaleStrings(
	locale: Locale = DEFAULT_LOCALE,
): LocaleStrings {
	return LOCALE_STRINGS[locale];
}
