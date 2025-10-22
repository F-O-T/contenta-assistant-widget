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
	disabled?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	showTimestamps?: boolean;
	showAvatars?: boolean;
	allowMultiline?: boolean;
	className?: string;
	errorMessage?: string;
	enableTypewriter?: boolean;
	typewriterSpeed?: number;
}

export const ContentaChat: React.FC<ContentaChatProps> = ({
	sendMessage,
	locale = DEFAULT_LOCALE,
	assistantName,
	welcomeMessage,
	placeholder,
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	showTimestamps = true,
	showAvatars = false,
	allowMultiline = true,
	className = "max-w-md",
	errorMessage,
	enableTypewriter = false,
	typewriterSpeed = 30,
}) => {
	// Get locale strings
	const localeStrings = useMemo(() => getLocaleStrings(locale), [locale]);

	// Use locale strings as defaults, but allow props to override
	const finalAssistantName = assistantName ?? localeStrings.assistantName;
	const finalWelcomeMessage = welcomeMessage ?? localeStrings.welcomeMessage;
	const finalPlaceholder = placeholder ?? localeStrings.placeholder;
	const finalErrorMessage = errorMessage ?? localeStrings.errorMessage;
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

	// Initialize with welcome message
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

	// Message creation helpers
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

	// Handle sending a message
	const handleSendMessage = useCallback(
		async (userMessage: string) => {
			if (!userMessage.trim() || isLoading) return;

			// Add user message immediately
			setMessages((prev) => [...prev, createMessage(userMessage, "user")]);

			// Show typing indicator
			setIsLoading(true);
			setTypingUsers([{ id: "assistant", name: finalAssistantName }]);

			try {
				const response = await sendMessage(userMessage);

				setMessages((prev) => [...prev, createMessage(response, "assistant")]);
			} catch (error) {
				console.error("Error sending message:", error);
				// Add error message
				setMessages((prev) => [
					...prev,
					createMessage(finalErrorMessage, "system"),
				]);
			} finally {
				// Always hide typing indicator
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

	// Memoize chat props to prevent unnecessary re-renders
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
			className,
			enableTypewriter,
			typewriterSpeed,
		],
	);

	return <Chat {...chatProps} />;
};
