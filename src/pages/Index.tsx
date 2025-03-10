
import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import Header from '../components/Header';
import ChatSingleton from '../utils/ChatSingleton';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isSingleton, setIsSingleton] = useState(false);
  const [chatWindows, setChatWindows] = useState<string[]>([]);
  const [singletonOpen, setSingletonOpen] = useState(false);
  const chatSingleton = ChatSingleton.getInstance();

  useEffect(() => {
    // If mode changes and we have open windows, reset everything
    setChatWindows([]);
    setSingletonOpen(false);
    
    // Reset the singleton instance when toggling modes
    chatSingleton.resetInstance();
  }, [isSingleton]);

  const toggleSingleton = () => {
    setIsSingleton(prev => !prev);
  };

  const handleOpenChat = () => {
    if (isSingleton) {
      if (!singletonOpen) {
        setSingletonOpen(true);
      }
    } else {
      // For non-singleton mode, create a new chat window with unique ID
      setChatWindows(prev => [...prev, `chat_${Date.now()}`]);
    }
  };

  const handleCloseChat = (windowId?: string) => {
    if (isSingleton) {
      setSingletonOpen(false);
    } else {
      setChatWindows(prev => prev.filter(id => id !== windowId));
    }
  };

  return (
    <div className="min-h-screen w-full p-6 lg:p-10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-4xl relative z-10 mb-8">
        <Header isSingleton={isSingleton} toggleSingleton={toggleSingleton} />
        
        <div className="glass-panel p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Chat Design Pattern Demo</h2>
            <p className="text-muted-foreground">
              {isSingleton 
                ? "Singleton Mode: One persistent chat instance that retains messages." 
                : "Non-Singleton Mode: New chat instance created every time, messages are lost when closed."}
            </p>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleOpenChat}
              className={cn(
                "glass-button group flex items-center gap-2",
                isSingleton && singletonOpen ? "opacity-50 cursor-not-allowed" : "hover:shadow-medium"
              )}
              disabled={isSingleton && singletonOpen}
            >
              <span className="text-primary">Open Chat</span>
              <span className={cn(
                "h-2 w-2 rounded-full", 
                isSingleton ? "bg-primary" : "bg-destructive"
              )}></span>
            </button>
          </div>
          
          <div className="pt-4">
            <div className="text-sm text-muted-foreground">
              {isSingleton ? (
                <>Current Status: {singletonOpen ? <span className="text-primary">Singleton Chat Open</span> : "No Active Chat"}</>
              ) : (
                <>Current Status: <span className="text-destructive">{chatWindows.length} Chat Windows Open</span></>
              )}
            </div>
          </div>
          
          <div className="pt-4 space-y-2 text-sm text-left">
            <h3 className="font-medium">How it works:</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Singleton pattern ensures only one instance of a class exists</li>
              <li>In chat applications, it prevents duplicate instances and data loss</li>
              <li>Toggle the mode to see the difference in behavior</li>
            </ul>
          </div>
          
          <div className="text-sm text-muted-foreground pt-4">
            <div className="flex gap-4 justify-center">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                <span>Singleton Chat</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive"></span>
                <span>Non-Singleton Chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat windows container - position at bottom right */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 z-20">
        {isSingleton && singletonOpen && (
          <ChatWindow 
            isSingleton={true} 
            onClose={() => handleCloseChat()} 
            windowId="singleton"
          />
        )}
        
        {!isSingleton && chatWindows.map((windowId) => (
          <ChatWindow 
            key={windowId} 
            isSingleton={false} 
            onClose={() => handleCloseChat(windowId)} 
            windowId={windowId.split('_')[1]}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
