import { MessageCircle } from "lucide-react";
import type { ContentaChatProps } from "@/components/assistant-chat";
import { ContentaChat } from "@/components/assistant-chat";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ContentaWidget: React.FC<ContentaChatProps> = ({
  agentId,
  sendMessage,
  placeholder = "Digite sua mensagem...",
  autoFocus = true,
  showTimestamps = true,
  showAvatars = false,
  maxLength = 500,
  className = "h-full max-w-md w-full",
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ContentaChat
          agentId={agentId}
          sendMessage={sendMessage}
          placeholder={placeholder}
          autoFocus={autoFocus}
          showTimestamps={showTimestamps}
          showAvatars={showAvatars}
          maxLength={maxLength}
          className={className}
        />
      </PopoverContent>
    </Popover>
  );
};
