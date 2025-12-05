'use client'
import React, { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile((e.target as HTMLInputElement).files?.[0] ?? null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setSummary('')
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/summary', { method: 'POST', body: formData })
    const json = await res.json()
    setSummary(json.result || '要約に失敗しました')
    setLoading(false)
  }

  return (
    <main style={{maxWidth: 800, margin: '2em auto', fontFamily: 'sans-serif'}}>
      <h1>判決文アップロード &rarr; AI要約</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button type="submit" disabled={!file || loading}>
          {loading ? '要約中…' : 'アップロードして要約'}
        </button>
      </form>
      <br />
      {summary && (
        <section style={{whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1em', borderRadius: 8}}>
          <h2>要約結果</h2>
          <div>{summary}</div>
        </section>
      )}
    </main>
  )
}