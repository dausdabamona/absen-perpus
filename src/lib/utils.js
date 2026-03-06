export function getTanggalHariIni() {
  return new Date().toISOString().split('T')[0]
}

export function getJamSekarang() {
  return new Date().toTimeString().split(' ')[0]
}

export function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function formatJam(timeStr) {
  if (!timeStr) return '-'
  return timeStr.substring(0, 5)
}

export function hitungDurasi(jamMasuk, jamKeluar) {
  if (!jamMasuk || !jamKeluar) return null
  const [h1, m1, s1] = jamMasuk.split(':').map(Number)
  const [h2, m2, s2] = jamKeluar.split(':').map(Number)
  const totalMenit = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (totalMenit < 0) return null
  const jam = Math.floor(totalMenit / 60)
  const menit = totalMenit % 60
  if (jam > 0) return `${jam}j ${menit}m`
  return `${menit}m`
}

export function bersihkanNIT(raw) {
  return (raw || '').trim().replace(/\s+/g, '')
}

export const TUJUAN_OPTIONS = [
  { value: 'baca', label: 'Baca di Tempat' },
  { value: 'pinjam', label: 'Pinjam Buku' },
  { value: 'kembali', label: 'Kembalikan Buku' },
  { value: 'tugas', label: 'Kerjakan Tugas' },
  { value: 'lainnya', label: 'Lainnya' },
]

export const KATEGORI_OPTIONS = [
  { value: 'taruna', label: 'Taruna' },
  { value: 'dosen', label: 'Dosen' },
  { value: 'staf', label: 'Staf' },
  { value: 'tamu', label: 'Tamu' },
]

export function labelKategori(kat) {
  const found = KATEGORI_OPTIONS.find((k) => k.value === kat)
  return found ? found.label : kat || '-'
}

export function labelTujuan(t) {
  const found = TUJUAN_OPTIONS.find((o) => o.value === t)
  return found ? found.label : t || '-'
}
