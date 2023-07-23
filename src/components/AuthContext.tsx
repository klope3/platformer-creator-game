import { useContext, useState, createContext, ReactNode } from "react";
import { User } from "../types";

type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const AuthContext = createContext(null as AuthContextType | null);

export function useAuth() {
  const context = useContext(AuthContext);
  return {
    user: context ? context.user : null,
    setUser: context ? context.setUser : null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null as User | null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
