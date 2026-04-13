import Link from 'next/link'

export default function NavBar() {
  return (
    <nav style={{ background: '#0b5cff', color: 'white', padding: '12px 24px' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <strong>Uber Clean</strong>
        <Link href="/dashboard" style={{ color: 'white' }}>
          Dashboard
        </Link>
        <Link href="/pickups/new" style={{ color: 'white' }}>
          Schedule Pickup
        </Link>
        <Link href="/surgeries" style={{ color: 'white' }}>
          Surgeries
        </Link>
      </div>
    </nav>
  )
}
