import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, LogIn } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'
import { rupiah } from '../lib/format'
import BatikMotif from '../components/BatikMotif'

export default function CartPage() {
  const user = useAuthStore((s) => s.user)
  const { items, loading, count, fetch, updateItem, removeItem } = useCartStore()

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  if (!user) {
    return (
      <div className="mx-auto mt-16 max-w-md px-5 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-nila/20" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl font-semibold text-nila">Keranjang</h1>
        <p className="mt-2 text-sm text-nila/60">Masuk dulu untuk melihat keranjang belanja.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep"
        >
          <LogIn className="h-4 w-4" strokeWidth={2} /> Masuk
        </Link>
      </div>
    )
  }

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <div className="mx-auto max-w-3xl px-5">
      <Link
        to="/katalog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-soga transition hover:gap-2.5 hover:text-soga-deep"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Lanjut belanja
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <ShoppingCart className="h-6 w-6 text-nila" strokeWidth={1.5} />
        <h1 className="font-display text-3xl font-semibold text-nila">
          Keranjang
          {count > 0 && <span className="ml-2 text-base font-normal text-nila/40">({count})</span>}
        </h1>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse gap-4 rounded-2xl border border-nila/10 p-4">
              <div className="h-24 w-24 shrink-0 rounded-xl bg-nila/5" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 rounded bg-nila/5" />
                <div className="h-4 w-1/4 rounded bg-nila/5" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-16 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-nila/20" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-nila/60">Keranjang belanja masih kosong.</p>
          <Link
            to="/katalog"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep"
          >
            Mulai belanja
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-nila/10 bg-paper p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-nila/10">
                  {item.product.primary_image || item.product.images?.[0] ? (
                    <img
                      src={item.product.primary_image ?? item.product.images![0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BatikMotif seed={item.product.slug} label={item.product.name} className="h-full w-full" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/produk/${item.product.slug}`}
                      className="truncate font-display text-lg font-semibold text-nila hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-semibold text-soga-deep">
                      {rupiah(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) updateItem(item.id, item.quantity - 1)
                        }}
                        className="grid h-8 w-8 place-items-center rounded-full border border-nila/15 text-nila/60 transition hover:border-nila/30 hover:text-nila"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-medium text-nila">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-nila/15 text-nila/60 transition hover:border-nila/30 hover:text-nila"
                        aria-label="Tambah"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="grid h-8 w-8 place-items-center rounded-full text-tanah/60 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-nila/10 bg-paper p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-nila/60">Total</span>
              <span className="text-2xl font-bold tabular-nums text-nila">{rupiah(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep"
            >
              Lanjut ke checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
