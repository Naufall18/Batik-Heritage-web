import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, User, Store, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/auth'
import { getDashboardStats } from '../../lib/api'
import type { DashboardStats as Stats } from '../../lib/types'
import { rupiah } from '../../lib/format'

const tabs = [
  { to: '/vendor', label: 'Ringkasan', icon: LayoutDashboard, end: true },
  { to: '/vendor/produk', label: 'Produk', icon: Package },
  { to: '/vendor/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { to: '/vendor/profil', label: 'Profil', icon: User },
]

export function VendorLayout() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="mx-auto max-w-6xl px-5">
      <div className="flex items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-nila" strokeWidth={1.5} />
          <div>
            <h1 className="font-display text-2xl font-semibold text-nila">Dashboard UMKM</h1>
            <p className="text-xs text-nila/50">{user?.name}</p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-nila/15 px-4 py-2 text-sm text-nila/60 transition hover:border-tanah hover:text-tanah"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} /> Kembali ke toko
        </Link>
      </div>

      <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-nila/10 pb-2">
        {tabs.map((t) => {
          const active = t.end ? location.pathname === t.to : location.pathname.startsWith(t.to)
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                active ? 'bg-nila text-mori' : 'text-nila/60 hover:bg-nila/5'
              }`}
            >
              <t.icon className="h-4 w-4" strokeWidth={2} /> {t.label}
            </Link>
          )
        })}
      </nav>

      <Outlet />
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-nila/10 p-5">
            <div className="mb-2 h-4 w-1/2 rounded bg-nila/5" />
            <div className="h-8 w-2/3 rounded bg-nila/5" />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    { label: 'Total Produk', value: stats?.total_products ?? 0, color: 'bg-nila/5 text-nila' },
    { label: 'Total Pesanan', value: stats?.total_orders ?? 0, color: 'bg-soga/10 text-soga-deep' },
    { label: 'Pendapatan', value: rupiah(stats?.total_revenue ?? 0), color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Pesanan Baru', value: stats?.pending_orders ?? 0, color: 'bg-kunyit/20 text-kunyit-deep' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-2xl border border-nila/10 p-5 ${c.color}`}>
          <p className="text-sm font-medium opacity-70">{c.label}</p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
