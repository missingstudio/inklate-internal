import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: any | null;
  setUser: (user: any | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<any | null>(null);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
