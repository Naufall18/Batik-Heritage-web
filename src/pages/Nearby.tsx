import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LocateFixed, MapPin, Navigation, Package } from 'lucide-react'
import { getNearbyVendors } from '../lib/api'
import MapView from '../components/MapView'
import BatikMotif from '../components/BatikMotif'

const PASURUAN: [number, number] = [-7.6453, 112.9075]

export default function Nearby() {
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [radius, setRadius] = useState(25)
  const [status, setStatus] = useState<'idle' | 'locating' | 'ok' | 'denied'>('idle')

  const origin = coords ?? PASURUAN
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['nearby', origin, radius],
    queryFn: () => getNearbyVendors(origin[0], origin[1], radius),
  })

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus('denied')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude])
        setStatus('ok')
      },
      () => setStatus('denied'),
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-display text-sm italic text-soga">Penemuan berbasis lokasi</p>
        <h1 className="font-display text-4xl font-semibold text-nila">Batik di Sekitarku</h1>
        <p className="mt-1 text-sm text-nila/60">
          Temukan UMKM batik terdekat. {status !== 'ok' && 'Titik acuan sementara: pusat Kota Pasuruan.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-nila/10 bg-paper p-4">
        <button
          onClick={locate}
          className="inline-flex items-center gap-2 rounded-full bg-nila px-5 py-2.5 text-sm font-semibold text-mori transition hover:bg-nila-deep"
        >
          <LocateFixed className="h-4 w-4" strokeWidth={2} />
          {status === 'locating' ? 'Mencari lokasi…' : 'Gunakan lokasi saya'}
        </button>
        <label className="flex flex-1 items-center gap-3 text-sm">
          <span className="whitespace-nowrap text-nila/60">Radius: <span className="font-semibold text-nila">{radius} km</span></span>
          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            aria-label="Radius pencarian"
            className="flex-1 accent-soga"
          />
        </label>
      </div>

      {status === 'denied' && (
        <p className="flex items-center gap-2 rounded-xl bg-kunyit/15 px-4 py-2.5 text-sm text-soga-deep">
          <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
          Izin lokasi tidak diberikan — menampilkan UMKM dari pusat Kota Pasuruan.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-[65vh] overflow-hidden rounded-3xl border border-nila/10">
          <MapView center={PASURUAN} zoom={11} vendors={vendors ?? []} user={coords} radiusKm={radius} />
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-nila/5" />
            ))
          ) : vendors && vendors.length > 0 ? (
            vendors.map((v) => (
              <Link
                key={v.id}
                to={`/umkm/${v.slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-nila/10 bg-paper p-4 transition hover:-translate-y-0.5 hover:border-soga/30 hover:shadow-md hover:shadow-nila/5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                    <BatikMotif seed={v.slug} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold text-nila">{v.name}</p>
                    <p className="flex items-center gap-1 text-xs text-nila/55">
                      <Package className="h-3 w-3" strokeWidth={2} /> {v.kecamatan} · {v.products_count ?? 0} produk
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-soga/10 px-3 py-1.5 text-sm font-semibold text-soga">
                  <Navigation className="h-3 w-3" strokeWidth={2.5} /> {v.distance_km} km
                </span>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-nila/10 bg-paper p-8 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-nila/5 text-nila/40">
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-semibold text-nila">Tidak ada UMKM</p>
                <p className="mt-1 text-sm text-nila/50">Tidak ada dalam radius {radius} km. Perbesar radius pencarian.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
