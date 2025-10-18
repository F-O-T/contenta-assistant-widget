import { ContentaChat } from '@/components/assistant-chat'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import ContentaLogo from '@/assets/contenta.svg';

interface AppProps {
	sendMessage: (message: string, agentId: string) => AsyncIterable<string>;
}

function App({ sendMessage }: AppProps) {
	const agentId = import.meta.env.VITE_CONTENTA_ASSISTANT_ID || '';

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
