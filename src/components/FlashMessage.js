'use client';

import { useFlash } from '../context/FlashContext';

export default function FlashMessage() {
  const { message, type, visible, hideMessage } = useFlash();

  if (!visible) return null;

  const styles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 animate-bounce-in`}>
      <div className={`${styles[type] || 'bg-gray-800'} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-4`}>
        <p>{message}</p>
        <button 
          onClick={hideMessage}
          className="hover:text-gray-200 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}