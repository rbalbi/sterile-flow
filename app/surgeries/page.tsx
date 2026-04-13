const surgeries = [
  { id: 's1', room: 'OR-1', scheduled_at: '2026-04-14T09:00:00', surgeon: 'Dr. Smith' },
  { id: 's2', room: 'OR-3', scheduled_at: '2026-04-14T11:30:00', surgeon: 'Dr. Lee' },
]

export default function Surgeries() {
  return (
    <div>
      <h2>Upcoming Surgeries</h2>
      <ul>
        {surgeries.map((s) => (
          <li key={s.id}>{new Date(s.scheduled_at).toLocaleString()} — {s.room} — {s.surgeon}</li>
        ))}
      </ul>
    </div>
  )
}
