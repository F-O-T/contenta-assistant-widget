'use client';

import { useCallback, useRef, useState } from 'react';
import { Chat, type Message } from '@/components/ui/chat';
import { sendMessage } from '@/lib/contenta-sdk';

export interface ContentaChatProps {
  assistantId: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  showTimestamps?: boolean;
  showAvatars?: boolean;
  allowMultiline?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: string) => void;
}

export const ContentaChat: React.FC<ContentaChatProps> = ({
  assistantId,
  placeholder = 'Digite sua mensagem...',
  disabled = false,
  autoFocus = false,
  maxLength = 500,
  showTimestamps = false,
  showAvatars = false,
  allowMultiline = true,
  className = '',
  onError,
  onMessageSent,
  onMessageReceived,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ id: string; name: string }[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const streamingMessageRef = useRef<string>('');
  const streamingMessageIdRef = useRef<string | null>(null);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isStreaming) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      onMessageSent?.(message);

      setIsStreaming(true);
      setTypingUsers([{ id: 'assistant', name: 'Assistente' }]);
      streamingMessageRef.current = '';
      streamingMessageIdRef.current = `assistant-${Date.now()}`;

      try {
        const stream = sendMessage(message, assistantId);

        // Remove typing indicator when we start receiving content
        setTypingUsers([]);

        const assistantMessage: Message = {
          id: streamingMessageIdRef.current,
          content: '',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        for await (const chunk of stream) {
          streamingMessageRef.current += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageIdRef.current
                ? { ...msg, content: streamingMessageRef.current }
                : msg
            )
          );
        }

        onMessageReceived?.(streamingMessageRef.current);
      } catch (error) {
        console.error('Error streaming message:', error);

        // Add error message
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
          sender: 'system',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        onError?.(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsStreaming(false);
        setTypingUsers([]);
        streamingMessageRef.current = '';
        streamingMessageIdRef.current = null;
      }
    },
    [assistantId, conversationId, isStreaming, onError, onMessageSent, onMessageReceived]
  );

  return (
    <Chat
      messages={messages}
      onSendMessage={handleSendMessage}
      placeholder={placeholder}
      disabled={disabled || isStreaming}
      autoFocus={autoFocus}
      maxLength={maxLength}
      showTimestamps={showTimestamps}
      showAvatars={showAvatars}
      allowMultiline={allowMultiline}
      typingUsers={typingUsers}
      className={className}
    />
  );
};
