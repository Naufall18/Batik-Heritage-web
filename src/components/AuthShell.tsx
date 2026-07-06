import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, PenTool, Leaf, HandHeart } from 'lucide-react'
import BatikMotif from './BatikMotif'
import { staggerContainer, fadeUp } from '../lib/motion'

const POINTS = [
  { Icon: PenTool, text: 'Karya tangan pengrajin asli' },
  { Icon: Leaf, text: 'Motif khas Pasuruan' },
  { Icon: HandHeart, text: 'Langsung dari UMKM lokal' },
]

export default function AuthShell({
  seed,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  seed: string
  eyebrow: string
  title: string
  subtitle: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col md:flex-row">
      {/* Kiri — form beranimasi */}
      <div className="flex w-full flex-col justify-center bg-mori px-6 py-10 md:w-1/2 md:px-14 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-nila/60 transition hover:text-soga"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Kembali ke beranda
          </Link>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2.5">
              <img src="/logo.svg" alt="Batik Heritage" className="h-10 w-10" />
              <span className="font-display text-xl font-semibold text-nila">Batik Heritage</span>
            </motion.div>

            <motion.p variants={fadeUp} className="font-display text-sm italic text-soga">
              {eyebrow}
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-4xl font-semibold leading-tight text-nila">
              {title}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-1.5 text-sm text-nila/60">
              {subtitle}
            </motion.p>

            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>

      {/* Kanan — panel brand batik */}
      <div className="relative hidden overflow-hidden md:block md:w-1/2">
        <BatikMotif seed={seed} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-nila-deep/85 via-nila/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute inset-x-0 bottom-0 p-12 text-mori"
        >
          <h2 className="max-w-sm font-display text-4xl font-semibold leading-tight">
            Warisan wastra, dari tangan ke tangan.
          </h2>
          <ul className="mt-6 space-y-3">
            {POINTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-mori/85">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-mori/15 backdrop-blur">
                  <Icon className="h-4 w-4 text-kunyit-soft" strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
