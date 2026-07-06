export const rupiah = (n: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)

export const TECHNIQUE_LABEL: Record<string, string> = {
  tulis: 'Batik Tulis',
  cap: 'Batik Cap',
  printing: 'Printing',
  kombinasi: 'Kombinasi',
}
