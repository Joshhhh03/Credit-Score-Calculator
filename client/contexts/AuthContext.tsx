import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  hasCompletedProfile: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and validate it
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("creditbridge_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // Validate the stored session is still valid
          try {
            const response = await fetch("/api/auth/validate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: userData.userId }),
            });

            if (response.ok) {
              const result = await response.json();
              if (result.valid) {
                setUser(userData);
                // Update last login time
                const updatedUser = {
                  ...userData,
                  lastLogin: new Date().toISOString(),
                };
                setUser(updatedUser);
                localStorage.setItem(
                  "creditbridge_user",
                  JSON.stringify(updatedUser),
                );
              } else {
                // Session invalid, clear stored data
                localStorage.removeItem("creditbridge_user");
              }
            } else {
              // If validation fails, keep the user but don't update
              setUser(userData);
            }
          } catch (validationError) {
            // If validation request fails, still use stored user data
            setUser(userData);
          }
        }
      } catch (error) {
        // If there's an error parsing stored data, clear it
        localStorage.removeItem("creditbridge_user");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userWithTimestamp = {
          ...data.user,
          lastLogin: new Date().toISOString(),
        };
        setUser(userWithTimestamp);
        localStorage.setItem(
          "creditbridge_user",
          JSON.stringify(userWithTimestamp),
        );
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (data.success) {
        // Auto sign in after successful signup
        const signInResult = await signIn(email, password);
        return signInResult;
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("creditbridge_user");
    // Clear any other stored session data
    localStorage.removeItem("creditbridge-welcome-seen");
    localStorage.removeItem("creditbridge-rating-shown");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("creditbridge_user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
