import { useState, useCallback, useEffect } from 'react'
import { Wifi, WifiOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/layout/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import QrScannerView from '../components/scanner/QrScannerView'
import ManualInput from '../components/scanner/ManualInput'
import useScanner from '../hooks/use-scanner'
import useAnggota from '../hooks/use-anggota'
import useKunjungan from '../hooks/use-kunjungan'
import {
  bersihkanNIT,
  TUJUAN_OPTIONS,
  labelKategori,
  labelTujuan,
} from '../lib/utils'

export default function ScanPage() {
  const [online, setOnline] = useState(navigator.onLine)
  const [modalOpen, setModalOpen] = useState(false)
  const [anggotaDitemukan, setAnggotaDitemukan] = useState(null)
  const [kunjunganAktif, setKunjunganAktif] = useState(null)
  const [tujuan, setTujuan] = useState('baca')
  const [modeKeluar, setModeKeluar] = useState(false)

  // State untuk tamu tidak terdaftar
  const [showTamuModal, setShowTamuModal] = useState(false)
  const [nitTidakDitemukan, setNitTidakDitemukan] = useState('')
  const [namaTamu, setNamaTamu] = useState('')

  const { cariByNIT, tambahAnggota } = useAnggota()
  const { cariKunjunganAktif, catatMasuk, catatKeluar } = useKunjungan()

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleScan = useCallback(
    async (rawNIT) => {
      const nit = bersihkanNIT(rawNIT)
      if (!nit) return

      const anggota = await cariByNIT(nit)
      if (!anggota) {
        setNitTidakDitemukan(nit)
        setNamaTamu('')
        setShowTamuModal(true)
        return
      }

      const aktif = await cariKunjunganAktif(nit)
      setAnggotaDitemukan(anggota)
      setKunjunganAktif(aktif || null)
      setModeKeluar(!!aktif)
      setTujuan('baca')
      setModalOpen(true)
    },
    [cariByNIT, cariKunjunganAktif]
  )

  const { isScanning, error, startScanner, stopScanner } = useScanner(handleScan)

  async function handleKonfirmasi() {
    try {
      if (modeKeluar && kunjunganAktif) {
        await catatKeluar(kunjunganAktif.id)
        toast.success(`${anggotaDitemukan.nama} — Keluar berhasil dicatat`)
      } else {
        await catatMasuk(anggotaDitemukan, tujuan)
        toast.success(
          `${anggotaDitemukan.nama} — Masuk (${labelTujuan(tujuan)})`
        )
      }
    } catch (err) {
      toast.error('Gagal menyimpan: ' + err.message)
    }
    setModalOpen(false)
  }

  async function handleTambahTamu() {
    if (!namaTamu.trim()) {
      toast.error('Nama tamu wajib diisi')
      return
    }
    try {
      const tamuData = {
        nit: nitTidakDitemukan,
        nama: namaTamu.trim(),
        kategori: 'tamu',
        prodi: '',
        angkatan: '',
      }
      await tambahAnggota(tamuData)
      await catatMasuk(tamuData, 'lainnya')
      toast.success(`Tamu ${namaTamu.trim()} berhasil dicatat masuk`)
      setShowTamuModal(false)
    } catch (err) {
      toast.error('Gagal: ' + err.message)
    }
  }

  return (
    <div className="pb-20">
      <PageHeader
        title="Perpus Absen"
        subtitle="Politeknik KP Sorong"
        right={
          <Badge type={online ? 'online' : 'offline'}>
            {online ? (
              <>
                <Wifi size={12} className="mr-1" /> Online
              </>
            ) : (
              <>
                <WifiOff size={12} className="mr-1" /> Offline
              </>
            )}
          </Badge>
        }
      />

      <div className="p-4 flex flex-col items-center gap-4">
        <QrScannerView
          isScanning={isScanning}
          error={error}
          onStart={startScanner}
          onStop={stopScanner}
        />

        <div className="text-center text-sm text-gray-500 font-medium">
          atau
        </div>

        <ManualInput onSubmit={handleScan} />
      </div>

      {/* Modal Konfirmasi Masuk/Keluar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modeKeluar ? 'Konfirmasi Keluar' : 'Konfirmasi Masuk'}
      >
        {anggotaDitemukan && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nama</span>
                <span className="text-sm font-semibold">{anggotaDitemukan.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">NIT</span>
                <span className="text-sm font-semibold">{anggotaDitemukan.nit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Kategori</span>
                <Badge type={anggotaDitemukan.kategori}>
                  {labelKategori(anggotaDitemukan.kategori)}
                </Badge>
              </div>
              {anggotaDitemukan.prodi && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Prodi/Unit</span>
                  <span className="text-sm">{anggotaDitemukan.prodi}</span>
                </div>
              )}
            </div>

            {modeKeluar ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600">
                  Sudah ada kunjungan aktif hari ini.
                </p>
                <p className="text-sm font-semibold text-primary-500">
                  Masuk: {kunjunganAktif?.jam_masuk?.substring(0, 5)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Tujuan Kunjungan:
                </p>
                <div className="space-y-2">
                  {TUJUAN_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        tujuan === opt.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tujuan"
                        value={opt.value}
                        checked={tujuan === opt.value}
                        onChange={() => setTujuan(opt.value)}
                        className="accent-primary-500"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              variant={modeKeluar ? 'secondary' : 'primary'}
              onClick={handleKonfirmasi}
            >
              {modeKeluar ? 'Konfirmasi Keluar' : 'Konfirmasi Masuk'}
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal Tamu Tidak Terdaftar */}
      <Modal
        open={showTamuModal}
        onClose={() => setShowTamuModal(false)}
        title="NIT Tidak Terdaftar"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            NIT <strong>{nitTidakDitemukan}</strong> tidak ditemukan di database.
          </p>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Nama Pengunjung (Tamu)
            </label>
            <input
              type="text"
              value={namaTamu}
              onChange={(e) => setNamaTamu(e.target.value)}
              placeholder="Masukkan nama..."
              className="w-full min-h-[48px] px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-base"
            />
          </div>
          <Button className="w-full" onClick={handleTambahTamu}>
            <UserPlus size={18} />
            Tambah sebagai Tamu
          </Button>
        </div>
      </Modal>
    </div>
  )
}
