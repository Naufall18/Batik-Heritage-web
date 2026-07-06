import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Store } from 'lucide-react'
import { getRegions, getVendors } from '../lib/api'
import VendorCard from '../components/VendorCard'

export default function Vendors() {
  const [params, setParams] = useSearchParams()
  const kecamatan = params.get('kecamatan') ?? ''

  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: getRegions })
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors', kecamatan],
    queryFn: () => getVendors(kecamatan || undefined),
  })

  const setKecamatan = (value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set('kecamatan', value)
    else next.delete('kecamatan')
    setParams(next)
  }

  const chipCls = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm transition ${
      active ? 'bg-nila text-mori' : 'border border-nila/15 bg-paper text-nila/70 hover:border-soga/40 hover:text-soga'
    }`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm italic text-soga">Para pengrajin</p>
          <h1 className="font-display text-4xl font-semibold text-nila">Direktori UMKM Batik</h1>
          <p className="mt-1 text-sm text-nila/60">Pengrajin batik lokal se-Pasuruan.</p>
        </div>
        <Link
          to="/sekitar"
          className="inline-flex items-center gap-1.5 rounded-full border border-soga/30 px-4 py-2 text-sm font-medium text-soga transition hover:bg-soga hover:text-mori"
        >
          <MapPin className="h-4 w-4" strokeWidth={2} /> Cari yang terdekat
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setKecamatan('')} className={chipCls(kecamatan === '')}>
          Semua
        </button>
        {regions?.map((r) => (
          <button key={r.id} onClick={() => setKecamatan(r.name)} className={chipCls(kecamatan === r.name)}>
            {r.name}
            <span className="ml-1.5 text-xs opacity-60">{r.vendors_count}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-nila/5" />
          ))}
        </div>
      ) : vendors && vendors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-nila/5 text-nila/40">
            <Store className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <p className="text-nila/60">Belum ada UMKM di wilayah ini.</p>
        </div>
      )}
    </div>
  )
}
