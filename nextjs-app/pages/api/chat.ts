import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { message } = req.body || {}
  // For now, call the local MCP tool if available; otherwise echo
  try {
    // attempt to forward to MCP tool
    const mcpRes = await fetch('http://localhost:4000/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    if (mcpRes.ok) {
      const json = await mcpRes.json()
      return res.status(200).json({ reply: json.reply })
    }
  } catch (e) {
    // ignore and fallback
  }

  // fallback: simple echo + timestamp
  return res.status(200).json({ reply: `Echo: ${String(message)} (${new Date().toLocaleTimeString()})` })
}
