import { Message } from "./types";

class ChatNonSingleton {
  private messages: Message[] = [];
  private isOpen: boolean = false;
  private id: string;

  constructor(windowId: string) {
    this.id = windowId; // Mỗi instance có một ID riêng
    this.addSystemMessage("This is a new chat instance. Messages will be lost when closed.");
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

  public getInstanceId(): string {
    return this.id;
  }
}

export default ChatNonSingleton;