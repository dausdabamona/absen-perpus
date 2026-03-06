import { useState } from 'react'
import { Keyboard } from 'lucide-react'
import Button from '../ui/Button'

export default function ManualInput({ onSubmit }) {
  const [nit, setNit] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nit.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setNit('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-[320px]">
      <input
        type="text"
        value={nit}
        onChange={(e) => setNit(e.target.value)}
        placeholder="Ketik NIT manual..."
        className="flex-1 min-h-[48px] px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-base"
      />
      <button
        type="submit"
        className="min-h-[48px] px-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
      >
        <Keyboard size={20} />
      </button>
    </form>
  )
}
