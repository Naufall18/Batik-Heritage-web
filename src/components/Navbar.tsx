import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut, Package } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'

const links = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/katalog', label: 'Katalog' },
  { to: '/umkm', label: 'UMKM' },
  { to: '/sekitar', label: 'Batik di Sekitarku' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { count, fetch } = useCartStore()

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-1.5 text-sm transition ${
      isActive ? 'bg-nila text-mori' : 'text-nila/70 hover:bg-nila/5'
    }`

  return (
    <header className="sticky top-0 z-[500] border-b border-nila/10 bg-mori/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src="/logo.svg" alt="Batik Heritage" className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight text-nila">
            Batik Heritage
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Aksi kanan */}
        <div className="flex items-center gap-1.5">
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-nila/70 transition hover:bg-nila/5"
            aria-label="Keranjang"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-soga px-1 text-[10px] font-bold leading-none text-mori">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdown((v) => !v)}
                onBlur={() => setTimeout(() => setDropdown(false), 200)}
                className="grid h-10 w-10 place-items-center rounded-full border border-nila/15 text-nila/70 transition hover:bg-nila/5"
                aria-label="Akun"
              >
                <User className="h-5 w-5" strokeWidth={2} />
              </button>
              {dropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-2xl border border-nila/10 bg-mori shadow-lg shadow-nila/5">
                  <div className="border-b border-nila/10 px-4 py-3">
                    <p className="truncate text-sm font-medium text-nila">{user.name}</p>
                    <p className="truncate text-xs text-nila/50">{user.email}</p>
                  </div>
                  <Link
                    to="/pesanan"
                    onClick={() => setDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-nila/80 transition hover:bg-nila/5"
                  >
                    <Package className="h-4 w-4" strokeWidth={2} /> Pesanan saya
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setDropdown(false) }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-tanah transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-nila px-4 py-1.5 text-sm font-semibold text-mori transition hover:bg-nila-deep md:inline-flex"
            >
              Masuk
            </Link>
          )}

          {/* Toggle mobile */}
          <button
            type="button"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-nila transition hover:bg-nila/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Panel mobile */}
      {open && (
        <nav className="border-t border-nila/10 bg-mori px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm transition ${
                    isActive || location.pathname === l.to
                      ? 'bg-nila text-mori'
                      : 'text-nila/80 hover:bg-nila/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <hr className="my-1 border-nila/10" />
            {user ? (
              <>
                <div className="px-4 py-2 text-xs text-nila/50">{user.email}</div>
                <Link to="/pesanan" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-nila/80 hover:bg-nila/5">
                  <Package className="h-4 w-4" strokeWidth={2} /> Pesanan
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-tanah hover:bg-red-50">
                  <LogOut className="h-4 w-4" strokeWidth={2} /> Keluar
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl bg-nila px-4 py-2.5 text-sm font-semibold text-mori">
                Masuk / Daftar
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
