import Link from 'next/link'

const upcomingSurgeries = [
  { id: 's1', room: 'OR-1', scheduled_at: '2026-04-14T09:00:00', surgeon: 'Dr. Smith', case_type: 'General' },
  { id: 's2', room: 'OR-3', scheduled_at: '2026-04-14T11:30:00', surgeon: 'Dr. Lee', case_type: 'Orthopedics' },
]

const pickups = [
  { id: 'p1', status: 'requested', eta: '2026-04-14T08:00:00' },
  { id: 'p2', status: 'in_transit', eta: '2026-04-14T10:00:00' },
]

export default function Dashboard() {
  return (
    <div>
      <h2>Director Dashboard</h2>

      <section>
        <h3>Upcoming Surgeries</h3>
        <ul>
          {upcomingSurgeries.map((s) => (
            <li key={s.id}>
              {new Date(s.scheduled_at).toLocaleString()} — {s.room} — {s.surgeon} ({s.case_type})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Active Pickups</h3>
        <ul>
          {pickups.map((p) => (
            <li key={p.id}>
              <Link href={`/pickups/${p.id}`}>{p.id}</Link> — {p.status} — ETA {new Date(p.eta).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
