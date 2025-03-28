import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-4xl mx-auto glass-morphism rounded-lg p-2 transition-all duration-300"
    >
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={4000}
          className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none text-white/90 px-3 py-2 placeholder:text-white/40 scrollbar-thin"
          style={{ maxHeight: "200px" }}
        />
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()} 
          className="bg-primary/30 hover:bg-primary/90 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
