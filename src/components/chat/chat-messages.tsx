"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function Chat({ id }: { id: string }) {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { user: "Você", text: message }]);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col w-full h-[calc(100vh-180px)] overflow-y-auto mt-5 p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mt-5 w-full rounded-full flex gap-2 ${
              msg.user === "Você" ? "justify-end" : "justify-start"
            } items-center`}
          >
            <div
              className={`bg-white min-w-20 max-w-96 p-2 rounded-lg text-md ${
                msg.user === "Você" ? "text-end" : ""
              }`}
            >
              <h4 className="font-bold">{msg.user}</h4>
              <p className="">{msg.text}</p>
            </div>
            <div className="w-14 h-14 bg-white rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="bg-white flex items-center justify-between p-2 w-full h-12 rounded-lg mt-auto">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Adicionando o evento de tecla pressionada
          className="border-none focus:ring-0 focus:outline-none"
          style={{ boxShadow: "none" }}
        />
        <Send
          onClick={handleSendMessage}
          className="mr-3 text-gray-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
