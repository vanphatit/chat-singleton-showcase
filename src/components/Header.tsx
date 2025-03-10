
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isSingleton: boolean;
  toggleSingleton: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSingleton, toggleSingleton }) => {
  return (
    <header className="glass-panel px-6 py-4 mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageCircle className="text-primary" size={24} />
        <h1 className="text-xl font-semibold">Singleton Chat Demo</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          {isSingleton ? 'Singleton Mode' : 'Non-Singleton Mode'}
        </span>
        
        <button 
          role="switch"
          aria-checked={isSingleton}
          onClick={toggleSingleton}
          className={cn("toggle-switch", isSingleton ? "bg-primary" : "bg-muted-foreground")}
        >
          <span className="toggle-thumb" />
          <span className="sr-only">
            {isSingleton ? 'Disable Singleton Mode' : 'Enable Singleton Mode'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
