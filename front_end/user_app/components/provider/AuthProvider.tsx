'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // 1. Import ini
import api from '@/lib/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname(); // 2. Ambil path URL saat ini

  useEffect(() => {
    // 3. LOGIC SKIP: Kalau sedang di login/register, langsung anggap Ready & Stop.
    // Tidak perlu cek session ke server (hemat request & cegah konflik).
    const authRoutes = ['/', '/login', '/register'];
    if (authRoutes.includes(pathname)) {
      setIsReady(true);
      return;
    }

    const initializeAuth = async () => {
      try {
        // Cek session hanya jika BUKAN di halaman login
        await api.post('/api/auth/refresh'); // Pastikan path sesuai dengan route.ts kamu
        console.log("Session refreshed via Cookie!");
      } catch (error) {
        console.log("Guest mode or Session expired");
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Biarkan array kosong agar hanya jalan sekali saat website pertama dibuka (Hard Refresh)

  // 4. UX: Tampilkan Loading Spinner sederhana daripada layar putih total
  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Memuat sesi...</div>
      </div>
    );
  }

  return <>{children}</>;
}