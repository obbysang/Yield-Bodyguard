export async function sendDiscord(message: string) {
  try {
    await fetch('http://localhost:8787/alerts/discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
  } catch {}
}
