"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chat, type Message, type TypingUser } from "@/ui/chat";

export interface ContentaChatProps {
	sendMessage: (message: string) => Promise<string>;
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
	assistantName = "Assistente",
	welcomeMessage = "How can I help you today?",
	placeholder = "Digite sua mensagem...",
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	showTimestamps = true,
	showAvatars = false,
	allowMultiline = true,
	className = "max-w-md",
	errorMessage = "Desculpe, ocorreu um erro ao processar sua mensagem.",
	enableTypewriter = false,
	typewriterSpeed = 30,
}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

	// Initialize with welcome message
	useEffect(() => {
		setTypingUsers([{ id: "assistant", name: assistantName }]);

		const timer = setTimeout(() => {
			const welcomeMsg: Message = {
				id: `assistant-welcome-${Date.now()}`,
				content: welcomeMessage,
				sender: "assistant",
				timestamp: new Date(),
			};
			setMessages([welcomeMsg]);
			setTypingUsers([]);
		}, 2500);

		return () => clearTimeout(timer);
	}, [assistantName, welcomeMessage]);

	// Message creation helpers
	const createMessage = useCallback(
		(content: string, sender: "user" | "assistant" | "system"): Message => ({
			id: `${sender}-${Date.now()}`,
			content,
			sender,
			name: sender === "assistant" ? assistantName : undefined,
			timestamp: new Date(),
		}),
		[assistantName],
	);

	// Handle sending a message
	const handleSendMessage = useCallback(
		async (userMessage: string) => {
			if (!userMessage.trim() || isLoading) return;

			// Add user message immediately
			setMessages((prev) => [...prev, createMessage(userMessage, "user")]);

			// Show typing indicator
			setIsLoading(true);
			setTypingUsers([{ id: "assistant", name: assistantName }]);

			try {
				const response = await sendMessage(userMessage);

				setMessages((prev) => [...prev, createMessage(response, "assistant")]);
			} catch (error) {
				console.error("Error sending message:", error);
				// Add error message
				setMessages((prev) => [...prev, createMessage(errorMessage, "system")]);
			} finally {
				// Always hide typing indicator
				setIsLoading(false);
				setTypingUsers([]);
			}
		},
		[isLoading, sendMessage, assistantName, errorMessage, createMessage],
	);

	// Memoize chat props to prevent unnecessary re-renders
	const chatProps = useMemo(
		() => ({
			messages,
			onSendMessage: handleSendMessage,
			placeholder,
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
			placeholder,
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
