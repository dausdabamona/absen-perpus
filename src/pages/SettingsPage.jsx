import { useState, useEffect } from 'react'
import {
  Upload,
  UserPlus,
  Database,
  Info,
  Trash2,
  Download,
  CheckCircle,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import useAnggota from '../hooks/use-anggota'
import useKunjungan from '../hooks/use-kunjungan'
import { KATEGORI_OPTIONS, bersihkanNIT } from '../lib/utils'

export default function SettingsPage() {
  const [stats, setStats] = useState({
    taruna: 0,
    dosenStaf: 0,
    tamu: 0,
    total: 0,
    kunjungan: 0,
  })

  // Import state
  const [preview, setPreview] = useState(null)
  const [importData, setImportData] = useState([])

  // Manual add
  const [showManual, setShowManual] = useState(false)
  const [form, setForm] = useState({
    nit: '',
    nama: '',
    kategori: 'taruna',
    prodi: '',
    angkatan: '',
  })

  // Delete old data
  const [showHapus, setShowHapus] = useState(false)
  const [bulanHapus, setBulanHapus] = useState('')

  // PWA install
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  const { tambahAnggota, importAnggota, totalByKategori } = useAnggota()
  const { totalKunjungan, hapusKunjunganSebelum } = useKunjungan()

  async function loadStats() {
    const kat = await totalByKategori()
    const kunj = await totalKunjungan()
    setStats({ ...kat, kunjungan: kunj })
  }

  useEffect(() => {
    loadStats()

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Handle file upload
  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws)

        const parsed = json.map((row) => ({
          nit: bersihkanNIT(String(row.NIT || row.nit || '')),
          nama: String(row.Nama || row.nama || '').trim(),
          kategori: String(row.Kategori || row.kategori || 'taruna')
            .trim()
            .toLowerCase(),
          prodi: String(row.Prodi || row.prodi || '').trim(),
          angkatan: String(row.Angkatan || row.angkatan || '').trim(),
        }))
          .filter((r) => r.nit && r.nama)

        setImportData(parsed)
        setPreview(parsed.slice(0, 5))
      } catch (err) {
        toast.error('Gagal membaca file: ' + err.message)
      }
    }
    reader.readAsBinaryString(file)
  }

  async function handleImport() {
    if (importData.length === 0) return
    try {
      const result = await importAnggota(importData)
      toast.success(
        `${result.ditambah} data ditambah, ${result.diperbarui} diperbarui`
      )
      setPreview(null)
      setImportData([])
      loadStats()
    } catch (err) {
      toast.error('Import gagal: ' + err.message)
    }
  }

  async function handleTambahManual(e) {
    e.preventDefault()
    if (!form.nit.trim() || !form.nama.trim()) {
      toast.error('NIT dan Nama wajib diisi')
      return
    }
    try {
      await tambahAnggota({
        ...form,
        nit: bersihkanNIT(form.nit),
        nama: form.nama.trim(),
      })
      toast.success(`${form.nama.trim()} berhasil ditambahkan`)
      setForm({ nit: '', nama: '', kategori: 'taruna', prodi: '', angkatan: '' })
      setShowManual(false)
      loadStats()
    } catch (err) {
      if (err.message?.includes('uniqueness')) {
        toast.error('NIT sudah terdaftar')
      } else {
        toast.error('Gagal: ' + err.message)
      }
    }
  }

  async function handleHapusData() {
    if (!bulanHapus) return
    const tanggal = bulanHapus + '-01'
    try {
      const count = await hapusKunjunganSebelum(tanggal)
      toast.success(`${count} data kunjungan berhasil dihapus`)
      setShowHapus(false)
      loadStats()
    } catch (err) {
      toast.error('Gagal: ' + err.message)
    }
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  return (
    <div className="pb-20">
      <PageHeader title="Pengaturan" subtitle="Data & Konfigurasi" />

      <div className="p-4 space-y-4">
        {/* Import Anggota */}
        <Section title="Import Anggota dari Excel" icon={Upload}>
          <p className="text-xs text-gray-500 mb-3">
            Kolom: NIT, Nama, Kategori, Prodi, Angkatan
          </p>
          <label className="block">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </label>

          {preview && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Preview ({importData.length} baris):
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-1 text-left">NIT</th>
                      <th className="px-2 py-1 text-left">Nama</th>
                      <th className="px-2 py-1 text-left">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1">{row.nit}</td>
                        <td className="px-2 py-1">{row.nama}</td>
                        <td className="px-2 py-1">{row.kategori}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="w-full mt-3" onClick={handleImport}>
                <CheckCircle size={16} />
                Import {importData.length} Data
              </Button>
            </div>
          )}
        </Section>

        {/* Tambah Manual */}
        <Section title="Tambah Anggota Manual" icon={UserPlus}>
          {showManual ? (
            <form onSubmit={handleTambahManual} className="space-y-3">
              <Input
                label="NIT *"
                value={form.nit}
                onChange={(v) => setForm((f) => ({ ...f, nit: v }))}
              />
              <Input
                label="Nama *"
                value={form.nama}
                onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
              />
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Kategori
                </label>
                <select
                  value={form.kategori}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kategori: e.target.value }))
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-gray-200 text-sm focus:border-primary-500 focus:outline-none"
                >
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Prodi/Unit"
                value={form.prodi}
                onChange={(v) => setForm((f) => ({ ...f, prodi: v }))}
              />
              <Input
                label="Angkatan"
                value={form.angkatan}
                onChange={(v) => setForm((f) => ({ ...f, angkatan: v }))}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Simpan
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowManual(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowManual(true)}
            >
              <UserPlus size={16} />
              Tambah Anggota
            </Button>
          )}
        </Section>

        {/* Database Stats */}
        <Section title="Statistik Database" icon={Database}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xl font-bold text-blue-700">{stats.taruna}</p>
              <p className="text-xs text-blue-600">Taruna</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xl font-bold text-purple-700">
                {stats.dosenStaf}
              </p>
              <p className="text-xs text-purple-600">Dosen/Staf</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-700">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Anggota</p>
            </div>
            <div className="bg-accent-50 rounded-xl p-3">
              <p className="text-xl font-bold text-accent-700">
                {stats.kunjungan}
              </p>
              <p className="text-xs text-accent-600">Total Kunjungan</p>
            </div>
          </div>

          <button
            onClick={() => setShowHapus(true)}
            className="mt-3 flex items-center gap-2 text-xs text-red-500 font-semibold"
          >
            <Trash2 size={14} />
            Hapus Data Kunjungan Lama
          </button>
        </Section>

        {/* App Info */}
        <Section title="Info Aplikasi" icon={Info}>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Perpus Absen</strong> v1.0.0
            </p>
            <p>Politeknik Kelautan dan Perikanan Sorong</p>
            <p className="text-xs text-gray-400">
              Offline-first PWA — Data tersimpan di perangkat
            </p>
          </div>
          {deferredPrompt && (
            <Button
              variant="secondary"
              className="w-full mt-3"
              onClick={handleInstall}
            >
              <Download size={16} />
              Install Aplikasi
            </Button>
          )}
        </Section>
      </div>

      {/* Modal Hapus */}
      <Modal
        open={showHapus}
        onClose={() => setShowHapus(false)}
        title="Hapus Data Kunjungan Lama"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Hapus semua data kunjungan sebelum bulan:
          </p>
          <input
            type="month"
            value={bulanHapus}
            onChange={(e) => setBulanHapus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary-500 focus:outline-none"
          />
          <Button variant="danger" className="w-full" onClick={handleHapusData}>
            <Trash2 size={16} />
            Hapus Data
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={16} className="text-primary-500" />}
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 block mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[44px] px-3 rounded-xl border border-gray-200 text-sm focus:border-primary-500 focus:outline-none"
      />
    </div>
  )
}
