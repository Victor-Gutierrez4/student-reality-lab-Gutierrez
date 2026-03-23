import React, { useState } from 'react'

type Msg = { role: 'user' | 'assistant', content: string }

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim()) return
    const userMsg: Msg = { role: 'user', content: input }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const payload = { messages: [...messages, userMsg] }
      const res = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const body = await res.json()
      const reply = body.reply || 'no reply'
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (e) {
      try {
        const r2 = await fetch('http://localhost:4000/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMsg] })
        })
        const b2 = await r2.json()
        setMessages(m => [...m, { role: 'assistant', content: b2.reply || 'no reply' }])
      } catch (e2) {
        setMessages(m => [...m, { role: 'assistant', content: 'Error contacting server' }])
      }
    } finally { setLoading(false) }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>Chat (MCP)</h3>
      <div style={{ minHeight: 120, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '6px 0' }}>
            <strong>{m.role === 'user' ? 'you' : 'bot'}:</strong> <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
          style={{ flex: 1, padding: 8 }}
          placeholder="Type a message"
        />
        <button onClick={send} disabled={loading} style={{ padding: '8px 12px' }}>{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}
