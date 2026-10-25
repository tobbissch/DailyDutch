// Draws the app icons (orange square, white "D") as PNGs into public/.
// Run once after changing the design: node scripts/make-icons.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const OUT = new URL('../public/', import.meta.url).pathname
const BG = [0xe8, 0x65, 0x0a]
const FG = [0xff, 0xff, 0xff]

/** Is (x, y) in [0,1]² inside the letter? Kept within the maskable safe zone (centre 60%). */
function inD(x, y) {
  const top = 0.3, bottom = 0.7, left = 0.34, stroke = 0.075
  if (y < top || y > bottom || x < left) return false
  const cy = (top + bottom) / 2, ry = (bottom - top) / 2, cx = 0.47, rx = 0.2
  if (x <= cx) return x < left + stroke || y < top + stroke || y > bottom - stroke
  const outer = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
  const inner = ((x - cx) / (rx - stroke)) ** 2 + ((y - cy) / (ry - stroke)) ** 2 <= 1
  return outer && !inner
}

function png(size) {
  const SS = 4
  const rows = []
  for (let py = 0; py < size; py++) {
    const row = [0] // filter: none
    for (let px = 0; px < size; px++) {
      let hit = 0
      for (let i = 0; i < SS; i++)
        for (let j = 0; j < SS; j++) hit += inD((px + (i + 0.5) / SS) / size, (py + (j + 0.5) / SS) / size)
      const a = hit / (SS * SS)
      row.push(...BG.map((b, k) => Math.round(b + (FG[k] - b) * a)))
    }
    rows.push(Buffer.from(row))
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc = (buf) => {
    let c = 0xffffffff
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type), data])
    const sum = Buffer.alloc(4)
    sum.writeUInt32BE(crc(body))
    return Buffer.concat([len, body, sum])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180], ['favicon-32.png', 32]]) {
  writeFileSync(OUT + name, png(size))
  console.log(`public/${name}`)
}
