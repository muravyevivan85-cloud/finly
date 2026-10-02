import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { api } from "../services/api";
import type { User } from "../services/api";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user")
        ]);

        if (savedToken) {
          setToken(savedToken);
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(data: { token: string; user: User }) {
    await AsyncStorage.multiSet([
      ["token", data.token],
      ["user", JSON.stringify(data.user)]
    ]);

    setToken(data.token);
    setUser(data.user);
  }

  async function logout() {
    await AsyncStorage.multiRemove(["token", "user"]);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
