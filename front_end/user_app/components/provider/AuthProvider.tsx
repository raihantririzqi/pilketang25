'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios'; // Gunakan axios instance kita
// Hapus import setAccessToken karena sudah tidak dipakai

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Panggil Proxy Refresh kita
        // Tujuannya: Cek apakah Refresh Token di browser masih valid.
        // Jika valid, Proxy akan otomatis memperbarui Cookie "token" (Access Token).
        await api.post('/auth/refresh');
        
        console.log("Session refreshed via Cookie!");
      } catch (error) {
        // Jika gagal (Refresh token expired/tidak ada), user dibiarkan.
        // Nanti Middleware yang akan menendang user jika dia coba masuk halaman rahasia.
        console.log("Guest mode or Session expired");
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();
  }, []);

  // Opsional: Tampilkan loading putih kosong sampai cek session selesai
  // Agar tidak ada efek "flicker" (kedip)
  if (!isReady) return null; 

  return <>{children}</>;
}