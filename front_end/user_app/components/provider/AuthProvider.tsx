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

  // Fetch user dari /api/auth/me dengan retry logic untuk handle race condition
  const fetchUser = useCallback(async (retries = 3, delay = 50) => {
    let lastError: any = null;
    if (process.env.NODE_ENV === "development") {
      console.log("[AuthProvider] fetchUser called with retries:", retries);
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        if (process.env.NODE_ENV === "development") {
          console.log(`[AuthProvider] Attempt ${attempt + 1}/${retries} to fetch user`);
        }
        const res = await api.get("/auth/me");
        const userData = res.data.result;
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthProvider] User fetched successfully:", userData);
        }
        setUser(userData);
        return userData;
      } catch (error) {
        lastError = error;
        if (process.env.NODE_ENV === "development") {
          console.error(`[AuthProvider] Attempt ${attempt + 1} failed:`, error);
        }
        // Exponential backoff: 50ms, 100ms, 200ms
        if (attempt < retries - 1) {
          const waitTime = delay * Math.pow(2, attempt);
          if (process.env.NODE_ENV === "development") {
            console.log(`[AuthProvider] Retrying in ${waitTime}ms...`);
          }
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    // Jika semua retry gagal
    if (process.env.NODE_ENV === "development") {
      console.error("[AuthProvider] All retries failed, setting user to null");
      console.error("Failed to fetch user after retries:", lastError);
    }
    setUser(null);
    return null;
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

  // Di AuthProvider.tsx
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[AuthProvider] useEffect triggered, pathname:", pathname);
    }
    const publicRoutes = ["/", "/login", "/auth/google/callback"];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    if (isPublicRoute) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthProvider] Public route detected, fetching user...");
      }
      fetchUser().finally(() => {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthProvider] fetchUser completed (public route)");
        }
        setIsLoading(false);
      });
      return;
    }

    // Langsung fetch dengan retry logic, tidak perlu delay manual
    if (process.env.NODE_ENV === "development") {
      console.log("[AuthProvider] Protected route detected, fetching user...");
    }
    fetchUser().finally(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthProvider] fetchUser completed (protected route)");
      }
      setIsLoading(false);
    });
  }, [pathname]); // Hanya trigger saat pathname berubah, tidak fetchUser

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