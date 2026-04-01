import { jsx } from "react/jsx-runtime";
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
const AUTH_KEY = "exam_manager_auth";
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);
  const persistUser = (u) => {
    setUser(u);
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  };
  const signInWithGoogle = () => {
    const mockUser = {
      email: "user@gbu.ac.in",
      name: "GBU User"
    };
    persistUser(mockUser);
  };
  const signInWithCredentials = (identifier) => {
    const mockUser = {
      email: identifier.includes("@") ? identifier : `${identifier}@gbu.ac.in`,
      name: identifier
    };
    persistUser(mockUser);
  };
  const signOut = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        isAuthenticated: !!user,
        loading,
        signInWithGoogle,
        signInWithCredentials,
        signOut
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }
  return context;
}
export {
  AuthProvider,
  useAuth
};
