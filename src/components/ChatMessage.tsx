import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { XCircle, RefreshCcw } from "lucide-react"; // Importamos los íconos


export interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: string;
  isLoading?: boolean;
  onStop?: () => void;
  onReload?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp,
  isLoading = false,
  onStop,
  onReload
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [content]);

  const isUser = role === "user";
  
  return (
    <div ref={messageRef} className={cn("flex w-full mb-4 items-start", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[70%] message-glow",
        isUser ? "bg-primary/10 text-white mr-2" : "bg-primary/20 text-white/90 ml-2",
        isLoading && "animate-pulse-slow"
      )}>
        {isLoading ? (
          <div className="flex space-x-2 py-2 items-center">
            <span className="w-2 h-2 rounded-full bg-white/50 animate-blink"></span>
            <span className="w-2 h-2 rounded-full bg-white/50 animate-blink delay-150"></span>
            <span className="w-2 h-2 rounded-full bg-white/50 animate-blink delay-300"></span>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="m-0 whitespace-pre-wrap">{content}</p>
          </div>
        )}

        {/* Botones de acción para respuestas del asistente */}
        {role === "assistant" && !isLoading && (
            <div className="flex space-x-4 mt-6 text-white/60 text-sm">
              
              <button onClick={onStop} className="flex items-center gap-1 hover:text-red-500 transition">
                <XCircle size={18} /> Stop
              </button>
              <button onClick={onReload} className="flex items-center gap-1 hover:text-blue-400 transition -space-x-px">
                <RefreshCcw size={18} /> Reload
              </button>
              {timestamp && <div className="text-xs text-white/40 mt-2 text-right">{timestamp}</div>}
            </div>
           
          )}
        
      </div>
    </div>
  );
};

export default ChatMessage;
