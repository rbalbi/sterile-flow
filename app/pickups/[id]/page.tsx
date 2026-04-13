export default function PickupDetails({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div>
      <h2>Pickup {id}</h2>
      <p>Status: in_transit</p>
      <p>Items:</p>
      <ul>
        <li>5 x Scrubs</li>
        <li>2 x Instrument Trays</li>
      </ul>
      <p>Live tracking (placeholder)</p>
    </div>
  )
}
