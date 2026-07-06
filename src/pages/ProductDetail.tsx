import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, ShoppingBag, Heart, LogIn } from 'lucide-react'
import { getProduct } from '../lib/api'
import { rupiah, TECHNIQUE_LABEL } from '../lib/format'
import BatikMotif from '../components/BatikMotif'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [imgErr, setImgErr] = useState(false)
  const user = useAuthStore((s) => s.user)
  const addItem = useCartStore((s) => s.addItem)
  const { data: p, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  })

  const handleOrder = async () => {
    if (!p) return
    if (!user) { navigate('/login'); return }
    try {
      await addItem(p.id, 1)
      navigate('/cart')
    } catch {
      // silently fail — user will see empty cart
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse rounded-3xl bg-nila/5" />
        <div className="space-y-4">
          <div className="h-9 w-2/3 animate-pulse rounded bg-nila/5" />
          <div className="h-7 w-1/3 animate-pulse rounded bg-nila/5" />
          <div className="h-24 animate-pulse rounded bg-nila/5" />
        </div>
      </div>
    )
  }
  if (isError || !p) return <p className="text-nila/50">Produk tidak ditemukan.</p>

  const img = p.primary_image ?? p.images?.[0]
  const facts = [
    ['Teknik', TECHNIQUE_LABEL[p.technique]],
    ['Motif', p.motif],
    ['Bahan', p.material],
    ['Warna', p.color],
    ['Kategori', p.category?.name],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <div className="space-y-8">
      <Link
        to="/katalog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-soga transition hover:gap-2.5 hover:text-soga-deep"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Kembali ke katalog
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Media */}
        <div className="relative overflow-hidden rounded-3xl border border-nila/10 bg-paper shadow-sm shadow-nila/5">
          <div className="aspect-[4/5]">
            {img && !imgErr ? (
              <img src={img} alt={p.name} onError={() => setImgErr(true)} className="h-full w-full object-cover" />
            ) : (
              <BatikMotif seed={p.slug} label={p.motif ?? p.category?.name ?? 'Batik'} className="h-full w-full" />
            )}
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-mori/95 px-3 py-1 text-xs font-semibold tracking-wide text-soga shadow-sm backdrop-blur">
            {TECHNIQUE_LABEL[p.technique]}
          </span>
        </div>

        {/* Info */}
        <div>
          {p.category && <p className="font-display text-sm italic text-soga">{p.category.name}</p>}
          <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-nila">{p.name}</h1>
          <p className="mt-3 text-3xl font-bold tabular-nums text-soga-deep">{rupiah(p.price)}</p>
          <p className="mt-1 text-sm text-nila/50">
            {p.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" /> Tersedia · stok {p.stock}
              </span>
            ) : (
              <span className="text-tanah">Stok habis</span>
            )}
          </p>

          {p.description && <p className="mt-5 text-sm leading-relaxed text-nila/75">{p.description}</p>}

          {/* Aksi */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleOrder}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep"
            >
              {user ? (
                <><ShoppingBag className="h-4 w-4" strokeWidth={2} /> Pesan sekarang</>
              ) : (
                <><LogIn className="h-4 w-4" strokeWidth={2} /> Masuk untuk memesan</>
              )}
            </button>
            <button
              type="button"
              aria-label="Simpan ke favorit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-nila/15 text-nila/60 transition hover:border-tanah hover:text-tanah"
            >
              <Heart className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          {/* Spesifikasi */}
          <dl className="mt-7 overflow-hidden rounded-2xl border border-nila/10">
            {facts.map(([k, v], i) => (
              <div
                key={k}
                className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-paper' : 'bg-mori-deep/40'}`}
              >
                <dt className="text-nila/50">{k}</dt>
                <dd className="font-medium text-nila">{v}</dd>
              </div>
            ))}
          </dl>

          {/* UMKM */}
          {p.vendor && (
            <div className="mt-6 rounded-2xl border border-nila/10 bg-paper p-4">
              <p className="text-xs text-nila/50">Dijual oleh UMKM</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold text-nila">{p.vendor.name}</p>
                  <p className="text-sm text-nila/60">{p.vendor.kecamatan}, Pasuruan</p>
                </div>
                <Link
                  to={`/umkm/${p.vendor.slug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-soga/30 px-4 py-2 text-sm font-medium text-soga transition hover:bg-soga hover:text-mori"
                >
                  <Store className="h-4 w-4" strokeWidth={2} /> Lihat toko
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
