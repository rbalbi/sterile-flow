import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Uber Clean — Hospitals (MVP UI)</h1>
      <p>Quick links</p>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/pickups/new">Schedule Pickup</Link>
        </li>
        <li>
          <Link href="/surgeries">Upcoming Surgeries</Link>
        </li>
      </ul>
    </div>
  )
}
