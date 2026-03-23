import React, { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState<Array<{from:string,text:string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      })
      const body = await res.json()
      setMessages(m => [...m, { from: 'bot', text: body.reply || 'no reply' }])
    } catch (e) {
      setMessages(m => [...m, { from: 'bot', text: 'Error contacting server' }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 720, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <div style={{ minHeight: 140, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '6px 0' }}>
            <strong>{m.from}:</strong> <span>{m.text}</span>
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
