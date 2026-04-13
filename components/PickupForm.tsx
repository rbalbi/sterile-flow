'use client'

import { useState } from 'react'

export default function PickupForm() {
  const [surgery, setSurgery] = useState('')
  const [items, setItems] = useState('5 scrubs, 2 trays')
  const [windowStart, setWindowStart] = useState('')
  const [windowEnd, setWindowEnd] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Schedule pickup for surgery ${surgery || 'ad-hoc'} with items: ${items}`)
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <label>
        Surgery (optional)
        <input value={surgery} onChange={(e) => setSurgery(e.target.value)} placeholder="Surgery ID or OR" />
      </label>

      <label>
        Items
        <input value={items} onChange={(e) => setItems(e.target.value)} />
      </label>

      <label>
        Window start
        <input type="datetime-local" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} />
      </label>

      <label>
        Window end
        <input type="datetime-local" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} />
      </label>

      <button type="submit">Request Pickup</button>
    </form>
  )
}
