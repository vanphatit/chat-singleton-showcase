
import { Message } from './types';

class ChatSingleton {
  private static instance: ChatSingleton | null = null;
  private messages: Message[] = [];
  private isOpen: boolean = false;
  private id: string;

  private constructor() {
    this.id = `chat_${Date.now()}`;
    // Private constructor to prevent direct instantiation
    this.addSystemMessage("This is the Singleton chat. Messages will persist when closed and reopened.");
  }

  public static getInstance(): ChatSingleton {
    if (!ChatSingleton.instance) {
      ChatSingleton.instance = new ChatSingleton();
    }
    return ChatSingleton.instance;
  }

  public getInstanceId(): string {
    return this.id;
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public addMessage(text: string, sender: 'user' | 'system'): void {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date()
    };
    this.messages.push(newMessage);
  }

  private addSystemMessage(text: string): void {
    this.addMessage(text, 'system');
  }

  public setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
  }

  public isWindowOpen(): boolean {
    return this.isOpen;
  }

  public resetInstance(): void {
    this.messages = [];
    this.isOpen = false;
    this.addSystemMessage("This is the Singleton chat. Messages will persist when closed and reopened.");
  }
}

export default ChatSingleton;
