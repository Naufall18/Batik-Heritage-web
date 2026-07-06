// Pattern batik SVG on-brand & deterministik (seed dari slug) —
// dipakai sebagai fallback saat produk/UMKM belum punya foto asli,
// agar kartu tetap tampak disengaja & bernuansa heritage (bukan foto acak).

type Combo = { bg: string; ink: string; accent: string }

// Kombinasi warna dari palet pewarna alam (kontras terjaga)
const COMBOS: Combo[] = [
  { bg: '#24305e', ink: '#f2cd7a', accent: '#e0a526' }, // nila · kunyit
  { bg: '#5e3820', ink: '#e9d9be', accent: '#c67b5c' }, // soga · tanah
  { bg: '#1a2347', ink: '#9c6a44', accent: '#7b4b2a' }, // nila deep · soga
  { bg: '#7b4b2a', ink: '#f7f3e8', accent: '#e0a526' }, // soga · mori
  { bg: '#2f3a2a', ink: '#d4c4a8', accent: '#8a9a5b' }, // hijau daun · sand
]

type MotifId = 'kawung' | 'ceplok' | 'parang' | 'truntum'
const MOTIFS: MotifId[] = ['kawung', 'ceplok', 'parang', 'truntum']

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return Math.abs(h)
}

function Motif({ id, stroke, accent }: { id: MotifId; stroke: string; accent: string }) {
  const common = { fill: 'none', stroke, strokeWidth: 1.4 }
  switch (id) {
    case 'kawung':
      return (
        <g {...common}>
          <ellipse cx="30" cy="14" rx="8" ry="13" />
          <ellipse cx="30" cy="46" rx="8" ry="13" />
          <ellipse cx="14" cy="30" rx="13" ry="8" />
          <ellipse cx="46" cy="30" rx="13" ry="8" />
          <circle cx="30" cy="30" r="2" fill={accent} stroke="none" />
        </g>
      )
    case 'ceplok':
      return (
        <g {...common}>
          <circle cx="30" cy="30" r="15" />
          <circle cx="30" cy="30" r="8" />
          <path d="M30 4 L34 26 M30 56 L26 34 M4 30 L26 34 M56 30 L34 26" />
          <circle cx="30" cy="30" r="2.5" fill={accent} stroke="none" />
        </g>
      )
    case 'parang':
      return (
        <g {...common}>
          <path d="M2 58 Q14 44 8 32 Q2 22 14 14 Q20 8 16 2" />
          <path d="M16 58 Q28 44 22 32 Q16 22 28 14 Q34 8 30 2" />
          <path d="M30 58 Q42 44 36 32 Q30 22 42 14 Q48 8 44 2" />
          <path d="M44 58 Q56 44 50 32 Q44 22 56 14 Q62 8 58 2" />
          <g fill={accent} stroke="none">
            <circle cx="11" cy="30" r="1.6" />
            <circle cx="25" cy="30" r="1.6" />
            <circle cx="39" cy="30" r="1.6" />
            <circle cx="53" cy="30" r="1.6" />
          </g>
        </g>
      )
    case 'truntum':
      return (
        <g {...common}>
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M30 30 L30 10" transform={`rotate(${a} 30 30)`} />
          ))}
          {[45, 135, 225, 315].map((a) => (
            <circle key={a} cx="30" cy="14" r="3" transform={`rotate(${a} 30 30)`} fill={accent} stroke="none" />
          ))}
          <circle cx="30" cy="30" r="3.5" />
        </g>
      )
  }
}

export default function BatikMotif({
  seed,
  label,
  className = '',
}: {
  seed: string
  label?: string
  className?: string
}) {
  const h = hash(seed)
  const combo = COMBOS[h % COMBOS.length]
  const motif = MOTIFS[(h >> 3) % MOTIFS.length]
  const patternId = `bm-${motif}-${h % COMBOS.length}`

  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid slice"
      role="img"
    >
      <defs>
        <linearGradient id={`${patternId}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={combo.bg} />
          <stop offset="100%" stopColor={combo.bg} stopOpacity="0.82" />
        </linearGradient>
        <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
          <Motif id={motif} stroke={combo.ink} accent={combo.accent} />
        </pattern>
      </defs>
      <rect width="200" height="250" fill={`url(#${patternId}-g)`} />
      <rect width="200" height="250" fill={`url(#${patternId})`} opacity="0.62" />
      {label && (
        <text
          x="100"
          y="238"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2"
          fill={combo.ink}
          opacity="0.75"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase' }}
        >
          {label}
        </text>
      )}
    </svg>
  )
}
