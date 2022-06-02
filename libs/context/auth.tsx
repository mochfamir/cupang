import { getAuth } from "@libs/firebase";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type authContextType = {
  isLoggedIn: boolean;
  user: any;
  setUser: (user: any) => void;
  setAnjing: (user: any) => void;
  getUser: () => any;
  login: () => void;
  logout: () => void;
};

type Props = {
  children: ReactNode;
};

const authContextDefaultValues: authContextType = {
  isLoggedIn: Boolean(null),
  setUser: () => {},
  setAnjing: () => {},
  user: {},
  getUser: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(null));
  const [user, _setUser] = useState({} as any);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const setUser = (value: any) => {
    console.log('SET USERRRR', value);
    _setUser(value);
  };

  const setAnjing = (value: any) => {
    console.log('ANJINGGG')
  }

  const getUser = () => {
    return user
  }

  const value = {
    isLoggedIn,
    setUser,
    setAnjing,
    user,
    getUser,
    login,
    logout,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
