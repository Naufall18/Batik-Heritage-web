import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, MapPin, ArrowRight, Layers, Shirt, Wind, Gem,
  PenTool, Leaf, HandHeart, Store,
} from 'lucide-react'
import { getCategories, getProducts } from '../lib/api'
import type { Category } from '../lib/types'
import ProductCard from '../components/ProductCard'
import BatikMotif from '../components/BatikMotif'
import { staggerContainer, fadeUp, fadeScale, revealOnScroll } from '../lib/motion'

const CATEGORY_ICON: Record<string, typeof Layers> = {
  kain: Layers,
  pakaian: Shirt,
  'selendang-shawl': Wind,
  aksesoris: Gem,
}
const iconFor = (cat: Category) => CATEGORY_ICON[cat.slug] ?? Layers

const STATS = [
  { value: '6+', label: 'UMKM pengrajin' },
  { value: '18+', label: 'Produk wastra' },
  { value: '7', label: 'Kecamatan' },
]

export default function Home() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: featured, isLoading } = useQuery({
    queryKey: ['products', { featured: true }],
    queryFn: () => getProducts({ featured: true }),
  })

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/katalog${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <div className="space-y-24 pb-8">
      {/* ── HERO ── */}
      <section className="texture-grain relative overflow-hidden rounded-[2rem] border border-nila/15 bg-nila px-6 py-20 text-mori sm:px-12 sm:py-24">
        <div aria-hidden className="motif-kawung pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen" />
        {/* Orb bercahaya beranimasi */}
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.32, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-kunyit/25 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-soga/30 blur-3xl"
        />

        {/* Kartu motif melayang (dekor, sembunyi di mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: -8 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="absolute -left-6 top-16 hidden w-36 overflow-hidden rounded-2xl border border-mori/15 shadow-2xl lg:block"
        >
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="aspect-[4/5]">
            <BatikMotif seed="hero-float-1" label="Kawung" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 7 }}
          animate={{ opacity: 1, y: 0, rotate: 7 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="absolute -right-4 bottom-14 hidden w-36 overflow-hidden rounded-2xl border border-mori/15 shadow-2xl lg:block"
        >
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="aspect-[4/5]">
            <BatikMotif seed="hero-float-2" label="Parang" />
          </motion.div>
        </motion.div>

        {/* Konten */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.span variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-kunyit/30 bg-kunyit/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-kunyit-soft">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-kunyit" />
            Marketplace Batik UMKM · Pasuruan
          </motion.span>
          <motion.h1 variants={fadeUp} className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Warisan batik,<br />
            <span className="italic text-kunyit-soft">di sekitarmu.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mori/70 sm:text-lg">
            Kain, busana, selendang, dan aksesoris batik langsung dari tangan pengrajin
            UMKM Pasuruan — ditemukan berdasarkan lokasi.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={submitSearch}
            className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-full border border-mori/20 bg-mori/95 p-1.5 pl-5 shadow-xl shadow-nila-deep/40"
          >
            <Search className="h-5 w-5 shrink-0 text-nila/40" strokeWidth={2} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari batik, motif, atau pengrajin…"
              aria-label="Cari batik"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-nila placeholder:text-nila/40 focus:outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="shrink-0 rounded-full bg-kunyit px-5 py-2.5 text-sm font-semibold text-nila-deep transition hover:bg-kunyit-deep hover:text-mori"
            >
              Cari
            </motion.button>
          </motion.form>

          <motion.div variants={fadeUp}>
            <Link
              to="/sekitar"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-mori/80 underline-offset-4 transition hover:text-kunyit-soft hover:underline"
            >
              <MapPin className="h-4 w-4" strokeWidth={2} />
              Atau temukan batik di sekitarku
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="mx-auto mt-10 flex max-w-md items-center justify-center gap-8 border-t border-mori/15 pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-semibold text-kunyit-soft">{s.value}</p>
                <p className="mt-0.5 text-xs text-mori/60">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── KATEGORI ── */}
      <motion.section {...revealOnScroll}>
        <motion.div variants={fadeUp} className="mb-6">
          <p className="font-display text-sm italic text-soga">Jelajahi</p>
          <h2 className="font-display text-3xl font-semibold text-nila">Kategori Wastra</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories?.map((c) => {
            const Icon = iconFor(c)
            return (
              <motion.div key={c.id} variants={fadeUp}>
                <Link
                  to={`/katalog?category=${c.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-nila/10 bg-paper p-4 transition hover:-translate-y-1 hover:border-soga/40 hover:shadow-md hover:shadow-nila/5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-nila/5 text-nila transition group-hover:bg-soga/10 group-hover:text-soga">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-medium text-nila">{c.name}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ── BATIK PILIHAN ── */}
      <motion.section {...revealOnScroll}>
        <motion.div variants={fadeUp} className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-display text-sm italic text-soga">Kurasi pilihan</p>
            <h2 className="font-display text-3xl font-semibold text-nila">Batik Pilihan</h2>
          </div>
          <Link to="/katalog" className="inline-flex items-center gap-1 text-sm font-medium text-soga transition hover:gap-2 hover:text-soga-deep">
            Lihat semua <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </motion.div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-nila/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured?.data.map((p) => (
              <motion.div key={p.id} variants={fadeScale}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── STORYTELLING ── */}
      <motion.section {...revealOnScroll} className="texture-grain relative overflow-hidden rounded-[2rem] bg-mori-deep px-6 py-16 sm:px-12">
        <div aria-hidden className="motif-kawung pointer-events-none absolute inset-0 opacity-[0.05]" />
        <motion.div variants={fadeUp} className="relative mx-auto max-w-3xl text-center">
          <p className="font-display text-sm italic text-soga">Mengapa Batik Heritage</p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-nila sm:text-4xl">Setiap helai punya cerita</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-nila/60">
            Kami mempertemukan pembeli langsung dengan pengrajin UMKM Pasuruan —
            menjaga warisan wastra tetap hidup, adil, dan dekat.
          </p>
        </motion.div>
        <div className="relative mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { Icon: PenTool, title: 'Karya tangan asli', desc: 'Batik tulis & cap dari pengrajin, bukan produksi massal anonim.' },
            { Icon: Leaf, title: 'Motif khas Pasuruan', desc: 'Sedap Malam, Bromo-Tengger, Pasedahan Suropati — identitas lokal.' },
            { Icon: HandHeart, title: 'Langsung ke UMKM', desc: 'Belanja berdampak: nilai kembali ke perajin, bukan perantara.' },
          ].map(({ Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="rounded-2xl border border-nila/10 bg-paper p-5 text-left transition hover:-translate-y-1 hover:shadow-md hover:shadow-nila/5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-soga/10 text-soga">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-nila">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-nila/60">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-soga/20 bg-gradient-to-br from-soga to-soga-deep px-8 py-12 text-mori sm:flex-row sm:px-12"
      >
        <div className="max-w-lg text-center sm:text-left">
          <h2 className="font-display text-3xl font-semibold">Punya usaha batik di Pasuruan?</h2>
          <p className="mt-2 text-sm text-mori/75">Tampilkan produkmu ke pembeli di sekitar. Gratis untuk UMKM lokal.</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/umkm" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-kunyit px-6 py-3.5 text-sm font-semibold text-nila-deep transition hover:bg-mori">
            <Store className="h-4 w-4" strokeWidth={2} /> Gabung sebagai UMKM
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
