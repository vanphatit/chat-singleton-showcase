import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
          {isSingleton ? "Singleton Mode" : "Non-Singleton Mode"}
        </span>

        <div
          role="switch"
          aria-checked={isSingleton}
          onClick={toggleSingleton}
          className={cn(
            "relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-all",
            isSingleton ? "bg-blue-500" : "bg-gray-500"
          )}
        >
          <div
            className={cn(
              "absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all",
              isSingleton ? "translate-x-6" : "translate-x-0"
            )}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
