import { ContentaChat } from '@/components/assistant-chat'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { sendMessage } from '@/lib/contenta-sdk';

function App() {
	const agentId = import.meta.env.VITE_CONTENTA_ASSISTANT_ID || '';

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="icon" >
					<MessageCircle className="h-6 w-6" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='p-0'>
				<ContentaChat
					agentId={agentId}
					sendMessage={sendMessage}
					placeholder="Digite sua mensagem..."
					autoFocus={true}
					showTimestamps={true}
					showAvatars={false}
					maxLength={500}
					className="h-full max-w-md w-full"
				/>
			</PopoverContent>
		</Popover>
	);
}

export default App;
