import { useEffect, useState } from 'react'
import { getVendorProfile, updateVendorProfile } from '../../lib/api'
import type { VendorProfile as Profile } from '../../lib/types'

export default function VendorProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [kelurahan, setKelurahan] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    getVendorProfile().then((p) => {
      setProfile(p)
      setName(p.name)
      setDescription(p.description ?? '')
      setWhatsapp(p.whatsapp ?? '')
      setAddress(p.address ?? '')
      setKecamatan(p.kecamatan ?? '')
      setKelurahan(p.kelurahan ?? '')
      setLatitude(p.latitude ? String(p.latitude) : '')
      setLongitude(p.longitude ? String(p.longitude) : '')
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.set('name', name)
      if (description) fd.set('description', description)
      if (whatsapp) fd.set('whatsapp', whatsapp)
      if (address) fd.set('address', address)
      if (kecamatan) fd.set('kecamatan', kecamatan)
      if (kelurahan) fd.set('kelurahan', kelurahan)
      if (latitude) fd.set('latitude', latitude)
      if (longitude) fd.set('longitude', longitude)
      const updated = await updateVendorProfile(fd)
      setProfile(updated)
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-nila/10 p-5">
            <div className="h-5 w-1/3 rounded bg-nila/5" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold text-nila">Profil Toko</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {profile && (
          <div className="rounded-2xl border border-nila/10 bg-paper p-4 text-sm text-nila/60">
            <p>Email: <span className="font-medium text-nila">{profile.user.email}</span></p>
            <p className="mt-1">
              Slug: <span className="font-mono text-xs text-nila/40">{profile.slug}</span>
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-nila/10 bg-paper p-5">
          <h3 className="font-display text-lg font-semibold text-nila">Informasi Toko</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Nama Toko</label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Deskripsi</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">No. WhatsApp</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20"
                placeholder="0812xxxxxxx" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-nila/10 bg-paper p-5">
          <h3 className="font-display text-lg font-semibold text-nila">Alamat</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Alamat Lengkap</label>
              <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-nila">Kecamatan</label>
                <input value={kecamatan} onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-nila">Kelurahan</label>
                <input value={kelurahan} onChange={(e) => setKelurahan(e.target.value)}
                  className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-nila/10 bg-paper p-5">
          <h3 className="font-display text-lg font-semibold text-nila">Lokasi (GPS)</h3>
          <p className="mt-1 text-xs text-nila/40">Digunakan untuk fitur "Batik di Sekitarku"</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Latitude</label>
              <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-nila">Longitude</label>
              <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)}
                className="w-full rounded-xl border border-nila/15 bg-mori px-4 py-2.5 text-sm text-nila focus:border-soga focus:outline-none focus:ring-2 focus:ring-soga/20" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="rounded-full bg-nila px-8 py-3 text-sm font-semibold text-mori transition hover:bg-nila-deep disabled:opacity-50">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  )
}
