import { Camera, CameraOff } from 'lucide-react'
import Button from '../ui/Button'

export default function QrScannerView({ isScanning, error, onStart, onStop }) {
  return (
    <div className="flex flex-col items-center">
      {/* Scanner area */}
      <div className="relative w-full max-w-[320px] aspect-square bg-gray-900 rounded-2xl overflow-hidden">
        <div id="qr-reader" className="w-full h-full" />

        {isScanning && (
          <>
            {/* Corner overlays */}
            <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-accent-500 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-accent-500 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-accent-500 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-accent-500 rounded-br-lg pointer-events-none" />
            {/* Scan line */}
            <div className="absolute left-4 right-4 h-0.5 bg-accent-500 scan-line pointer-events-none" />
          </>
        )}

        {!isScanning && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70">
            <Camera size={48} />
            <p className="mt-2 text-sm">Kamera belum aktif</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-xl text-center max-w-[320px]">
          {error}
        </div>
      )}

      <div className="mt-4">
        {isScanning ? (
          <Button variant="outline" onClick={onStop}>
            <CameraOff size={20} />
            Matikan Kamera
          </Button>
        ) : (
          <Button onClick={onStart}>
            <Camera size={20} />
            Mulai Scan
          </Button>
        )}
      </div>
    </div>
  )
}
