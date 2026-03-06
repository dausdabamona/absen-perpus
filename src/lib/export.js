import * as XLSX from 'xlsx'
import { formatTanggal, formatJam, labelKategori, labelTujuan } from './utils'

export function exportKunjunganExcel(dataKunjungan, rekapHarian) {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Data Kunjungan
  const kunjunganRows = dataKunjungan.map((k) => ({
    Tanggal: formatTanggal(k.tanggal),
    NIT: k.nit,
    Nama: k.nama,
    Kategori: labelKategori(k.kategori),
    'Jam Masuk': formatJam(k.jam_masuk),
    'Jam Keluar': formatJam(k.jam_keluar),
    Tujuan: labelTujuan(k.tujuan),
    Status: k.status === 'aktif' ? 'Masih di dalam' : 'Selesai',
  }))
  const ws1 = XLSX.utils.json_to_sheet(kunjunganRows)
  XLSX.utils.book_append_sheet(wb, ws1, 'Data Kunjungan')

  // Sheet 2: Rekap Per Hari
  const rekapRows = rekapHarian.map((r) => ({
    Tanggal: formatTanggal(r.tanggal),
    'Total Pengunjung': r.total,
    Taruna: r.taruna,
    'Dosen/Staf': r.dosenStaf,
  }))
  const ws2 = XLSX.utils.json_to_sheet(rekapRows)
  XLSX.utils.book_append_sheet(wb, ws2, 'Rekap Per Hari')

  const tanggal = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `Rekap_Perpus_${tanggal}.xlsx`)
}
