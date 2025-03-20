
// import React, { createContext, useState, useEffect, useMemo } from "react";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [auth, setAuth] = useState(() => {
//     const token = localStorage.getItem("accessToken");
//     return token ? { token, isAuthenticated: true } : { token: null, isAuthenticated: false };
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token && !auth.isAuthenticated) {
//       setAuth({ token, isAuthenticated: true });
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem("accessToken", token);
//     setAuth({ token, isAuthenticated: true });
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setAuth({ token: null, isAuthenticated: false });
//   };

//   // Memoize the auth object to avoid unnecessary re-renders
//   const authValue = useMemo(() => ({ ...auth, login, logout }), [auth]);

//   return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
// }

import React, { createContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const getTokenData = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken"); // Remove expired token
        return null;
      }
      return { token, exp: payload.exp };
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("accessToken");
      return null;
    }
  };

  const [auth, setAuth] = useState(() => {
    const tokenData = getTokenData();
    return tokenData ? { token: tokenData.token, isAuthenticated: true } : { token: null, isAuthenticated: false };
  });

  const logout = (expired = false, callback) => {
    localStorage.removeItem("accessToken");
    setAuth({ token: null, isAuthenticated: false });
  
    const baseUrl = window.ENV.VITE_PROJECT_NAME || ""; // ✅ Get base URL from env
    const redirectUrl = expired ? `${baseUrl}/login?sessionExpired=true` : `${baseUrl}/login`;
  
    console.log("Redirecting to:", redirectUrl); // Debugging
  
    if (expired==true) {
      window.location.href = redirectUrl; // ✅ Force full reload only if session expired
    } else if (callback) {
      callback(redirectUrl); // ✅ Use callback for normal logout
    }
  };
  
  

  const login = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      return;
    }

    localStorage.setItem("accessToken", token);
    setAuth({ token, isAuthenticated: true });

    const remainingTime = payload.exp * 1000 - Date.now();
      setTimeout(() => logout(true, logout), remainingTime);
  };

  const authValue = useMemo(() => ({ ...auth, login, logout }), [auth]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
