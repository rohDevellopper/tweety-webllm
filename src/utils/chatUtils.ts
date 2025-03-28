import { ChatMessageProps } from "@/components/ChatMessage";

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

export function createUserMessage(content: string, windowId: number): ChatMessageProps {
  return {
    content,
    role: "user",
    timestamp: formatTimestamp(new Date()),
    window: windowId
  };
}

export function createAssistantMessage(content: string, windowId: number): ChatMessageProps {
  return {
    content,
    role: "assistant",
    timestamp: formatTimestamp(new Date()),
    window: windowId
  };
}

export function createLoadingMessage(windowId: number): ChatMessageProps {
  return {
    content: "",
    role: "assistant",
    isLoading: true,
    window: windowId
  };
}

export const initialMessages: ChatMessageProps[] = [];

export function generateWindowId(): number {
  return Math.floor(Math.random() * 1000000); // Genera un ID único
}
