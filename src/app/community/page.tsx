'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { MessageSquare, Heart, Star, Send, Hash } from 'lucide-react'

const CHANNELS = [
  { id: 'general',          label: 'general',          count: 12 },
  { id: 'wins',             label: 'wins',             count: 5  },
  { id: 'product-research', label: 'product-research', count: 8  },
  { id: 'content-tips',     label: 'content-tips',     count: 3  },
  { id: 'tiktok-shop',      label: 'tiktok-shop',      count: 21 },
  { id: 'accountability',   label: 'accountability',   count: 7  },
]

const LEADERBOARD = [
  { initials: 'MK', name: 'Marcus K.', xp: '3,240 XP' },
  { initials: 'JT', name: 'Jordan T.', xp: '2,890 XP' },
  { initials: 'SR', name: 'Sofia R.',  xp: '2,610 XP' },
]

const POSTS = [
  {
    avatar: 'MK', name: 'Marcus K.', role: 'Gold Member', time: '8m ago',
    channel: 'wins',
    content: 'Just crossed $10k in total TikTok Shop sales! Started 6 weeks ago with zero experience. The product research system in Module 2 changed everything for me. DM me if you want to know what niche I went with. 🔥',
    likes: 47, comments: 12, isWin: true,
  },
  {
    avatar: 'SR', name: 'Sofia R.', role: 'Member', time: '34m ago',
    channel: 'content-tips',
    content: 'Quick tip: posting between 6–8pm EST has doubled my views consistently. Also stop overthinking the hook — just start with the product and let the results speak. Tested this across 30+ videos now.',
    likes: 23, comments: 8, isWin: false,
  },
  {
    avatar: 'JT', name: 'Jordan T.', role: 'Elite Member', time: '1h ago',
    channel: 'accountability',
    content: 'Day 45 check-in ✅ Posted every day for 45 days straight. Revenue: $0 → $6,800/mo. Consistency is the entire game. Who else is on a streak?',
    likes: 89, comments: 34, isWin: true,
  },
  {
    avatar: 'AD', name: 'Aaliyah D.', role: 'Member', time: '2h ago',
    channel: 'product-research',
    content: "Has anyone tested the kitchen gadget niche recently? I'm seeing crazy engagement on my test videos but conversions are low. Wondering if it's a product selection issue or my CTAs.",
    likes: 11, comments: 19, isWin: false,
  },
]

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState('general')
  const [newPost, setNewPost] = useState('')
  const [likes, setLikes] = useState<Record<number, number>>(
    Object.fromEntries(POSTS.map((p, i) => [i, p.likes]))
  )

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex-1 flex min-w-0">
        {/* ── Channel sidebar ── */}
        <nav
          className="w-52 flex-shrink-0 flex flex-col h-screen sticky top-0"
          style={{ background: '#050505', borderRight: '1px solid rgba(255,255,255,0.04)' }}
          aria-label="Community channels"
        >
          <div className="p-4 pt-5">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-1" aria-hidden="true">
              Channels
            </div>
            <ul className="space-y-0.5" role="list">
              {CHANNELS.map(ch => (
                <li key={ch.id}>
                  <button
                    onClick={() => setActiveChannel(ch.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all"
                    style={activeChannel === ch.id ? {
                      background: 'rgba(79,142,247,0.08)',
                      border: '1px solid rgba(79,142,247,0.15)',
                      color: '#60A5FA',
                    } : {
                      border: '1px solid transparent',
                      color: '#4B5563',
                    }}
                    aria-pressed={activeChannel === ch.id}
                    aria-label={`${ch.label} channel${ch.count > 0 ? `, ${ch.count} new` : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate text-xs font-medium">{ch.label}</span>
                    </span>
                    {ch.count > 0 && (
                      <span
                        className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                        style={activeChannel === ch.id
                          ? { background: 'rgba(79,142,247,0.2)', color: '#4F8EF7' }
                          : { background: 'rgba(255,255,255,0.05)', color: '#6B7280' }}
                        aria-hidden="true"
                      >
                        {ch.count > 9 ? '9+' : ch.count}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 pt-4 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-1">This Week</div>
            <ol className="space-y-2" aria-label="Weekly leaderboard">
              {LEADERBOARD.map((member, i) => (
                <li key={member.name} className="flex items-center gap-2.5 px-1">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)', opacity: 1 - i * 0.1 }}
                      aria-hidden="true"
                    >
                      {member.initials}
                    </div>
                    <div className="absolute -top-1 -right-1 text-[9px] font-black" style={{ lineHeight: 1 }} aria-hidden="true">
                      {['🥇','🥈','🥉'][i]}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-300 truncate">{member.name}</div>
                    <div className="text-[10px] text-gray-600">{member.xp}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* ── Main feed ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden" id="main-content">
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}
          >
            <div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#4F8EF7]" aria-hidden="true" />
                <h1 className="font-bold">{activeChannel}</h1>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">1,200+ members · 47 posts today</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-400"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
              role="status"
              aria-label="128 members online"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" aria-hidden="true" />
              128 online
            </div>
          </div>

          {/* Posts */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3" role="feed" aria-label="Community posts">
            {POSTS.map((post, i) => (
              <article key={i} className="card-premium p-5 group">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                    aria-hidden="true"
                  >
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-sm">{post.name}</span>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#6B7280' }}
                      >
                        {post.role}
                      </span>
                      <span className="text-[10px] font-medium text-[#4F8EF7] flex items-center gap-1">
                        <Hash className="w-2.5 h-2.5" aria-hidden="true" />{post.channel}
                      </span>
                      {post.isWin && (
                        <span
                          className="text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full text-emerald-400"
                          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
                        >
                          <Star className="w-2.5 h-2.5" aria-hidden="true" /> Win
                        </span>
                      )}
                      <time className="text-xs text-gray-700 ml-auto">{post.time}</time>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <button
                        onClick={() => setLikes(prev => ({ ...prev, [i]: prev[i] + 1 }))}
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#4F8EF7] transition-colors group/heart"
                        aria-label={`Like post by ${post.name} — ${likes[i]} likes`}
                      >
                        <Heart className="w-3.5 h-3.5 group-hover/heart:scale-125 transition-transform" aria-hidden="true" />
                        <span aria-live="polite">{likes[i]}</span>
                      </button>
                      <button
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors"
                        aria-label={`${post.comments} replies to ${post.name}'s post`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{post.comments} replies</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Composer */}
          <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#000' }}>
            <form
              onSubmit={e => { e.preventDefault(); setNewPost('') }}
              className="flex gap-3 items-end"
              aria-label="New post composer"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                aria-hidden="true"
              >
                Y
              </div>
              <div
                className="flex-1 rounded-2xl px-4 py-3 focus-within:border-[#4F8EF7]/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <label htmlFor="post-input" className="sr-only">Write a post to #{activeChannel}</label>
                <textarea
                  id="post-input"
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Share a win, ask a question, or post an update..."
                  rows={2}
                  className="w-full bg-transparent text-sm text-white placeholder-gray-700 resize-none outline-none leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-700" aria-hidden="true"># {activeChannel}</span>
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="btn-premium flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs"
                    aria-label={`Post to #${activeChannel}`}
                  >
                    <Send className="w-3 h-3" aria-hidden="true" />
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
