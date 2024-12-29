import { createContext, useContext, useState, useEffect } from "react";

import { User } from "@/types/User";
import { api } from "@/api/api";

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    name: string,
    email: string,
    password: string,
    plan: string
  ) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const userData = response.data;

      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await api.post("/users/signup", { name, email, password });

      // אחרי הרשמה, התחבר אוטומטית עם הנתונים שסופקו
      await login(email, password);
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
