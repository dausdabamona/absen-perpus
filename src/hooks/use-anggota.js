import { db } from '../lib/db'

export default function useAnggota() {
  async function cariByNIT(nit) {
    return db.anggota.where('nit').equals(nit).first()
  }

  async function tambahAnggota(data) {
    return db.anggota.add(data)
  }

  async function importAnggota(rows) {
    let ditambah = 0
    let diperbarui = 0

    for (const row of rows) {
      const existing = await db.anggota.where('nit').equals(row.nit).first()
      if (existing) {
        await db.anggota.update(existing.id, row)
        diperbarui++
      } else {
        await db.anggota.add(row)
        ditambah++
      }
    }

    return { ditambah, diperbarui }
  }

  async function totalAnggota() {
    return db.anggota.count()
  }

  async function totalByKategori() {
    const all = await db.anggota.toArray()
    const taruna = all.filter((a) => a.kategori === 'taruna').length
    const dosenStaf = all.filter(
      (a) => a.kategori === 'dosen' || a.kategori === 'staf'
    ).length
    const tamu = all.filter((a) => a.kategori === 'tamu').length
    return { taruna, dosenStaf, tamu, total: all.length }
  }

  return { cariByNIT, tambahAnggota, importAnggota, totalAnggota, totalByKategori }
}
