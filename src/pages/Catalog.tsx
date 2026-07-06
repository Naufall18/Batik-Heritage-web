import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SearchX } from 'lucide-react'
import { getCategories, getProducts, getRegions } from '../lib/api'
import { TECHNIQUE_LABEL } from '../lib/format'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const filters = {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    technique: params.get('technique') ?? '',
    kecamatan: params.get('kecamatan') ?? '',
  }

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: getRegions })
  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  })

  const kecamatanList = (regions ?? []).map((r) => r.name)

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const selectCls =
    'rounded-xl border border-nila/15 bg-paper px-3.5 py-2.5 text-sm text-nila transition focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20'

  const activeChips = [
    filters.category && { key: 'category', label: categories?.find((c) => c.slug === filters.category)?.name ?? filters.category },
    filters.technique && { key: 'technique', label: TECHNIQUE_LABEL[filters.technique] },
    filters.kecamatan && { key: 'kecamatan', label: filters.kecamatan },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-sm italic text-soga">Semua wastra</p>
        <h1 className="font-display text-4xl font-semibold text-nila">Katalog Batik</h1>
      </div>

      <div className="rounded-2xl border border-nila/10 bg-mori-deep/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nila/40" strokeWidth={2} />
            <input
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Cari batik, motif…"
              aria-label="Cari batik"
              className={`${selectCls} w-full pl-10`}
            />
          </div>
          <select value={filters.category} onChange={(e) => update('category', e.target.value)} className={selectCls} aria-label="Kategori">
            <option value="">Semua Kategori</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select value={filters.technique} onChange={(e) => update('technique', e.target.value)} className={selectCls} aria-label="Teknik">
            <option value="">Semua Teknik</option>
            {Object.entries(TECHNIQUE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={filters.kecamatan} onChange={(e) => update('kecamatan', e.target.value)} className={selectCls} aria-label="Kecamatan">
            <option value="">Semua Kecamatan</option>
            {kecamatanList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => update(chip.key, '')}
                className="inline-flex items-center gap-1.5 rounded-full bg-nila px-3 py-1 text-xs font-medium text-mori transition hover:bg-nila-deep"
              >
                {chip.label}
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-nila/5" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <p className="text-sm text-nila/50">
            <span className="font-semibold text-nila">{data.meta.total}</span> produk ditemukan
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-nila/5 text-nila/40">
            <SearchX className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <p className="text-nila/60">Tidak ada produk yang cocok dengan filter.</p>
        </div>
      )}
    </div>
  )
}
