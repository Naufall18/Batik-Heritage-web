import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { getVendorProducts, createVendorProduct, updateVendorProduct, deleteVendorProduct, getCategories } from '../../lib/api'
import { rupiah, TECHNIQUE_LABEL } from '../../lib/format'
import type { Product, Category } from '../../lib/types'

const techniques = ['tulis', 'cap', 'printing', 'kombinasi']

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const load = async (p: number) => {
    setLoading(true)
    try {
      const res = await getVendorProducts(p)
      setProducts(res.data)
      setLastPage(res.meta.last_page)
      setPage(res.meta.current_page)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load(1); getCategories().then(setCategories).catch(() => {}) }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return
    await deleteVendorProduct(id)
    load(page)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-nila">Produk Saya</h2>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowModal(true) }}
          className="inline-flex items-center gap-2 rounded-full bg-nila px-5 py-2 text-sm font-semibold text-mori transition hover:bg-nila-deep"
        >
          <Plus className="h-4 w-4" strokeWidth={2} /> Tambah Produk
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-nila/10 p-4">
              <div className="h-5 w-2/3 rounded bg-nila/5" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-sm text-nila/60">Belum ada produk. Tambah produk pertama Anda.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-nila/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nila/10 bg-mori-deep/40">
                <th className="px-4 py-3 text-left font-medium text-nila/60">Produk</th>
                <th className="px-4 py-3 text-left font-medium text-nila/60">Kategori</th>
                <th className="px-4 py-3 text-right font-medium text-nila/60">Harga</th>
                <th className="px-4 py-3 text-center font-medium text-nila/60">Stok</th>
                <th className="px-4 py-3 text-right font-medium text-nila/60">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-nila/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-nila">{p.name}</p>
                    <p className="text-xs text-nila/40">{TECHNIQUE_LABEL[p.technique]}</p>
                  </td>
                  <td className="px-4 py-3 text-nila/60">{p.category?.name}</td>
                  <td className="px-4 py-3 text-right font-medium text-nila">{rupiah(p.price)}</td>
                  <td className="px-4 py-3 text-center text-nila">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => { setEditing(p); setShowModal(true) }}
                        className="rounded-lg p-2 text-nila/50 transition hover:bg-nila/5 hover:text-nila"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-2 text-tanah/50 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Hapus"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastPage > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => load(p)}
              className={`grid h-9 w-9 place-items-center rounded-full text-sm transition ${
                p === page ? 'bg-nila text-mori' : 'text-nila/50 hover:bg-nila/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editing}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(page) }}
        />
      )}
    </div>
  )
}

function ProductModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [categoryId, setCategoryId] = useState(product?.category?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [stock, setStock] = useState(String(product?.stock ?? ''))
  const [technique, setTechnique] = useState(product?.technique ?? 'cap')
  const [motif, setMotif] = useState(product?.motif ?? '')
  const [material, setMaterial] = useState(product?.material ?? '')
  const [color, setColor] = useState(product?.color ?? '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.set('name', name)
    fd.set('category_id', categoryId)
    fd.set('description', description)
    fd.set('price', price)
    fd.set('stock', stock)
    fd.set('technique', technique)
    if (motif) fd.set('motif', motif)
    if (material) fd.set('material', material)
    if (color) fd.set('color', color)
    if (!product) fd.set('_method', 'POST')

    try {
      if (product) {
        await updateVendorProduct(product.id, fd)
      } else {
        await createVendorProduct(fd)
      }
      onSaved()
    } catch {}
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[600] grid place-items-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-nila/10 bg-mori p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-nila">
            {product ? 'Edit Produk' : 'Tambah Produk'}
          </h3>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-nila/50 hover:bg-nila/5">
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-nila">Nama Produk</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Kategori</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20">
                <option value="">Pilih</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Teknik</label>
              <select value={technique} onChange={(e) => setTechnique(e.target.value as typeof technique)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20">
                {techniques.map((t) => (
                  <option key={t} value={t}>{TECHNIQUE_LABEL[t]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Harga (Rp)</label>
              <input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Stok</label>
              <input required type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-nila">Deskripsi</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Motif</label>
              <input value={motif} onChange={(e) => setMotif(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Bahan</label>
              <input value={material} onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Warna</label>
              <input value={color} onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-paper px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-full border border-nila/15 px-6 py-2.5 text-sm font-medium text-nila/60 transition hover:bg-nila/5">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="rounded-full bg-nila px-6 py-2.5 text-sm font-semibold text-mori transition hover:bg-nila-deep disabled:opacity-50">
              {saving ? 'Menyimpan...' : product ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
