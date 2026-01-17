"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/axios";

// Type untuk User
interface User {
  id: string;
  name: string;
  email: string;
  nim: string;
  role: string;
  profile_picture: string | null;
  has_voted: boolean;
}

// Type untuk Auth Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook untuk menggunakan Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch user dari /api/auth/me
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      const userData = res.data.result;
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // Refetch user (untuk dipanggil setelah login)
  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    // Skip auth check untuk public routes
    const publicRoutes = ["/", "/login", "/register", "/auth/google/callback"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicRoute) {
      // Tetap coba fetch user untuk navbar (optional)
      fetchUser().finally(() => setIsLoading(false));
      return;
    }

    // Fetch user dari backend
    fetchUser().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-sm text-gray-500 font-retro">Memuat sesi...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}