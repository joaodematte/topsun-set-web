import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

export type User = {
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string;
};

type UserContextType = {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  setLoggedUser: Dispatch<SetStateAction<User | null>>;
  isUserAuthenticated: boolean;
};

export const UserContext = createContext({} as UserContextType);

export const UserProvider: React.FC = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const isUserAuthenticated = !!loggedUser;

  const router = useRouter();

  const signIn = async (username: string, password: string) => {
    await api
      .post("/auth", { username, password })
      .then((res) => {
        setCookie(undefined, "topsunauth.token", res.data.token, {
          path: "/",
          maxAge: 60 * 60 * 12,
        });

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        delete res.data.token;

        setLoggedUser(res.data);

        router.push("/dashboard");

        return res.data;
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  };

  const signOut = () => {
    destroyCookie(null, "topsunauth.token", {
      path: "/",
    });
    router.push("/");
    setLoggedUser(null);
  };

  useEffect(() => {
    const { "topsunauth.token": token } = parseCookies();

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const fetchLoggedUsedData = async () => {
        await api
          .get("/users/me")
          .then((res) => {
            setLoggedUser(res.data);
          })
          .catch((err) => console.error(err.response));
      };

      fetchLoggedUsedData();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: loggedUser,
        signIn,
        signOut,
        setLoggedUser,
        isUserAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
