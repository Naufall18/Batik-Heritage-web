import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col bg-mori text-nila">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-nila/10 px-5 py-6 text-center text-xs text-nila/50">
        © {new Date().getFullYear()} Batik Heritage — Marketplace Batik UMKM Pasuruan
      </footer>
    </div>
  )
}
