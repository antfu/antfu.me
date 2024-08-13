import fs from 'node:fs/promises'
import { hierarchy, pack } from 'd3-hierarchy'
import _sponsors from '../temp/sponsors.json'

const amountMax = Math.max(..._sponsors.map(sponsor => sponsor.amount))
const RADIUS_MIN = 8
const RADIUS_MAX = 300

const sponsors = _sponsors
  .filter(sponsor => sponsor.amount > 0)
  .map((sponsor, idx) => ({
    id: `sponsor-${idx}`,
    radius: 0,
    position: {
      x: 0,
      y: 0,
    },
    ...sponsor,
  }))

const root = hierarchy({ ...sponsors[0], children: sponsors, id: 'root' })
  .sum(d => 1 + lerp(RADIUS_MIN, RADIUS_MAX, (Math.max(0.1, d.amount || 0) / amountMax) ** 0.9))
  .sort((a, b) => (b.value || 0) - (a.value || 0))

const p = pack<typeof sponsors[0]>()
p.size([500, 500])
p.padding(2)
const circles = p(root as any).descendants().slice(1)

for (const circle of circles) {
  const id = circle.data.id
  const sponsor = sponsors.find(s => s.id === id)
  if (sponsor) {
    sponsor.position = { x: circle.x, y: circle.y }
    sponsor.radius = circle.r
  }
}

function lerp(a: number, b: number, t: number) {
  if (t < 0)
    return a
  return a + (b - a) * t
}

await fs.mkdir('src/data', { recursive: true })
await fs.writeFile('src/data/sponsors-circles.json', JSON.stringify(sponsors, null, 2))
