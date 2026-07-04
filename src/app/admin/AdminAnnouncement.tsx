'use client'

import { useState } from 'react'
import { Megaphone, Check } from 'lucide-react'

export default function AdminAnnouncement() {
  const [text, setText] = useState('')
  const [channel, setChannel] = useState('general')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function send() {
    if (!text.trim() || sending) return
    setSending(true)

    try {
      const res = await fetch('/api/admin/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), channel }),
      })
      if (res.ok) {
        setSent(true)
        setText('')
        setTimeout(() => setSent(false), 3000)
      }
    } catch {}

    setSending(false)
  }

  return (
    <div className="card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="w-4 h-4 text-[#4F8EF7]" />
        <h2 className="font-bold text-sm">Post Announcement</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Channel</label>
          <select
            value={channel}
            onChange={e => setChannel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white outline-none"
          >
            <option value="general">general</option>
            <option value="announcements">announcements</option>
            <option value="wins">wins</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Message</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type your announcement..."
            rows={4}
            className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none resize-none leading-relaxed"
          />
        </div>

        <button
          onClick={send}
          disabled={!text.trim() || sending || sent}
          className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{ background: sent ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #4F8EF7, #3B7DE8)' }}
        >
          {sent ? (
            <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Sent!</span></>
          ) : sending ? 'Sending...' : 'Post Announcement'}
        </button>
      </div>
    </div>
  )
}
