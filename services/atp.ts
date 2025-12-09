export async function checkAtpStatus(address: string): Promise<boolean> {
  try {
    const r = await fetch(`http://localhost:8787/atp/status?address=${address}`)
    if (!r.ok) return false
    const j = await r.json()
    return Boolean(j.ok)
  } catch {
    return false
  }
}
