import { TargetAndTransition, Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export const popUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

// animasi container (section)
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

// animasi tiap card
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


// 1. Definisikan konfigurasi animasi Idle di sini (atau di animations.ts)
export const floatingAnimation: TargetAndTransition = {
  y: [0, -15, 0], // Bergerak ke atas 15px lalu kembali
  rotate: [0, 1, -1, 0], // Sedikit rotasi agar natural
  transition: {
    duration: 4, // Durasi satu siklus (makin besar makin lambat)
    repeat: Infinity, // Ulangi selamanya
    ease: "easeInOut",
  },
};

export const breathingAnimation: TargetAndTransition = {
  scale: [1, 1.02, 1], // Membesar sedikit lalu kembali
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const slowFloatingAnimation = {
  y: [-10, 10, -10], // Gerakannya vertikal naik turun
  transition: {
    duration: 6, // Lebih lambat dari badge (4s) karena objeknya besar
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const crtIdleAnimation = {
    opacity: [0.98, 1, 0.97, 1], // Opacity berubah sangat sedikit
    boxShadow: [
        "0 0 20px rgba(0, 255, 0, 0.1)", 
        "0 0 25px rgba(0, 255, 0, 0.2)", 
        "0 0 20px rgba(0, 255, 0, 0.1)"
    ], // Glow hijau berdenyut
    transition: {
        duration: 3, // Durasi lambat agar tidak bikin pusing
        repeat: Infinity,
        ease: "easeInOut" as const,
    }
};

// 2. Status Blinking (Khusus status yang bukan [ OK ])
export const statusPulse = {
    opacity: [1, 0.4, 1],
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
    }
};

