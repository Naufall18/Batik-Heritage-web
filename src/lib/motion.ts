import type { Variants } from 'framer-motion'

// Kurva ease-out lembut (masuk terasa alami, keluar responsif)
export const ease = [0.22, 1, 0.36, 1] as const

/** Container yang men-stagger anak-anaknya saat muncul. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

/** Elemen naik + fade — dipakai bersama staggerContainer. */
export const fadeUp: Variants = {
  hidden: { y: 22, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease } },
}

/** Fade + skala halus (untuk kartu / media). */
export const fadeScale: Variants = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease } },
}

/** Props siap-pakai untuk reveal saat masuk viewport (scroll). */
export const revealOnScroll = {
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-80px' },
  variants: staggerContainer,
}
