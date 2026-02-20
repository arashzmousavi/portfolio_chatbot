"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const AI_ICON = "/images/django-svgrepo-com.svg";
const USER_ICON = "/images/user-svgrepo-com.svg";

export default function AIChat() {
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "سلام من دستیارهوش مصنوعی آرش هستم. میتونی در مورد رزومه ام سوال کنی",
    },
  ]);

  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL;

    const wsUrl = baseUrl.replace("http", "ws") + "/api/ws/chat";

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "ai",
          text: event.data,
        },
      ]);
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;

    const newMsg = {
      id: Date.now(),
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, newMsg]);

    socketRef.current.send(input);

    setInput("");
  };

  return (
    <div className="mt-20 w-full mx-auto px-4">
      <h2 className="text-5xl font-sans font-bold text-left text-white/95">
        AI Assistant
      </h2>

      <div className="bg-white/5 backdrop-blur-xl mt-12 border border-white/10 rounded-3xl p-6 h-125 flex flex-col">
        {/* Status indicator (نامرئی تو UI چون استایل نزدی) */}
        <div className="hidden">
          {connected ? "connected" : "disconnected"}
        </div>

        <div dir="ltr" className="flex-1 overflow-y-auto space-y-4 pr-2">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 items-start ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "ai" && (
                  <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0">
                    <Image
                      src={AI_ICON}
                      fill
                      alt="AI"
                      className="object-contain"
                    />
                  </div>
                )}

                <div
                  dir="auto"
                  className={`
                    max-w-[70%] px-4 py-2 rounded-2xl
                    text-white text-sm
                    ${
                      msg.type === "ai"
                        ? "bg-primary/20 backdrop-blur-sm border border-white/10"
                        : "bg-white/10"
                    }
                  `}
                >
                  {msg.text}
                </div>

                {msg.type === "user" && (
                  <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0">
                    <Image
                      src={USER_ICON}
                      fill
                      alt="User"
                      className="object-contain"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSend}
            className="px-5 py-3 rounded-2xl bg-secondary text-black font-semibold cursor-pointer hover:bg-primary/90 transition-colors duration-300"
          >
            Send
          </button>

          <input
            dir="auto"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-primary transition-all duration-300"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
      </div>
    </div>
  );
}