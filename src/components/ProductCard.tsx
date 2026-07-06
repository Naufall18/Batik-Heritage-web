import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import type { Product } from '../lib/types'
import { rupiah, TECHNIQUE_LABEL } from '../lib/format'
import BatikMotif from './BatikMotif'

export default function ProductCard({ product }: { product: Product }) {
  const [imgErr, setImgErr] = useState(false)
  const img = product.primary_image ?? product.images?.[0]

  return (
    <Link
      to={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-nila/10 bg-paper shadow-sm shadow-nila/5 transition duration-300 hover:-translate-y-1 hover:border-soga/30 hover:shadow-xl hover:shadow-nila/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {img && !imgErr ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <BatikMotif
            seed={product.slug}
            label={product.motif ?? product.category?.name ?? 'Batik'}
            className="h-full w-full transition duration-500 group-hover:scale-105"
          />
        )}

        {/* Badge teknik */}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-mori/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-soga shadow-sm backdrop-blur">
          {TECHNIQUE_LABEL[product.technique]}
        </span>

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Simpan ke favorit"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-mori/90 text-nila/60 opacity-0 shadow-sm backdrop-blur transition hover:text-tanah group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight text-nila">
          {product.name}
        </h3>
        {product.vendor && (
          <p className="flex items-center gap-1 text-xs text-nila/50">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
            <span className="truncate">
              {product.vendor.name}
              {product.vendor.kecamatan ? ` · ${product.vendor.kecamatan}` : ''}
            </span>
          </p>
        )}
        <p className="mt-auto pt-1.5 text-base font-bold tabular-nums text-soga-deep">
          {rupiah(product.price)}
        </p>
      </div>
    </Link>
  )
}
