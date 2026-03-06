import { useState, useEffect, useCallback } from 'react'
import { Clock, LogOut, Search, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/layout/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import useKunjungan from '../hooks/use-kunjungan'
import {
  getTanggalHariIni,
  formatTanggal,
  formatJam,
  hitungDurasi,
  labelKategori,
  labelTujuan,
} from '../lib/utils'

const FILTER_PRESETS = [
  { label: 'Hari Ini', getValue: () => getTanggalHariIni() },
  {
    label: 'Kemarin',
    getValue: () => {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      return d.toISOString().split('T')[0]
    },
  },
]

export default function HistoryPage() {
  const [tanggal, setTanggal] = useState(getTanggalHariIni())
  const [filterKategori, setFilterKategori] = useState('semua')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)

  const { getKunjunganByTanggal, catatKeluar } = useKunjungan()

  const loadData = useCallback(async () => {
    setLoading(true)
    const result = await getKunjunganByTanggal(tanggal)
    setData(result)
    setLoading(false)
  }, [tanggal, getKunjunganByTanggal])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered =
    filterKategori === 'semua'
      ? data
      : filterKategori === 'dosen-staf'
        ? data.filter((k) => k.kategori === 'dosen' || k.kategori === 'staf')
        : data.filter((k) => k.kategori === filterKategori)

  async function handleTandaiKeluar() {
    if (!selectedItem) return
    try {
      await catatKeluar(selectedItem.id)
      toast.success(`${selectedItem.nama} — Keluar berhasil dicatat`)
      setSelectedItem(null)
      loadData()
    } catch (err) {
      toast.error('Gagal: ' + err.message)
    }
  }

  return (
    <div className="pb-20">
      <PageHeader title="Riwayat Kunjungan" subtitle={formatTanggal(tanggal)} />

      <div className="p-4 space-y-3">
        {/* Filter Tanggal */}
        <div className="flex gap-2 items-center">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setTanggal(preset.getValue())}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                tanggal === preset.getValue()
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <div className="relative flex-1">
            <Calendar
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 rounded-full text-xs border border-gray-200 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-2">
          {['semua', 'taruna', 'dosen-staf'].map((kat) => (
            <button
              key={kat}
              onClick={() => setFilterKategori(kat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filterKategori === kat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {kat === 'semua'
                ? 'Semua'
                : kat === 'taruna'
                  ? 'Taruna'
                  : 'Dosen/Staf'}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Memuat...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Belum ada kunjungan"
            description={`Tidak ada data kunjungan pada ${formatTanggal(tanggal)}`}
          />
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 font-medium">
              {filtered.length} pengunjung
            </div>
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.nit}</p>
                  </div>
                  <Badge type={item.status}>
                    {item.status === 'aktif' ? 'Di dalam' : 'Selesai'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <Badge type={item.kategori}>
                    {labelKategori(item.kategori)}
                  </Badge>
                  <span>
                    {formatJam(item.jam_masuk)} — {formatJam(item.jam_keluar)}
                  </span>
                  {item.jam_keluar && (
                    <span className="text-gray-400">
                      ({hitungDurasi(item.jam_masuk, item.jam_keluar)})
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Detail Kunjungan"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-semibold">{selectedItem.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">NIT</span>
                <span className="font-semibold">{selectedItem.nit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Kategori</span>
                <Badge type={selectedItem.kategori}>
                  {labelKategori(selectedItem.kategori)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tujuan</span>
                <span>{labelTujuan(selectedItem.tujuan)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jam Masuk</span>
                <span>{formatJam(selectedItem.jam_masuk)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jam Keluar</span>
                <span>{formatJam(selectedItem.jam_keluar)}</span>
              </div>
              {selectedItem.jam_keluar && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Durasi</span>
                  <span>
                    {hitungDurasi(selectedItem.jam_masuk, selectedItem.jam_keluar)}
                  </span>
                </div>
              )}
            </div>

            {selectedItem.status === 'aktif' && (
              <Button
                className="w-full"
                variant="secondary"
                onClick={handleTandaiKeluar}
              >
                <LogOut size={18} />
                Tandai Keluar
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
