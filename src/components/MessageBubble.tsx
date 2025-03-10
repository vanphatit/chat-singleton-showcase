
import React from 'react';
import { Message } from '../utils/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isLastMessage: boolean;
  delay?: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLastMessage,
  delay = 0 
}) => {
  const [visible, setVisible] = React.useState(!isLastMessage);
  
  React.useEffect(() => {
    if (isLastMessage) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isLastMessage, delay]);

  return (
    <div 
      className={cn(
        "chat-bubble",
        message.sender === 'user' ? "chat-bubble-self" : "chat-bubble-other",
        isLastMessage && !visible ? "opacity-0 translate-y-2" : "message-appear"
      )}
      style={{ 
        animationDelay: visible ? `${delay}ms` : '0ms',
        animationFillMode: 'both'
      }}
    >
      {message.text}
    </div>
  );
};

export default MessageBubble;
