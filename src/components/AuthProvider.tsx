import {
  useContext,
  useState,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { User, userSchema } from "../types";
import jwtDecode from "jwt-decode";
import { parseObjWithId } from "../validations";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isPending: boolean;
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
  const [isPending, setIsPending] = useState(true);

  //TODO: This needs a better name!
  async function doAuth() {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsPending(false);
    } else {
      const decoded = jwtDecode(storedToken);
      try {
        const parsed = parseObjWithId(decoded);

        const requestOptions = {
          method: "GET",
        };
        const response = await fetch(
          `http://localhost:3000/users/${parsed.id}`,
          requestOptions
        );
        const json = await response.json();
        const parseduser = userSchema.parse(json);

        setIsPending(false);
        setUser(parseduser);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    doAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}
