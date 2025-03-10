
import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatWindowProps } from '../utils/types';
import MessageBubble from './MessageBubble';
import ChatSingleton from '../utils/ChatSingleton';
import { cn } from '@/lib/utils';
import { X, Send } from 'lucide-react';

const ChatWindow: React.FC<ChatWindowProps> = ({ isSingleton, onClose, windowId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatSingleton = ChatSingleton.getInstance();

  // For non-singleton mode, we add a welcome message
  useEffect(() => {
    if (!isSingleton) {
      const initialMessage: Message = {
        id: `msg_${Date.now()}`,
        text: "This is a new chat instance. Messages will be lost when closed.",
        sender: 'system',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    } else {
      // For singleton mode, we get messages from the singleton
      chatSingleton.setOpen(true);
      setMessages(chatSingleton.getMessages());
    }

    // Focus the input field when the chat window opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => {
      if (isSingleton) {
        chatSingleton.setOpen(false);
      }
    };
  }, [isSingleton]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    if (isSingleton) {
      chatSingleton.addMessage(inputText, 'user');
      setMessages(chatSingleton.getMessages());
    } else {
      setMessages([...messages, newMessage]);
    }
    
    setInputText('');
    
    // Auto response in 500-1000ms
    setTimeout(() => {
      const responseText = isSingleton 
        ? "Message saved in Singleton instance. Will be here when you return."
        : "This message will be lost when you close this window.";
        
      const responseMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: responseText,
        sender: 'system',
        timestamp: new Date()
      };
      
      if (isSingleton) {
        chatSingleton.addMessage(responseText, 'system');
        setMessages(chatSingleton.getMessages());
      } else {
        setMessages(prev => [...prev, responseMessage]);
      }
    }, Math.random() * 500 + 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window-appear glass-panel flex flex-col h-[500px] w-[350px] overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "h-3 w-3 rounded-full",
            isSingleton ? "bg-primary" : "bg-destructive"
          )}></div>
          <h3 className="font-medium">
            {isSingleton ? 'Singleton Chat' : `New Chat #${windowId}`}
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
      
      {/* Messages Container */}
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
      
      {/* Input Area */}
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
            disabled={inputText.trim() === ''}
            className={cn(
              "p-2 rounded-full transition-all",
              inputText.trim() !== '' 
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
