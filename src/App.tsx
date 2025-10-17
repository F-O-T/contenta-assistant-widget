import { ContentaChat } from '@/components/ContentaChat';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

function App() {
	const assistantId = import.meta.env.VITE_CONTENTA_ASSISTANT_ID || '';

	const handleError = (error: Error) => {
		console.error('Chat error:', error);
	};

	const handleMessageSent = (message: string) => {
		console.log('Message sent:', message);
	};

	const handleMessageReceived = (message: string) => {
		console.log('Message received:', message);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-8">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="primary" size="lg" className="gap-2">
						<MessageCircle className="h-5 w-5" />
						Abrir Chat
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[450px] h-[600px] p-0" size="lg">
					<ContentaChat
						assistantId={assistantId}
						placeholder="Digite sua mensagem..."
						autoFocus={true}
						showTimestamps={false}
						showAvatars={false}
						maxLength={500}
						onError={handleError}
						onMessageSent={handleMessageSent}
						onMessageReceived={handleMessageReceived}
						className="h-full"
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default App;
