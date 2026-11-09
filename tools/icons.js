// Draws the app icon (a gold crown over an ember glow, on near-black) as PNGs with no dependencies.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = buf => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
// Crown outline in 0..1 space (points, band below).
const CROWN = [[.24,.62],[.24,.38],[.36,.5],[.43,.28],[.5,.46],[.57,.28],[.64,.5],[.76,.38],[.76,.62]];
function inPoly(u, v, P){ let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++){ const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > v) !== (yj > v) && u < (xj - xi) * (v - yi) / (yj - yi) + xi) c = !c; } return c; }
const mix = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
function paint(u, v){
  const d = Math.hypot(u - .5, v - .66);
  let bg = mix([0x3a, 0x10, 0x0c], [0x0b, 0x08, 0x09], Math.min(1, d / .55));
  const glow = Math.max(0, 1 - Math.hypot(u - .5, (v - .72) * 2.2) / .32);
  bg = mix(bg, [0xff, 0x7a, 0x3d], glow * .55);
  const band = u >= .22 && u <= .78 && v >= .6 && v <= .69;
  if (inPoly(u, v, CROWN) || band){
    const t = (v - .28) / .41;
    let c = mix([0xff, 0xf0, 0xc4], [0xb0, 0x7a, 0x2c], Math.max(0, Math.min(1, t)));
    if (band && Math.hypot(u - .5, v - .645) < .03) c = [0xc4, 0x29, 0x3f];
    if (band && (Math.hypot(u - .34, v - .645) < .022 || Math.hypot(u - .66, v - .645) < .022)) c = [0x4a, 0x6b, 0xd8];
    return c;
  }
  for (const [x, y] of [[.43,.28],[.57,.28],[.24,.38],[.76,.38]]) if (Math.hypot(u - x, v - y) < .028) return [0xff, 0xf2, 0xc4];
  return bg;
}
function png(size){
  const SS = 4, raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const c = paint((x + (sx + .5) / SS) / size, (y + (sy + .5) / SS) / size);
        for (let i = 0; i < 3; i++) acc[i] += c[i];
      }
      const o = y * (size * 4 + 1) + 1 + x * 4;
      for (let i = 0; i < 3; i++) raw[o + i] = Math.round(acc[i] / (SS * SS));
      raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const out = path.join(__dirname, "..", "icons");
fs.mkdirSync(out, {recursive: true});
for (const [name, size] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  fs.writeFileSync(path.join(out, name), png(size));
  console.log("wrote", name);
}
