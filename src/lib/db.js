import Dexie from 'dexie'

export const db = new Dexie('PerpusAbsenDB')

db.version(1).stores({
  anggota: '++id, &nit, nama, kategori, prodi, angkatan',
  kunjungan: '++id, anggota_id, nit, nama, kategori, tanggal, jam_masuk, jam_keluar, tujuan, status, synced',
})
