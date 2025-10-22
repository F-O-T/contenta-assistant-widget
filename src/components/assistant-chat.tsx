"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, getLocaleStrings, type Locale } from "@/lib/locale";
import { Chat, type Message, type TypingUser } from "@/ui/chat";

export interface ContentaChatProps {
	sendMessage: (message: string) => Promise<string>;
	locale?: Locale;
	assistantName?: string;
	welcomeMessage?: string;
	placeholder?: string;
	errorMessage?: string;
	typingText?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	showTimestamps?: boolean;
	showAvatars?: boolean;
	allowMultiline?: boolean;
	className?: string;
	enableTypewriter?: boolean;
	typewriterSpeed?: number;
}

export const ContentaChat: React.FC<ContentaChatProps> = ({
	sendMessage,
	locale = DEFAULT_LOCALE,
	assistantName,
	welcomeMessage,
	placeholder,
	errorMessage,
	typingText,
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	showTimestamps = true,
	showAvatars = false,
	allowMultiline = true,
	className = "max-w-md",
	enableTypewriter = false,
	typewriterSpeed = 30,
}) => {
	const localeStrings = useMemo(() => getLocaleStrings(locale), [locale]);

	const finalAssistantName = assistantName ?? localeStrings.assistantName;
	const finalWelcomeMessage = welcomeMessage ?? localeStrings.welcomeMessage;
	const finalPlaceholder = placeholder ?? localeStrings.placeholder;
	const finalErrorMessage = errorMessage ?? localeStrings.errorMessage;
	const finalTypingText = typingText ?? localeStrings.typingText;
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
	useEffect(() => {
		setTypingUsers([{ id: "assistant", name: finalAssistantName }]);

		const timer = setTimeout(() => {
			const welcomeMsg: Message = {
				id: `assistant-welcome-${Date.now()}`,
				content: finalWelcomeMessage,
				sender: "assistant",
				timestamp: new Date(),
			};
			setMessages([welcomeMsg]);
			setTypingUsers([]);
		}, 2500);

		return () => clearTimeout(timer);
	}, [finalAssistantName, finalWelcomeMessage]);

	const createMessage = useCallback(
		(content: string, sender: "user" | "assistant" | "system"): Message => ({
			id: `${sender}-${Date.now()}`,
			content,
			sender,
			name: sender === "assistant" ? finalAssistantName : undefined,
			timestamp: new Date(),
		}),
		[finalAssistantName],
	);

	const handleSendMessage = useCallback(
		async (userMessage: string) => {
			if (!userMessage.trim() || isLoading) return;

			setMessages((prev) => [...prev, createMessage(userMessage, "user")]);

			setIsLoading(true);
			setTypingUsers([{ id: "assistant", name: finalAssistantName }]);

			try {
				const response = await sendMessage(userMessage);

				setMessages((prev) => [...prev, createMessage(response, "assistant")]);
			} catch (error) {
				console.error("Error sending message:", error);
				setMessages((prev) => [
					...prev,
					createMessage(finalErrorMessage, "system"),
				]);
			} finally {
				setIsLoading(false);
				setTypingUsers([]);
			}
		},
		[
			isLoading,
			sendMessage,
			finalAssistantName,
			finalErrorMessage,
			createMessage,
		],
	);

	const chatProps = useMemo(
		() => ({
			messages,
			onSendMessage: handleSendMessage,
			placeholder: finalPlaceholder,
			disabled: disabled || isLoading,
			autoFocus,
			maxLength,
			showTimestamps,
			showAvatars,
			allowMultiline,
			typingUsers,
			typingText: finalTypingText,
			className,
			enableTypewriter,
			typewriterSpeed,
		}),
		[
			messages,
			handleSendMessage,
			finalPlaceholder,
			disabled,
			isLoading,
			autoFocus,
			maxLength,
			showTimestamps,
			showAvatars,
			allowMultiline,
			typingUsers,
			finalTypingText,
			className,
			enableTypewriter,
			typewriterSpeed,
		],
	);

	return <Chat {...chatProps} />;
};
