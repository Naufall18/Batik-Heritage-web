import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, LogIn, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { getOrders } from '../lib/api'
import { rupiah } from '../lib/format'
import type { Order } from '../lib/types'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-kunyit/20 text-kunyit-deep',
  processing: 'bg-nila/10 text-nila',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Orders() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getOrders().then((res) => setOrders(res.data)).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  if (!user) {
    return (
      <div className="mx-auto mt-16 max-w-md px-5 text-center">
        <Package className="mx-auto h-12 w-12 text-nila/20" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl font-semibold text-nila">Pesanan Saya</h1>
        <p className="mt-2 text-sm text-nila/60">Masuk dulu untuk melihat riwayat pesanan.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep"
        >
          <LogIn className="h-4 w-4" strokeWidth={2} /> Masuk
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-nila" strokeWidth={1.5} />
        <h1 className="font-display text-3xl font-semibold text-nila">Pesanan Saya</h1>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-nila/10 p-5">
              <div className="mb-3 h-5 w-1/3 rounded bg-nila/5" />
              <div className="h-4 w-1/2 rounded bg-nila/5" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-16 text-center">
          <Package className="mx-auto h-12 w-12 text-nila/20" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-nila/60">Belum ada pesanan.</p>
          <Link
            to="/katalog"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-nila px-6 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep"
          >
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/pesanan/${order.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-nila/10 bg-paper p-5 transition hover:border-soga/30"
            >
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-nila">{order.order_number}</p>
                <p className="mt-0.5 text-sm text-nila/60">
                  {order.items.length} item · {rupiah(order.total_amount)}
                </p>
                <p className="mt-1 text-xs text-nila/40">
                  {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[order.status] ?? 'bg-nila/5 text-nila/50'}`}
                >
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
                <ArrowRight className="h-4 w-4 text-nila/30" strokeWidth={2} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
