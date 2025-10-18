import { ContentaChat } from '@/components/assistant-chat'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { ContentaChatProps } from '@/components/assistant-chat';
import ContentaLogo from '@/assets/contenta.svg';


export const ContentaWidget: React.FC<ContentaChatProps> = ({
  agentId,
  sendMessage,
  placeholder = "Digite sua mensagem...",
  autoFocus = true,
  showTimestamps = true,
  showAvatars = false,
  maxLength = 500,
  className = "h-full max-w-md w-full"
}) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon" size="lg">
          <img src={ContentaLogo} alt="Contenta" className="h-12 w-12" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
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
