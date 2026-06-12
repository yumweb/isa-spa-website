import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getStoredUser,
  getToken,
  login as apiLogin,
  logout as apiLogout,
  setUnauthorizedHandler,
  type AuthUser,
} from "../lib/api";

type AuthState = {
  user: AuthUser | null;
  isAuthed: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getToken() ? getStoredUser() : null,
  );

  // Central 401 handler: any API call that 401s clears the session, which flips
  // the protected routes back to /login (no scattered redirect logic).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      apiLogout();
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthed: !!user,
      isAdmin: user?.role === "ADMIN",
      login: async (email, password) => {
        const u = await apiLogin(email, password);
        setUser(u);
      },
      logout: () => {
        apiLogout();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
