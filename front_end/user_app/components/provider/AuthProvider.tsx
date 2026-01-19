"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
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
  const isMountedRef = useRef(true);

  // Fetch user dari /api/auth/me dengan retry logic untuk handle race condition
  const fetchUser = useCallback(async (retries = 3, delay = 100) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await api.get("/auth/me");
        const userData = res.data.result;

        // Hanya update state jika component masih mounted
        if (isMountedRef.current) {
          setUser(userData);
        }
        return userData;
      } catch (error: any) {
        const status = error.response?.status;

        // 401/403 = User belum login, ini NORMAL bukan error
        // Langsung return null tanpa retry dan tanpa log error
        if (status === 401 || status === 403) {
          if (isMountedRef.current) {
            setUser(null);
          }
          return null;
        }

        // Server error (500, 502, 503) - worth retrying
        const isRetryable = status === 500 || status === 502 || status === 503;

        if (isRetryable && attempt < retries - 1) {
          const waitTime = delay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else if (!isRetryable) {
          // Error lain yang tidak perlu di-retry
          break;
        }
      }
    }

    // Jika semua retry gagal, set user ke null tanpa error di console
    if (isMountedRef.current) {
      setUser(null);
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout errors - user akan tetap di-redirect
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  // Refetch user (untuk dipanggil setelah login)
  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Fetch user saat pathname berubah
  useEffect(() => {
    fetchUser().finally(() => {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    });
  }, [pathname, fetchUser]);

  // Cleanup: set isMounted ke false saat unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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