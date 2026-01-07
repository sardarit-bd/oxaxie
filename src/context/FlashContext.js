
'use client';

import React, { createContext, useContext, useState } from 'react';

const FlashContext = createContext();

export const FlashProvider = ({ children }) => {
  const [flash, setFlash] = useState({ message: '', type: '', visible: false });

  const showMessage = (message, type = 'success', duration = 3000) => {
    setFlash({ message, type, visible: true });
    
    // Auto-hide after duration
    setTimeout(() => {
      hideMessage();
    }, duration);
  };

  const hideMessage = () => {
    setFlash((prev) => ({ ...prev, visible: false }));
  };

  return (
    <FlashContext.Provider value={{ ...flash, showMessage, hideMessage }}>
      {children}
    </FlashContext.Provider>
  );
};

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};