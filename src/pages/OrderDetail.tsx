import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { getOrder } from '../lib/api'
import { paySnap } from '../lib/snap'
import { rupiah } from '../lib/format'
import type { Order } from '../lib/types'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu Konfirmasi',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  cod: 'COD',
  unpaid: 'Belum Dibayar',
  paid: 'Lunas',
  failed: 'Gagal',
  refunded: 'Dikembalikan',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'COD (Bayar di Tempat)',
  midtrans: 'Transfer / E-Wallet',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-kunyit/20 text-kunyit-deep',
  processing: 'bg-nila/10 text-nila',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

const PAYMENT_COLOR: Record<string, string> = {
  cod: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-red-100 text-red-600',
  paid: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-nila/10 text-nila/50',
  refunded: 'bg-nila/10 text-nila/50',
}

export default function OrderDetail() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (id) {
      getOrder(Number(id)).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false))
    }
  }, [user, id, navigate])

  const handlePay = async () => {
    if (!order?.snap_token) return
    setPaying(true)
    setPayError('')
    try {
      const result = await paySnap(order.snap_token)
      if (result === 'success') {
        const updated = await getOrder(order.id)
        setOrder(updated)
      } else {
        setPayError('Pembayaran belum selesai. Anda bisa melanjutkan dari halaman ini.')
      }
    } catch {
      setPayError('Terjadi kesalahan saat membayar.')
    } finally {
      setPaying(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-1/3 rounded bg-nila/5" />
          <div className="h-40 rounded-2xl bg-nila/5" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto mt-16 max-w-md px-5 text-center">
        <Package className="mx-auto h-12 w-12 text-nila/20" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-nila/60">Pesanan tidak ditemukan.</p>
        <Link to="/pesanan" className="mt-4 inline-flex items-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori">
          Lihat semua pesanan
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5">
      <Link
        to="/pesanan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-soga transition hover:gap-2.5 hover:text-soga-deep"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Semua pesanan
      </Link>

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-nila">{order.order_number}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${PAYMENT_COLOR[order.payment_status]}`}>
            {PAYMENT_STATUS_LABEL[order.payment_status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-nila/40">
          {new Date(order.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>

      {order.payment_status === 'unpaid' && order.snap_token && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" strokeWidth={2} />
            <p className="text-sm font-medium text-red-700">Pembayaran belum selesai</p>
          </div>
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-soga px-6 py-2.5 text-sm font-semibold text-mori transition hover:bg-soga-deep disabled:opacity-50"
          >
            {paying ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
          {payError && <p className="mt-2 text-sm text-red-600">{payError}</p>}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-nila/10 bg-paper p-5">
          <h2 className="font-display text-lg font-semibold text-nila">Detail Pesanan</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-nila/50">No. Pesanan</dt>
              <dd className="font-medium text-nila">{order.order_number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-nila/50">Status</dt>
              <dd className="font-medium text-nila">{STATUS_LABEL[order.status]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-nila/50">Pembayaran</dt>
              <dd className="font-medium text-nila">{PAYMENT_STATUS_LABEL[order.payment_status]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-nila/50">Metode</dt>
              <dd className="font-medium text-nila">{PAYMENT_METHOD_LABEL[order.payment_method] ?? order.payment_method}</dd>
            </div>
            {order.payment_type && (
              <div className="flex justify-between">
                <dt className="text-nila/50">Channel</dt>
                <dd className="font-medium text-nila">{order.payment_type}</dd>
              </div>
            )}
            {order.paid_at && (
              <div className="flex justify-between">
                <dt className="text-nila/50">Dibayar</dt>
                <dd className="font-medium text-nila">
                  {new Date(order.paid_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-nila/50">Total</dt>
              <dd className="text-lg font-bold text-nila">{rupiah(order.total_amount)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-nila/10 bg-paper p-5">
          <h2 className="font-display text-lg font-semibold text-nila">Pengiriman</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-nila/50">No. WhatsApp</dt>
              <dd className="font-medium text-nila">{order.phone}</dd>
            </div>
            <div>
              <dt className="text-nila/50">Alamat</dt>
              <dd className="font-medium text-nila">{order.shipping_address}</dd>
            </div>
            {order.notes && (
              <div>
                <dt className="text-nila/50">Catatan</dt>
                <dd className="font-medium text-nila">{order.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-nila/10 bg-paper p-5">
        <h2 className="font-display text-lg font-semibold text-nila">Item Pesanan</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b border-nila/5 pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-nila">{item.product_name}</p>
                <p className="text-xs text-nila/50">{item.quantity} x {rupiah(item.product_price)}</p>
              </div>
              <p className="shrink-0 text-sm font-medium text-nila">{rupiah(item.subtotal)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
