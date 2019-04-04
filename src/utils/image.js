export function formatImageSize (byte) {
  const mb = byte / 1000 / 1000
  if (mb > 1) {
    return `${mb.toFixed(1)} MB`
  }

  const kb = byte / 1000
  if (kb > 1) {
    return `${Math.round(kb)} KB`
  }
  return `${byte} B`
}
