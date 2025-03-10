import React, { useState, useEffect, useRef } from "react";
import { Message, ChatWindowProps } from "../utils/types";
import MessageBubble from "./MessageBubble";
import ChatSingleton from "../utils/ChatSingleton";
import ChatNonSingleton from "../utils/ChatNonSingleton";
import { cn } from "@/lib/utils";
import { X, Send } from "lucide-react";

const ChatWindow: React.FC<ChatWindowProps & { highlight?: boolean }> = ({
  isSingleton,
  onClose,
  windowId,
  highlight,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatSingleton = ChatSingleton.getInstance();
  const chatInstance = !isSingleton ? new ChatNonSingleton(windowId) : null;

  useEffect(() => {
    if (isSingleton) {
      chatSingleton.setOpen(true);
      setMessages(chatSingleton.getMessages());
    } else {
      setMessages(chatInstance?.getMessages() || []);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => {
      if (isSingleton) {
        chatSingleton.setOpen(false);
      }
    };
  }, [isSingleton, windowId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;
  
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
  
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    if (isSingleton) {
      chatSingleton.addMessage(inputText, "user");
    } else {
      chatInstance?.addMessage(inputText, "user");
    }
  
    setInputText("");
  
    setTimeout(() => {
      const systemMessageText = isSingleton
        ? "Singleton Mode: Your messages are saved and will persist."
        : "Non-Singleton Mode: This chat is temporary, messages will be lost.";
  
      const systemMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: systemMessageText,
        sender: "system",
        timestamp: new Date(),
      };
  
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
  
      if (isSingleton) {
        chatSingleton.addMessage(systemMessage.text, "system");
      } else {
        chatInstance?.addMessage(systemMessage.text, "system");
      }
    }, 500);
  };  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "chat-window-appear glass-panel flex flex-col h-[500px] w-[350px] overflow-hidden",
        highlight ? "border-4 border-primary shadow-lg" : ""
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              highlight ? "border-4 border-primary shadow-lg" : "",
              isSingleton ? "bg-primary" : "bg-destructive"
            )}
          ></div>
          <h3 className="font-medium">
            {isSingleton
              ? `Singleton Chat (ID: ${windowId})`
              : `New Chat #${windowId}`}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLastMessage={index === messages.length - 1}
            delay={100}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === ""}
            className={cn(
              "p-2 rounded-full transition-all",
              inputText.trim() !== ""
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            )}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
