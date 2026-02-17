import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("bookstore_token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        // Check for expiration if applicable: if (decoded.exp * 1000 < Date.now()) ...
        setUser({
          email: decoded.sub, // 'sub' usually holds the username/email in standard JWTs, adjust based on your actual claim
          role: decoded.roles || decoded.role, // Adjust based on your actual claim name
          ...decoded
        });
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch (e) {
        console.error("Invalid token:", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/users/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);
      // Backend returns the token directly as a string, or potentially as an object
      const token = typeof response.data === 'string' ? response.data : (response.data.token || response.data.jwt || response.data.accessToken);

      if (!token) throw new Error(`No token received. Response: ${JSON.stringify(response.data)}`);

      const decoded = jwtDecode(token);

      const userData = {
        email: decoded.sub,
        role: decoded.roles || decoded.role,
        ...decoded
      };

      // OPTIMIZATION: If the login response contains the user ID directly (e.g. { token: "...", id: 7 }), use it!
      // This saves us from having to fetch it later.
      if (response.data && typeof response.data === 'object') {
        if (response.data.id) userData.id = response.data.id;
        if (response.data.userId) userData.id = response.data.userId;

        // Sometimes it might be nested in a 'user' object
        if (response.data.user && response.data.user.id) userData.id = response.data.user.id;
      }

      console.log("Updated User Context:", userData);

      setUser(userData);
      setToken(token);
      localStorage.setItem("bookstore_token", token);
      localStorage.setItem("bookstore_user", JSON.stringify(userData));
      // Also set as cookie in case backend requires it
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return userData; // Return user data for redirection logic
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, role = "USER") => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/users/auth/register", {
        name,
        email,
        password,
        role // Send the specific role
      });
      // Automatically login after register or just return true to redirect to login
      // For now, let's just return true and let the component decide (usually redirect to login)
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bookstore_token");
    localStorage.removeItem("bookstore_user");
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const role = user?.role ?? null;
  // Handle role being an array (e.g. ["ROLE_ADMIN"]) or a string ("admin")
  const isAdmin = Array.isArray(role)
    ? role.includes("ROLE_ADMIN") || role.includes("admin") || role.includes("ADMIN")
    : role === "admin" || role === "ROLE_ADMIN" || role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, role, isAdmin, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
