import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, MessageCircle, Package } from 'lucide-react'
import { getVendor } from '../lib/api'
import ProductCard from '../components/ProductCard'
import MapView from '../components/MapView'
import BatikMotif from '../components/BatikMotif'

export default function VendorDetail() {
  const { slug } = useParams()
  const { data: v, isLoading, isError } = useQuery({
    queryKey: ['vendor', slug],
    queryFn: () => getVendor(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <div className="h-52 animate-pulse rounded-3xl bg-nila/5" />
  if (isError || !v) return <p className="text-nila/50">UMKM tidak ditemukan.</p>

  const hasCoord = v.latitude != null && v.longitude != null
  const productCount = v.products_count ?? v.products?.length ?? 0

  return (
    <div className="space-y-8">
      <Link
        to="/umkm"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-soga transition hover:gap-2.5 hover:text-soga-deep"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Direktori UMKM
      </Link>

      <div className="texture-grain relative overflow-hidden rounded-3xl border border-nila/15 bg-nila p-6 text-mori sm:p-8">
        <div aria-hidden className="motif-kawung pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-kunyit/30 shadow-lg">
            <BatikMotif seed={v.slug} className="h-full w-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{v.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-mori/70">
              <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
              {[v.kelurahan, v.kecamatan, v.city].filter(Boolean).join(', ')}
            </p>
            {v.description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mori/80">{v.description}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              {v.whatsapp && (
                <a
                  href={`https://wa.me/${v.whatsapp}?text=${encodeURIComponent('Halo ' + v.name + ', saya tertarik dengan batik Anda.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-kunyit px-5 py-2.5 font-semibold text-nila-deep transition hover:bg-mori"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2} /> Hubungi via WhatsApp
                </a>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-mori/25 px-5 py-2.5">
                <Package className="h-4 w-4" strokeWidth={2} /> {productCount} produk
              </span>
            </div>
          </div>
        </div>
      </div>

      {hasCoord && (
        <div className="h-72 overflow-hidden rounded-3xl border border-nila/10">
          <MapView center={[v.latitude!, v.longitude!]} zoom={14} vendors={[v]} />
        </div>
      )}

      <div>
        <div className="mb-4">
          <p className="font-display text-sm italic text-soga">Koleksi</p>
          <h2 className="font-display text-2xl font-semibold text-nila">Produk dari {v.name}</h2>
        </div>
        {v.products && v.products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {v.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-nila/50">Belum ada produk.</p>
        )}
      </div>
    </div>
  )
}
