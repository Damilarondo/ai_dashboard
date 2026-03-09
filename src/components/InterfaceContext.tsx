'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type InterfaceMode = 'simple' | 'expert';

interface InterfaceContextType {
  mode: InterfaceMode;
  toggleMode: () => void;
}

const InterfaceContext = createContext<InterfaceContextType | undefined>(undefined);

export function InterfaceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<InterfaceMode>('simple');

  useEffect(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('interface_mode') as InterfaceMode;
    if (saved === 'expert' || saved === 'simple') {
      setMode(saved);
    }
  }, []);

  const toggleMode = () => {
    setMode(prev => {
      const newMode = prev === 'simple' ? 'expert' : 'simple';
      localStorage.setItem('interface_mode', newMode);
      return newMode;
    });
  };

  return (
    <InterfaceContext.Provider value={{ mode, toggleMode }}>
      <div className={`app-mode-${mode}`}>
        {children}
      </div>
    </InterfaceContext.Provider>
  );
}

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within an InterfaceProvider');
  }
  return context;
}
