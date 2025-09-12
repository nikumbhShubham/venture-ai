import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ArrowRight, Loader, User, Bot } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isLoading: boolean;
  onSubmit: (businessIdea: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isLoading, onSubmit }) => {
  const [businessIdea, setBusinessIdea] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your AI branding assistant. Describe your business idea and I'll create a complete brand kit for you with logo, colors, fonts, and marketing strategy.",
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdea.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: businessIdea,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "Creating your brand kit... This may take a few minutes.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, loadingMessage]);
    
    // Call the generation function
    onSubmit(businessIdea);
    setBusinessIdea("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/30">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-purple-400" size={24} />
          <h2 className="text-lg font-semibold text-white">AI Brand Assistant</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "assistant" && (
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-700/50 text-slate-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 text-purple-400">
              <Loader className="animate-spin" size={16} />
              <span className="text-sm">Generating brand kit...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            placeholder="Describe your business idea... (e.g., A subscription box for artisanal coffee beans)"
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!businessIdea.trim() || isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;