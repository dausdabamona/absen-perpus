import { db } from '../lib/db'
import { getTanggalHariIni, getJamSekarang } from '../lib/utils'

export default function useKunjungan() {
  async function cariKunjunganAktif(nit) {
    const hariIni = getTanggalHariIni()
    return db.kunjungan
      .where({ nit, tanggal: hariIni, status: 'aktif' })
      .first()
  }

  async function catatMasuk(anggota, tujuan) {
    const hariIni = getTanggalHariIni()
    const jam = getJamSekarang()
    return db.kunjungan.add({
      anggota_id: anggota.id || null,
      nit: anggota.nit,
      nama: anggota.nama,
      kategori: anggota.kategori,
      tanggal: hariIni,
      jam_masuk: jam,
      jam_keluar: null,
      tujuan,
      status: 'aktif',
      synced: 0,
    })
  }

  async function catatKeluar(kunjunganId) {
    const jam = getJamSekarang()
    return db.kunjungan.update(kunjunganId, {
      jam_keluar: jam,
      status: 'selesai',
    })
  }

  async function getKunjunganByTanggal(tanggal) {
    return db.kunjungan
      .where('tanggal')
      .equals(tanggal)
      .reverse()
      .sortBy('jam_masuk')
  }

  async function getKunjunganRange(dari, sampai) {
    return db.kunjungan
      .where('tanggal')
      .between(dari, sampai, true, true)
      .toArray()
  }

  async function hapusKunjunganSebelum(tanggal) {
    return db.kunjungan.where('tanggal').below(tanggal).delete()
  }

  async function totalKunjungan() {
    return db.kunjungan.count()
  }

  return {
    cariKunjunganAktif,
    catatMasuk,
    catatKeluar,
    getKunjunganByTanggal,
    getKunjunganRange,
    hapusKunjunganSebelum,
    totalKunjungan,
  }
}
