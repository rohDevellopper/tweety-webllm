import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";

const ResponseHistorial = () => {
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    setChatMessages(storedMessages);
  }, []);

  const deleteQuery = (index: number) => {
    // setChatMessages((prev) => {
    //   const updatedMessages = prev.filter((_, i) => i !== index);
    //   localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    //   return updatedMessages;
    // });
    localStorage.removeItem("chatMessages"); // Elimina los mensajes del localStorage
    localStorage.removeItem("currentWindowId"); // Elimina el windowId del localStorage
    // window.location.reload();
  };

  const firstMessage = chatMessages.length > 0 ? chatMessages[0] : null;

  return (
    <div className="flex flex-col space-y-2">
      {firstMessage ? (
        <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
          <p className="truncate">{firstMessage.content}</p>
          <button onClick={() => deleteQuery(0)} className="text-red-500 hover:text-red-700">
            <Trash size={20} />
          </button>
        </div>
      ) : (
        <p className="text-gray-400">No hay consultas recientes.</p>
      )}
    </div>
  );
};

export default ResponseHistorial;