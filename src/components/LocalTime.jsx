import { useEffect, useState } from 'react'
import { site } from '../data/site'

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: site.timezone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/** Live Pune clock for the footer. */
export default function LocalTime() {
  const [now, setNow] = useState(() => fmt.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span>
      Pune · India — <span className="time">{now} IST</span>
    </span>
  )
}
