import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import ChatMessage, { ChatMessageProps } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ModelSelector from "@/components/ModelSelector";
import { initialMessages, createUserMessage, createAssistantMessage, createLoadingMessage, generateWindowId } from "@/utils/chatUtils";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import ResponseHistorial from "@/components/ResponseHistorial";

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : initialMessages;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Llama-3.1-8B-Instruct-q4f32_1-MLC");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<any>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [currentWindowId, setCurrentWindowId] = useState<number | null>(() => {
    const savedWindowId = localStorage.getItem("currentWindowId");
    return savedWindowId ? parseInt(savedWindowId, 10) : generateWindowId();
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    localStorage.setItem("currentWindowId", currentWindowId!.toString());
  }, [messages, currentWindowId]);

  const handleModelChange = async (modelName: string) => {
    setSelectedModel(modelName);
    setIsModelLoaded(false);
    setLoadingProgress(0);

    try {
      toast({ title: "Loading ...", description: `Please, wait a minute until Tweety is loaded.` });
    
      // Importamos la librería desde un módulo local en tu código fuente
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm"); // Asegúrate de que está instalada
    
      // Ruta local al modelo (desde `public/`)
      const modelPath = `/models/Llama-3.1-8B-Instruct-q4f32_1-MLC`;
    
      const newEngine = await CreateMLCEngine(modelName, {
        model_lib_path: modelPath, // Se pasa la ruta correcta como string
        initProgressCallback: (progress: number) => {
          setLoadingProgress(progress);
        },
      });
    
      setEngine(newEngine);
      setIsModelLoaded(true);
      toast({ title: "Success", description: `Tweety is ready to use!` });
    } catch (error) {
      console.error("Failed to load model:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load model locally" });
    }
  };

  const handleSendMessage = async (content: string, isReload = false) => {
    if (!content.trim() || !engine) return;

    if (!isReload) {
      const userMessage = createUserMessage(content, currentWindowId!);
      setMessages((prev) => [...prev, userMessage]);
    }

    setIsGenerating(true);

    let assistantMessage = createAssistantMessage("", currentWindowId!);
    assistantMessage.isLoading = true;
    setMessages((prev) => [...prev, assistantMessage]);

    // Crear un nuevo AbortController para esta solicitud
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    try {
      const chatMessages = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content },
      ];

      const chunks = await engine.chat.completions.create({
        messages: chatMessages,
        temperature: 1,
        stream: true,
        stream_options: { include_usage: true },
        signal: newAbortController.signal, // Asociamos el abortController
      });

      let reply = "";
      for await (const chunk of chunks) {
        if (newAbortController.signal.aborted) break; // Si se cancela, salimos del bucle

        const delta = chunk.choices[0]?.delta.content || "";
        reply += delta;

        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { ...createAssistantMessage(reply, currentWindowId!), isLoading: false };
          return updatedMessages;
        });
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate response" });
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null); // Limpiamos el AbortController cuando termina
    }
  };

  // Detener generación
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort(); // Detiene la respuesta en curso
      setAbortController(null);
      setIsGenerating(false);

      toast({ title: "Stopped", description: "Generation was stopped by the user." });

      // Opcional: Dejar el mensaje con lo generado hasta el momento
      setMessages((prev) => {
        const updatedMessages = [...prev];
        if (updatedMessages.length > 0) {
          updatedMessages[updatedMessages.length - 1].isLoading = false;
        }
        return updatedMessages;
      });
    }
  };

  // Recargar última respuesta
  const handleReload = () => {
    const lastUserMessage = messages.findLast((msg) => msg.role === "user");
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, true);
    }
  };

  const onRefresh = () => {
    // setMessages([]);  // Borra todos los mensajes
    // setIsGenerating(false);
    // setAbortController(null);
    // setCurrentWindowId(generateWindowId());
    // localStorage.removeItem("chatMessages"); // Elimina los mensajes del localStorage
    // localStorage.removeItem("currentWindowId"); // Elimina el windowId del localStorage
  };

  useEffect(() => {
    handleModelChange(selectedModel);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-black">
      <Header onPress={onRefresh} title="Tweety" />
      <div className="flex flex-1">
        <aside className="w-1/5 p-4 md:p-6 bg-gray-900 h-full">
          <ResponseHistorial />
        </aside>
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 pt-6">
            <div className="max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                  isLoading={message.isLoading}
                  onStop={handleStopGeneration}
                  onReload={() => handleSendMessage(message.content, true)}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </main>
          <footer className="p-4 md:p-6">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isGenerating || !isModelLoaded}
              placeholder={isModelLoaded ? "Type a message..." : `Loading ...`}
            />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
