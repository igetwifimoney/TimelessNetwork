'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

type Status = 'idea' | 'scripted' | 'filmed' | 'posted'

interface ContentItem {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: 'video' | 'slideshow' | 'live'
  status: Status
  hook?: string
  product?: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  idea:     { label: 'Idea',     color: 'text-gray-400',   bg: 'rgba(255,255,255,0.05)' },
  scripted: { label: 'Scripted', color: 'text-yellow-400', bg: 'rgba(234,179,8,0.08)'   },
  filmed:   { label: 'Filmed',   color: 'text-blue-400',   bg: 'rgba(79,142,247,0.08)'  },
  posted:   { label: 'Posted ✓', color: 'text-green-400',  bg: 'rgba(34,197,94,0.08)'   },
}

const TYPE_EMOJI: Record<ContentItem['type'], string> = {
  video:     '🎬',
  slideshow: '🖼️',
  live:      '🔴',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function toKey(date: Date) {
  return date.toISOString().split('T')[0]
}

function getWeekDates(anchor: Date): Date[] {
  const start = new Date(anchor)
  start.setDate(anchor.getDate() - anchor.getDay()) // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export default function PlannerPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [anchor, setAnchor] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => toKey(new Date()))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'video' as ContentItem['type'], hook: '', product: '' })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeless_planner')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  function save(updated: ContentItem[]) {
    setItems(updated)
    localStorage.setItem('timeless_planner', JSON.stringify(updated))
  }

  function addItem() {
    if (!form.title.trim()) return
    const item: ContentItem = {
      id: Date.now().toString(),
      date: selectedDate,
      title: form.title.trim(),
      type: form.type,
      status: 'idea',
      hook: form.hook.trim() || undefined,
      product: form.product.trim() || undefined,
    }
    save([...items, item])
    setForm({ title: '', type: 'video', hook: '', product: '' })
    setShowForm(false)
  }

  function cycleStatus(id: string) {
    const order: Status[] = ['idea', 'scripted', 'filmed', 'posted']
    save(items.map(item => {
      if (item.id !== id) return item
      const idx = order.indexOf(item.status)
      return { ...item, status: order[(idx + 1) % order.length] }
    }))
  }

  function removeItem(id: string) {
    save(items.filter(i => i.id !== id))
  }

  const week = getWeekDates(anchor)
  const selectedItems = items.filter(i => i.date === selectedDate)
  const today = toKey(new Date())

  // Count per day for indicators
  const countByDay = (date: Date) => items.filter(i => i.date === toKey(date)).length
  const postedByDay = (date: Date) => items.filter(i => i.date === toKey(date) && i.status === 'posted').length

  const weekPosted = week.reduce((sum, d) => sum + postedByDay(d), 0)
  const weekTotal = week.reduce((sum, d) => sum + countByDay(d), 0)

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">Content Planner</h1>
            <p className="text-gray-500 text-sm mt-0.5">Plan your week. Track your posts. Stay consistent.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-[#4F8EF7]">{weekPosted}/{weekTotal}</div>
            <div className="text-xs text-gray-500">posted this week</div>
          </div>
        </div>

        {/* Week nav */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n })}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-gray-300">
            {MONTHS[week[0].getMonth()]} {week[0].getDate()} – {MONTHS[week[6].getMonth()]} {week[6].getDate()}, {week[6].getFullYear()}
          </div>
          <button onClick={() => setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n })}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Week strip */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {week.map((date, i) => {
            const key = toKey(date)
            const isSelected = key === selectedDate
            const isToday = key === today
            const count = countByDay(date)
            const posted = postedByDay(date)
            return (
              <button key={i} onClick={() => setSelectedDate(key)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all"
                style={isSelected
                  ? { background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.25)' }
                  : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }
                }>
                <span className="text-[10px] text-gray-600 font-medium">{DAYS[i]}</span>
                <span className={`text-sm font-black ${isToday ? 'text-[#4F8EF7]' : isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {date.getDate()}
                </span>
                {count > 0 ? (
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(count, 4) }).map((_, j) => (
                      <div key={j} className="w-1 h-1 rounded-full"
                        style={{ background: j < posted ? '#34D399' : 'rgba(79,142,247,0.5)' }} />
                    ))}
                  </div>
                ) : <div className="h-1" />}
              </button>
            )
          })}
        </div>

        {/* Selected day content */}
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold text-sm">
            {DAYS[new Date(selectedDate + 'T12:00:00').getDay()]} · {MONTHS[new Date(selectedDate + 'T12:00:00').getMonth()]} {new Date(selectedDate + 'T12:00:00').getDate()}
            {selectedDate === today && <span className="ml-2 text-xs text-[#4F8EF7]">Today</span>}
          </div>
          <button onClick={() => setShowForm(true)}
            className="btn-premium flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> Add Content
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card rounded-2xl p-4 mb-4" style={{ border: '1px solid rgba(79,142,247,0.15)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Content Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. LED Mirror unboxing"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ContentItem['type'] }))}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white outline-none">
                  <option value="video">🎬 Video</option>
                  <option value="slideshow">🖼️ Slideshow</option>
                  <option value="live">🔴 Live</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Hook (optional)</label>
                <input value={form.hook} onChange={e => setForm(f => ({ ...f, hook: e.target.value }))}
                  placeholder="e.g. I can't believe this works..."
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Product (optional)</label>
                <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                  placeholder="e.g. LED Makeup Mirror"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addItem} className="btn-premium px-4 py-2 rounded-xl text-sm font-bold">Add</button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Day items */}
        {selectedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Calendar className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nothing planned. Add your first piece of content.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedItems.map(item => {
              const sc = STATUS_CONFIG[item.status]
              return (
                <div key={item.id} className="card rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => cycleStatus(item.id)} className="mt-0.5 flex-shrink-0" title="Click to advance status">
                      {item.status === 'posted'
                        ? <CheckCircle className="w-5 h-5 text-green-400" />
                        : <Circle className="w-5 h-5 text-gray-600 hover:text-white transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{TYPE_EMOJI[item.type]}</span>
                        <span className={`font-semibold text-sm ${item.status === 'posted' ? 'line-through text-gray-500' : 'text-white'}`}>
                          {item.title}
                        </span>
                        <button onClick={() => cycleStatus(item.id)}
                          className="px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all hover:opacity-80"
                          style={{ background: sc.bg, color: sc.color.replace('text-', '') }}>
                          <span className={sc.color}>{sc.label}</span>
                        </button>
                      </div>
                      {item.hook && <div className="text-xs text-gray-500 mt-1">Hook: {item.hook}</div>}
                      {item.product && <div className="text-xs text-gray-600 mt-0.5">Product: {item.product}</div>}
                    </div>
                    <button onClick={() => removeItem(item.id)}
                      className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
