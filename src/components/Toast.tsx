import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#141822] border border-[#2b3345] shadow-2xl text-xs font-mono text-neutral-200 animate-in slide-in-from-bottom-5 duration-200">
      <CheckCircle2 className="w-4 h-4 text-[#d4ff00] flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="text-neutral-400 hover:text-white ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
