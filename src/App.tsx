import { ContentaChat } from "@/components/assistant-chat";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ContentaWidget } from "./components/assistant-chat-widget";

function App() {
	const agentId = import.meta.env.VITE_CONTENTA_ASSISTANT_ID || "";

	return (
		<ContentaWidget
			agentId={agentId}
			sendMessage={() => { }}
			placeholder="Digite sua mensagem..."
			autoFocus={true}
			showTimestamps={true}
			showAvatars={false}
			maxLength={500}
			errorMessage="Ocorreu uma falha na comunicação. Por favor, tente novamente."
			className="h-full max-w-md w-full"
		/>
	);
}

export default App;
