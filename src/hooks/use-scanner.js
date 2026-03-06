import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function useScanner(onScanSuccess) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const scannerRef = useRef(null)
  const lastScanRef = useRef('')
  const lastScanTimeRef = useRef(0)

  const startScanner = useCallback(async () => {
    setError(null)
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader')
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          const now = Date.now()
          // Debounce: ignore same scan within 3 seconds
          if (
            decodedText === lastScanRef.current &&
            now - lastScanTimeRef.current < 3000
          ) {
            return
          }
          lastScanRef.current = decodedText
          lastScanTimeRef.current = now
          onScanSuccess(decodedText)
        },
        () => {} // ignore scan failures
      )
      setIsScanning(true)
    } catch (err) {
      if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission')) {
        setError('Izin kamera ditolak. Buka pengaturan browser untuk mengizinkan akses kamera.')
      } else {
        setError('Gagal mengaktifkan kamera: ' + (err?.message || err))
      }
    }
  }, [onScanSuccess])

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop()
      }
    } catch {
      // ignore
    }
    setIsScanning(false)
  }, [])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop()
          }
        } catch {
          // ignore
        }
      }
    }
  }, [])

  return { isScanning, error, startScanner, stopScanner }
}
