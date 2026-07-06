import { useEffect, useState } from 'react'
import { getVendorOrders, updateVendorOrderStatus } from '../../lib/api'
import { rupiah } from '../../lib/format'
import type { Order } from '../../lib/types'

const STATUS_LIST = ['pending', 'processing', 'completed', 'cancelled']

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

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  const load = async (p: number) => {
    setLoading(true)
    try {
      const res = await getVendorOrders(p)
      setOrders(res.data)
      setLastPage(res.meta.last_page)
      setPage(res.meta.current_page)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load(1) }, [])

  const handleStatusChange = async (orderId: number, status: string) => {
    setUpdating(orderId)
    try {
      await updateVendorOrderStatus(orderId, status)
      load(page)
    } catch {}
    setUpdating(null)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-nila/10 p-5">
            <div className="mb-2 h-5 w-1/3 rounded bg-nila/5" />
            <div className="h-4 w-1/2 rounded bg-nila/5" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold text-nila">Pesanan Masuk</h2>

      {orders.length === 0 ? (
        <p className="py-12 text-center text-sm text-nila/60">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-nila/10 bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-nila">{order.order_number}</p>
                  <p className="text-xs text-nila/40">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-medium outline-none ${STATUS_COLOR[order.status]} ${updating === order.id ? 'opacity-50' : ''}`}
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-sm">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-nila/70">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span className="font-medium text-nila">{rupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-nila/10 pt-3">
                <div className="text-xs text-nila/40">
                  {order.user?.name ? <span>Pemesan: {order.user.name}</span> : null}
                  <span className="ml-3">{order.phone}</span>
                </div>
                <p className="font-bold text-nila">{rupiah(order.total_amount)}</p>
              </div>
            </div>
          ))}
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
    </div>
  )
}
