import { useEffect } from 'react'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import type { Vendor } from '../lib/types'

const pin = (color: string) =>
  L.divIcon({
    className: '',
    html: `<span style="display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.4)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -16],
  })

const vendorPin = pin('#7b4b2a')
const userPin = pin('#e0a526')

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
  }, [map, center[0], center[1]]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

interface Props {
  center: [number, number]
  zoom?: number
  vendors?: Vendor[]
  user?: [number, number] | null
  radiusKm?: number
}

export default function MapView({ center, zoom = 12, vendors = [], user, radiusKm }: Props) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
      <Recenter center={user ?? center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {user && (
        <>
          <Marker position={user} icon={userPin}>
            <Popup>Lokasi kamu</Popup>
          </Marker>
          {radiusKm && (
            <Circle
              center={user}
              radius={radiusKm * 1000}
              pathOptions={{ color: '#24305e', fillColor: '#24305e', fillOpacity: 0.05 }}
            />
          )}
        </>
      )}
      {vendors
        .filter((v) => v.latitude != null && v.longitude != null)
        .map((v) => (
          <Marker key={v.id} position={[v.latitude!, v.longitude!]} icon={vendorPin}>
            <Popup>
              <strong>{v.name}</strong>
              <br />
              {v.kecamatan}
              {v.distance_km != null ? ` · ${v.distance_km} km` : ''}
              <br />
              <Link to={`/umkm/${v.slug}`}>Lihat toko →</Link>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
