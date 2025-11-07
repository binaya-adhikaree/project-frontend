import { createContext, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  is_staff:boolean;
  is_superuser:boolean;
  last_name: string;
  company_name?: string;
  phone?: string;
  assigned_location?: {
    id: string;
    name: string;
  };
}



interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (username: string, password: string) => {
    try {
      // Remove old tokens first
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Login
      const res = await api.post("auth/login/", {
        username: username.trim(),
        password: password.trim(),
      });

      const { access, refresh } = res.data;

      // Save tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Fetch profile
      const profileRes = await api.get("auth/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      localStorage.setItem("user", JSON.stringify(profileRes.data));
      setUser(profileRes.data);
    } catch (err: any) {
      console.error(
        "Login failed:",
        err.response?.status,
        err.response?.data
      );
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
