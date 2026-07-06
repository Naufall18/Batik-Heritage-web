import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { register as apiRegister } from '../lib/api'
import AuthShell from '../components/AuthShell'
import { fadeUp } from '../lib/motion'

const inputCls =
  'w-full rounded-xl border border-nila/15 bg-paper px-4 py-3 text-sm text-nila placeholder:text-nila/30 transition focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.')
      return
    }
    setLoading(true)
    try {
      const res = await apiRegister(name, email, password, passwordConfirmation)
      setAuth(res.access_token, res.user)
      navigate('/')
    } catch (err: any) {
      const msg = err.response?.data?.message
      const errs = err.response?.data?.errors
      if (errs) {
        const first = Object.values(errs)[0] as string[]
        setError(first?.[0] ?? 'Terjadi kesalahan.')
      } else {
        setError(msg ?? 'Terjadi kesalahan.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      seed="daftar-batik-heritage"
      eyebrow="Bergabung dengan kami"
      title="Buat akun"
      subtitle={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-soga hover:underline">
            Masuk di sini
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <motion.div variants={fadeUp}>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-nila">Nama Lengkap</label>
          <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Nama Anda" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-nila">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="nama@email.com" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-nila">Password</label>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-11`}
              placeholder="Min. 8 karakter"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-nila/40 transition hover:text-soga"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-nila">Konfirmasi Password</label>
          <input
            id="password_confirmation"
            type={show ? 'text' : 'password'}
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className={inputCls}
            placeholder="Ulangi password"
          />
        </motion.div>

        <motion.button
          variants={fadeUp}
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-nila px-6 py-3.5 text-sm font-semibold text-mori transition hover:bg-nila-deep disabled:opacity-50"
        >
          {loading ? 'Memproses…' : (<><UserPlus className="h-4 w-4" strokeWidth={2} /> Daftar gratis</>)}
        </motion.button>
      </form>
    </AuthShell>
  )
}
