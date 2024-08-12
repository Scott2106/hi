import { createContext, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const updateAccessToken = useCallback((token) => {
    console.log("Updating access token:", token);
    setAccessToken(token);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      updateAccessToken,
    }),
    [accessToken, updateAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};