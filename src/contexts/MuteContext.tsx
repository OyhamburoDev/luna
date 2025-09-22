import React, { createContext, useContext, useState } from "react";

type MuteContextType = {
  isMuted: boolean;
  toggleMute: () => void;
};

const MuteContext = createContext<MuteContextType | undefined>(undefined);

export function MuteProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <MuteContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </MuteContext.Provider>
  );
}

export function useMute() {
  const context = useContext(MuteContext);
  if (!context) {
    throw new Error("useMute debe usarse dentro de MuteProvider");
  }
  return context;
}
