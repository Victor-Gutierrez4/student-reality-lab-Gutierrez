import Head from 'next/head'
import dynamic from 'next/dynamic'
import React from 'react'

const Chat = dynamic(() => import('../components/Chat'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js Chat — MCP Demo</title>
      </Head>
      <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h1>Chat (MCP demo)</h1>
        <p>Use the chat below to send a message; the API will respond via a simple MCP stub.</p>
        <Chat />
      </main>
    </>
  )
}
