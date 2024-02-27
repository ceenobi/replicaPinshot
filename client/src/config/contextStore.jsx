import {
  createContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { userService } from "@services";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [fetchUser, setLoggedInUser] = useState("");
  const getUserRef = useRef();
  const loggedInUser = useMemo(() => fetchUser, [fetchUser]);
  // const loggedInUser = (getUserRef.current = fetchUser);

  const token = JSON.parse(localStorage.getItem("usertoken"));

  const getUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await userService.authUser();
      setLoggedInUser(data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  console.log(loggedInUser);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider value={{ loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
