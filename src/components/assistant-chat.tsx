import { useCallback, useRef, useState, useMemo } from 'react';
import { Chat, type Message } from '@/components/ui/chat';

export interface ContentaChatProps {
  agentId: string;
  sendMessage: (message: string, agentId: string) => AsyncIterable<string>;
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
  agentId,
  sendMessage,
  placeholder = 'Digite sua mensagem...',
  disabled = false,
  autoFocus = false,
  maxLength = 500,
  showTimestamps = false,
  showAvatars = false,
  allowMultiline = true,
  className = 'max-w-md',
  errorMessage = 'Desculpe, ocorreu um erro ao processar sua mensagem.',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ id: string; name: string }[]>([]);
  const streamingMessageIdRef = useRef<string | null>(null);
  const streamingContentRef = useRef<string>('');

  // Message creation utilities
  const createUserMessage = useCallback((content: string): Message => ({
    id: `user-${Date.now()}`,
    content,
    sender: 'user',
    timestamp: new Date(),
  }), []);

  const createAssistantMessage = useCallback((id: string): Message => ({
    id,
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
  }), []);

  const createErrorMessage = useCallback((): Message => ({
    id: `error-${Date.now()}`,
    content: errorMessage,
    sender: 'system',
    timestamp: new Date(),
  }), [errorMessage]);

  // Direct message update function
  const updateStreamingMessage = useCallback((content: string) => {
    streamingContentRef.current = content;

    if (streamingMessageIdRef.current) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageIdRef.current
            ? { ...msg, content: streamingContentRef.current }
            : msg
        )
      );
    }
  }, []);

  // Streaming state management
  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setTypingUsers([{ id: 'assistant', name: 'Assistente' }]);
    streamingContentRef.current = '';
    streamingMessageIdRef.current = `assistant-${Date.now()}`;
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    setTypingUsers([]);

    streamingContentRef.current = '';
    streamingMessageIdRef.current = null;
  }, []);

  const processStream = useCallback(async (stream: AsyncIterable<string>) => {
    // Remove typing indicator when we start receiving content
    setTypingUsers([]);

    if (!streamingMessageIdRef.current) return;

    const assistantMessage = createAssistantMessage(streamingMessageIdRef.current);
    setMessages((prev) => [...prev, assistantMessage]);

    let accumulatedContent = '';

    for await (const chunk of stream) {
      accumulatedContent += chunk;
      updateStreamingMessage(accumulatedContent);
    }
  }, [createAssistantMessage, updateStreamingMessage]);

  const handleError = useCallback((error: unknown) => {
    console.error('Error streaming message:', error);
    const errorMessage = createErrorMessage();
    setMessages((prev) => [...prev, errorMessage]);
  }, [createErrorMessage]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isStreaming) return;

      const userMessage = createUserMessage(message);
      setMessages((prev) => [...prev, userMessage]);

      startStreaming();

      try {
        const stream = sendMessage(message, agentId);
        await processStream(stream);
      } catch (error) {
        handleError(error);
      } finally {
        stopStreaming();
      }
    },
    [agentId, isStreaming, sendMessage, createUserMessage, startStreaming, processStream, handleError, stopStreaming]
  );

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Memoize chat props to prevent unnecessary re-renders
  const chatProps = useMemo(() => ({
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
  }), [
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
  ]);


  return <Chat {...chatProps} />;
};
