import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/api";
import { ToastContainer, toast, ToastOptions } from "react-toastify";

export interface AuthContextInterface {
  checkingSession: boolean | null;
  expiresAt: number | null;
  isAuthenticated: boolean | null;
  user: any;
  setUser: (value: any) => void;
  setCheckingSession: (value: boolean) => void;
  setExpiresAt: (value: number) => void;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  notification: (content: string, options: ToastOptions) => React.ReactText;
}

export const authContextDefaults: AuthContextInterface = {
  checkingSession: true,
  expiresAt: null,
  isAuthenticated: false,
  user: {},
  setUser: () => {},
  setCheckingSession: () => {},
  setExpiresAt: () => {},
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  notification: () => "",
};

export const AuthContext =
  createContext<AuthContextInterface>(authContextDefaults);

export const AuthProvider: React.FC = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState<boolean | null>(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  const notification = (
    content: string,
    options: ToastOptions
  ): React.ReactText => toast(content, options);

  const handleAuthentication = async (): Promise<void> => {
    try {
      const { error, expired } = await API.verifyJwt();

      if (error || expired) {
        setCheckingSession(false);
        setIsAuthenticated(false);
        navigate("/", { replace: true });
        return;
      }

      const user = window.localStorage.getItem("@miner");
      const expire = window.localStorage.getItem("@expireMiner");

      if (expire && new Date(expire) < new Date()) {
        setCheckingSession(false);
        setIsAuthenticated(false);
        navigate("/", { replace: true });
        return;
      }

      if (user && expire) {
        setUser(JSON.parse(user));
        setExpiresAt(JSON.parse(expire));
      }
    } catch (error) {
      return;
    }

    // setCheckingSession(false);
    // setIsAuthenticated(true);
    // navigate("/app", { replace: true });
  };

  const login = async (email: string, password: string) => {
    if (email.trim() === "" || password.trim() === "") {
      return notification("Preencha todos os campos", { type: "warning" });
    }

    const { error, user, expire } = await API.login(email, password);

    if (error) {
      return notification(error, { type: "warning" });
    }
    console.log(user, expire);
    try {
      window.localStorage.setItem("@miner", JSON.stringify(user));
      window.localStorage.setItem("@expireMiner", JSON.stringify(expire));

      setUser(user);
      setExpiresAt(expire || null);
      setCheckingSession(false);
      setIsAuthenticated(true);
      navigate("/app", { replace: true });

      return;
    } catch (error) {
      logout();
      return notification(
        "Erro ao salvar dados localmente. Faça o login novamente",
        { type: "warning" }
      );
    }
  };

  useEffect(() => {
    if (user) {
      try {
        window.localStorage.setItem("@miner", JSON.stringify(user));
      } catch (error) {
        window.localStorage.setItem("@miner", JSON.stringify(user));
      }
    }
  }, [user]);

  const retryLogout = async (plus: number) => {
    setTimeout(() => {
      logout(1000 + plus);
    }, 2000 + plus);
  };

  const logout = async (plus: number = 0) => {
    try {
      const { logout, error } = await API.logout();

      window.localStorage.removeItem("@miner");
      window.localStorage.removeItem("chests");
      window.localStorage.removeItem("@expireMiner");

      if (!logout || error) {
        retryLogout(plus + 1000);
        return;
      }

      setExpiresAt(null);
      setIsAuthenticated(false);
      navigate("/", { replace: true });

      return;
    } catch (error) {
      return { error: "Erro ao fazer logout" };
    }
  };

  useEffect(() => {
    try {
      const user = window.localStorage.getItem("@miner");

      if (user) {
        handleAuthentication();
      }
    } catch (error) {
      setIsAuthenticated(false);
      setCheckingSession(false);
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={
        {
          checkingSession,
          expiresAt,
          isAuthenticated,
          setExpiresAt,
          setIsAuthenticated,
          setCheckingSession,
          login,
          logout,
          user,
          setUser,
          notification,
        } as AuthContextInterface
      }
    >
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
