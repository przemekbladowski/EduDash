import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "teacher" | "admin";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  subject?: string;
  initials: string;
  color?: string;
  hourlyRate?: number;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_ACCOUNTS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: "anna@szkola.pl",
    password: "123456",
    user: {
      id: 1,
      name: "Anna Kowalska",
      email: "anna@szkola.pl",
      role: "teacher",
      subject: "Matematyka",
      initials: "AK",
      color: "#6366F1",
      hourlyRate: 80,
    },
  },
  {
    email: "piotr@szkola.pl",
    password: "123456",
    user: {
      id: 2,
      name: "Piotr Nowak",
      email: "piotr@szkola.pl",
      role: "teacher",
      subject: "Fizyka",
      initials: "PN",
      color: "#059669",
      hourlyRate: 75,
    },
  },
  {
    email: "admin@szkola.pl",
    password: "123456",
    user: {
      id: 0,
      name: "Admin Systemu",
      email: "admin@szkola.pl",
      role: "admin",
      initials: "AS",
      color: "#0F172A",
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );
    if (account) {
      setUser(account.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}