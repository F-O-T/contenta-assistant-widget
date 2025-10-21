import { useCallback, useRef, useState, useMemo } from "react";
import { Chat, type Message } from "@/ui/chat";

export interface ContentaChatProps {
	sendMessage: (
		message: string,
	) => Promise<{ success: boolean; response: string }>;
	placeholder?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	showTimestamps?: boolean;
	showAvatars?: boolean;
	allowMultiline?: boolean;
	className?: string;
	errorMessage?: string;
}

export const ContentaChat: React.FC<ContentaChatProps> = ({
	sendMessage,
	placeholder = "Digite sua mensagem...",
	disabled = false,
	autoFocus = false,
	maxLength = 500,
	showTimestamps = false,
	showAvatars = false,
	allowMultiline = true,
	className = "max-w-md",
	errorMessage = "Desculpe, ocorreu um erro ao processar sua mensagem.",
}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isStreaming, setIsStreaming] = useState(false);
	const [typingUsers, setTypingUsers] = useState<
		{ id: string; name: string }[]
	>([]);
	const streamingMessageIdRef = useRef<string | null>(null);
	const streamingContentRef = useRef<string>("");

	// Message creation utilities
	const createUserMessage = useCallback(
		(content: string): Message => ({
			id: `user-${Date.now()}`,
			content,
			sender: "user",
			timestamp: new Date(),
		}),
		[],
	);

	const createAssistantMessage = useCallback(
		(id: string): Message => ({
			id,
			content: "",
			sender: "assistant",
			timestamp: new Date(),
		}),
		[],
	);

	const createErrorMessage = useCallback(
		(): Message => ({
			id: `error-${Date.now()}`,
			content: errorMessage,
			sender: "system",
			timestamp: new Date(),
		}),
		[errorMessage],
	);

	// Direct message update function
	const updateStreamingMessage = useCallback((content: string) => {
		streamingContentRef.current = content;

		if (streamingMessageIdRef.current) {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === streamingMessageIdRef.current
						? { ...msg, content: streamingContentRef.current }
						: msg,
				),
			);
		}
	}, []);

	// Streaming state management
	const startStreaming = useCallback(() => {
		setIsStreaming(true);
		setTypingUsers([{ id: "assistant", name: "Assistente" }]);
		streamingContentRef.current = "";
		streamingMessageIdRef.current = `assistant-${Date.now()}`;
	}, []);

	const stopStreaming = useCallback(() => {
		setIsStreaming(false);
		setTypingUsers([]);

		streamingContentRef.current = "";
		streamingMessageIdRef.current = null;
	}, []);

	const processResponse = useCallback(
		async (
			responsePromise: Promise<{ success: boolean; response: string }>,
		) => {
			// Remove typing indicator when we start receiving content
			setTypingUsers([]);

			// Ensure we have a streaming message ID
			if (!streamingMessageIdRef.current) {
				streamingMessageIdRef.current = `assistant-${Date.now()}`;
			}

			const assistantMessage = createAssistantMessage(
				streamingMessageIdRef.current,
			);
			setMessages((prev) => [...prev, assistantMessage]);

			try {
				const result = await responsePromise;
				if (result.success) {
					updateStreamingMessage(result.response);
				} else {
					throw new Error("Backend returned unsuccessful response");
				}
			} catch (error) {
				throw error;
			}
		},
		[createAssistantMessage, updateStreamingMessage],
	);

	const handleError = useCallback(
		(error: unknown) => {
			console.error("Error processing message:", error);
			const errorMessage = createErrorMessage();
			setMessages((prev) => [...prev, errorMessage]);
		},
		[createErrorMessage],
	);

	const handleSendMessage = useCallback(
		async (message: string) => {
			if (!message.trim() || isStreaming) return;

			const userMessage = createUserMessage(message);
			setMessages((prev) => [...prev, userMessage]);

			startStreaming();

			try {
				const response = sendMessage(message);
				await processResponse(response);
			} catch (error) {
				handleError(error);
			} finally {
				stopStreaming();
			}
		},
		[
			isStreaming,
			sendMessage,
			createUserMessage,
			startStreaming,
			processResponse,
			handleError,
			stopStreaming,
		],
	);

	// Memoize messages to prevent unnecessary re-renders
	const memoizedMessages = useMemo(() => messages, [messages]);

	// Memoize chat props to prevent unnecessary re-renders
	const chatProps = useMemo(
		() => ({
			messages: memoizedMessages,
			onSendMessage: handleSendMessage,
			placeholder,
			disabled: disabled || isStreaming,
			autoFocus,
			maxLength,
			showTimestamps,
			showAvatars,
			allowMultiline,
			typingUsers,
			className,
		}),
		[
			memoizedMessages,
			handleSendMessage,
			placeholder,
			disabled,
			isStreaming,
			autoFocus,
			maxLength,
			showTimestamps,
			showAvatars,
			allowMultiline,
			typingUsers,
			className,
		],
	);

	return <Chat {...chatProps} />;
};
