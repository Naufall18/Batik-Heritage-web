import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, AlertCircle, Wallet, Truck } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'
import { checkout as apiCheckout } from '../lib/api'
import { rupiah } from '../lib/format'
import { paySnap } from '../lib/snap'
import BatikMotif from '../components/BatikMotif'

export default function Checkout() {
  const user = useAuthStore((s) => s.user)
  const { items, count, fetch, clear: clearCart } = useCartStore()
  const navigate = useNavigate()

  const [phone, setPhone] = useState(user?.phone ?? '')
  const [shippingAddress, setShippingAddress] = useState(user?.address ?? '')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'midtrans'>('cod')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  if (!user) {
    navigate('/login')
    return null
  }

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const order = await apiCheckout({
        shipping_address: shippingAddress,
        phone,
        notes: notes || undefined,
        payment_method: paymentMethod,
      })

      clearCart()

      if (paymentMethod === 'midtrans' && order.snap_token) {
        const result = await paySnap(order.snap_token)
        navigate(`/pesanan/${order.id}`, { state: { snapResult: result } })
      } else {
        navigate(`/pesanan/${order.id}`)
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-16 max-w-md px-5 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-nila/20" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-nila/60">Keranjang kosong, tambah produk dulu.</p>
        <Link to="/katalog" className="mt-4 inline-flex items-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori">
          Mulai belanja
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-soga transition hover:gap-2.5 hover:text-soga-deep"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Kembali ke keranjang
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-nila">Checkout</h1>

      <form onSubmit={handleCheckout} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-nila/10 bg-paper p-5">
            <h2 className="font-display text-lg font-semibold text-nila">1. Informasi Pengiriman</h2>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-nila">
                  No. WhatsApp <span className="text-tanah">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-3 text-sm text-nila placeholder:text-nila/30 focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20"
                  placeholder="0812xxxxxxx"
                />
              </div>
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-nila">
                  Alamat Pengiriman <span className="text-tanah">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-3 text-sm text-nila placeholder:text-nila/30 focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20"
                  placeholder="Jalan, kecamatan, kota, kode pos"
                />
              </div>
              <div>
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-nila">
                  Catatan (opsional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-3 text-sm text-nila placeholder:text-nila/30 focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20"
                  placeholder="Catatan untuk penjual"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-nila/10 bg-paper p-5">
            <h2 className="font-display text-lg font-semibold text-nila">2. Metode Pembayaran</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                  paymentMethod === 'cod'
                    ? 'border-soga bg-soga/5'
                    : 'border-nila/10 bg-mori hover:border-nila/20'
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                  paymentMethod === 'cod' ? 'bg-soga text-mori' : 'bg-nila/5 text-nila/60'
                }`}>
                  <Truck className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-medium text-nila">COD (Bayar di Tempat)</p>
                  <p className="text-xs text-nila/50">Bayar saat pesanan diterima</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('midtrans')}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                  paymentMethod === 'midtrans'
                    ? 'border-soga bg-soga/5'
                    : 'border-nila/10 bg-mori hover:border-nila/20'
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                  paymentMethod === 'midtrans' ? 'bg-soga text-mori' : 'bg-nila/5 text-nila/60'
                }`}>
                  <Wallet className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-medium text-nila">Transfer / E-Wallet</p>
                  <p className="text-xs text-nila/50">Bayar online via Midtrans</p>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-nila/10 bg-paper p-5">
            <h2 className="font-display text-lg font-semibold text-nila">3. Ringkasan Pesanan ({count})</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-nila/10">
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
                  <div className="flex min-w-0 flex-1 justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-nila">{item.product.name}</p>
                      <p className="text-xs text-nila/50">{item.quantity} x {rupiah(item.product.price)}</p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-nila">
                      {rupiah(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-nila/10 bg-paper p-5">
            <h2 className="font-display text-lg font-semibold text-nila">Ringkasan Pembayaran</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-nila/60">
                <span>Total Pesanan</span>
                <span className="font-medium text-nila">{rupiah(total)}</span>
              </div>
              <div className="flex justify-between text-nila/60">
                <span>Biaya Pengiriman</span>
                <span className="font-medium text-nila/40">Dihitung di luar</span>
              </div>
              <hr className="border-nila/10" />
              <div className="flex justify-between font-semibold text-nila">
                <span>Total</span>
                <span className="text-lg">{rupiah(total)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-nila/40">
              {paymentMethod === 'cod'
                ? 'Bayar saat pesanan sampai di tujuan.'
                : 'Pembayaran via Midtrans (bank transfer, GOPAY, dll).'}
            </p>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-soga px-6 py-3 text-sm font-semibold text-mori transition hover:bg-soga-deep disabled:opacity-50"
            >
              {loading ? 'Memproses...' : (
                <>
                  <ShoppingBag className="h-4 w-4" strokeWidth={2} />
                  {paymentMethod === 'cod' ? 'Buat Pesanan' : 'Bayar Sekarang'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
