import { useState, useEffect, useCallback } from 'react'
import { Download, BarChart3, Users, GraduationCap, Briefcase } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import useKunjungan from '../hooks/use-kunjungan'
import { exportKunjunganExcel } from '../lib/export'
import { formatTanggal, hitungDurasi } from '../lib/utils'

function getDefaultRange() {
  const sampai = new Date().toISOString().split('T')[0]
  const dari = new Date()
  dari.setDate(dari.getDate() - 6)
  return { dari: dari.toISOString().split('T')[0], sampai }
}

export default function ReportPage() {
  const [range, setRange] = useState(getDefaultRange)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const { getKunjunganRange } = useKunjungan()

  const loadData = useCallback(async () => {
    setLoading(true)
    const result = await getKunjunganRange(range.dari, range.sampai)
    setData(result)
    setLoading(false)
  }, [range, getKunjunganRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Stats
  const totalPengunjung = data.length
  const taruna = data.filter((d) => d.kategori === 'taruna').length
  const dosenStaf = data.filter(
    (d) => d.kategori === 'dosen' || d.kategori === 'staf'
  ).length

  // Average duration
  const durations = data
    .filter((d) => d.jam_masuk && d.jam_keluar)
    .map((d) => {
      const [h1, m1] = d.jam_masuk.split(':').map(Number)
      const [h2, m2] = d.jam_keluar.split(':').map(Number)
      return (h2 * 60 + m2) - (h1 * 60 + m1)
    })
    .filter((d) => d > 0)
  const avgDurasi =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0

  // Per-day data
  const perHari = {}
  data.forEach((d) => {
    if (!perHari[d.tanggal]) {
      perHari[d.tanggal] = { total: 0, taruna: 0, dosenStaf: 0 }
    }
    perHari[d.tanggal].total++
    if (d.kategori === 'taruna') perHari[d.tanggal].taruna++
    if (d.kategori === 'dosen' || d.kategori === 'staf')
      perHari[d.tanggal].dosenStaf++
  })

  const rekapHarian = Object.entries(perHari)
    .map(([tanggal, stats]) => ({ tanggal, ...stats }))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))

  const maxHarian = Math.max(...rekapHarian.map((r) => r.total), 1)

  function handleExport() {
    exportKunjunganExcel(data, rekapHarian)
  }

  return (
    <div className="pb-20">
      <PageHeader title="Laporan" subtitle="Statistik & Export" />

      <div className="p-4 space-y-4">
        {/* Date range */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Dari</label>
            <input
              type="date"
              value={range.dari}
              onChange={(e) => setRange((r) => ({ ...r, dari: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Sampai</label>
            <input
              type="date"
              value={range.sampai}
              onChange={(e) =>
                setRange((r) => ({ ...r, sampai: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Memuat...
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Belum ada data"
            description="Tidak ada kunjungan pada rentang tanggal ini"
          />
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Users}
                label="Total Pengunjung"
                value={totalPengunjung}
                color="bg-primary-50 text-primary-600"
              />
              <StatCard
                icon={GraduationCap}
                label="Taruna"
                value={taruna}
                color="bg-blue-50 text-blue-600"
              />
              <StatCard
                icon={Briefcase}
                label="Dosen/Staf"
                value={dosenStaf}
                color="bg-purple-50 text-purple-600"
              />
              <StatCard
                icon={BarChart3}
                label="Rata-rata Durasi"
                value={`${avgDurasi}m`}
                color="bg-accent-50 text-accent-600"
              />
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                Kunjungan Per Hari
              </h3>
              <div className="space-y-2">
                {rekapHarian.map((r) => (
                  <div key={r.tanggal} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12 shrink-0">
                      {formatTanggal(r.tanggal).substring(0, 5)}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="bg-primary-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max((r.total / maxHarian) * 100, 8)}%`,
                        }}
                      >
                        <span className="text-[10px] font-bold text-white">
                          {r.total}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export */}
            <Button className="w-full" onClick={handleExport}>
              <Download size={18} />
              Export Excel (.xlsx)
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}
      >
        <Icon size={16} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
