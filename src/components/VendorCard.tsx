import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import type { Vendor } from '../lib/types'
import BatikMotif from './BatikMotif'

export default function VendorCard({ vendor: v }: { vendor: Vendor }) {
  return (
    <Link
      to={`/umkm/${v.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-nila/10 bg-paper shadow-sm shadow-nila/5 transition duration-300 hover:-translate-y-1 hover:border-soga/30 hover:shadow-xl hover:shadow-nila/10"
    >
      {/* Cover motif + monogram */}
      <div className="relative h-24 overflow-hidden">
        <BatikMotif seed={v.slug} className="h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute -bottom-5 left-5 grid h-14 w-14 place-items-center rounded-2xl border-2 border-paper bg-mori font-display text-2xl font-bold text-soga shadow-sm">
          {v.name.charAt(0)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-7">
        <h3 className="font-display text-xl font-semibold leading-tight text-nila">{v.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-nila/50">
          <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
          {[v.kecamatan, v.city].filter(Boolean).join(', ')}
        </p>
        {v.description && (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-nila/65">{v.description}</p>
        )}
        <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-soga transition group-hover:gap-2">
          {v.products_count ?? 0} produk
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}
