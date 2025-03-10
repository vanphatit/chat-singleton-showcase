
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

export interface ChatWindowProps {
  isSingleton: boolean;
  onClose: () => void;
  windowId: string;
}
