'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

const STARTER_PROMPTS = [
  { icon: '🔍', text: 'How do I find my first winning product?' },
  { icon: '📈', text: 'Why aren\'t my videos getting views?' },
  { icon: '💰', text: 'How do I get to $1k/month?' },
  { icon: '🎯', text: 'What should I post today?' },
  { icon: '🔴', text: 'Tips for my first TikTok LIVE' },
  { icon: '✍️', text: 'Write me a hook for a skincare product' },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
        style={isUser
          ? { background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)' }
          : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
        }>
        {isUser ? <User className="w-4 h-4 text-[#a855f7]" /> : <Bot className="w-4 h-4 text-gray-400" />}
      </div>

      <div className={`max-w-[75%] lg:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser ? 'rounded-tr-sm text-white' : 'rounded-tl-sm text-gray-200'
      }`}
        style={isUser
          ? { background: 'linear-gradient(135deg, #a855f7, #3B7DE8)', boxShadow: '0 2px 12px rgba(168,85,247,0.2)' }
          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
        }>
        {message.content}
      </div>
    </div>
  )
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    if (!text.trim() || loading) return
    setError('')

    const userMsg: Message = { role: 'user', content: text.trim(), id: Date.now().toString() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content }))
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        id: (Date.now() + 1).toString(),
      }])
    } catch {
      setError('Network error. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col bg-black" style={{ height: '100dvh' }}>

      {/* Header */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <Bot className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div>
            <div className="font-bold text-sm">Timeless AI Coach</div>
            <div className="text-xs text-gray-500">Trained on every course &amp; strategy inside Timeless</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4">
        <div className="max-w-3xl mx-auto">

          {/* Empty state */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-xl font-black mb-2">Ask me anything about TikTok Shop</h2>
              <p className="text-gray-500 text-sm mb-8 max-w-sm">
                I know the courses, the strategies, and what actually works. Ask a real question and I&apos;ll give you a real answer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {STARTER_PROMPTS.map(prompt => (
                  <button
                    key={prompt.text}
                    onClick={() => send(prompt.text)}
                    className="flex items-center gap-2 p-3 rounded-xl text-left transition-all hover:border-white/15"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-lg flex-shrink-0">{prompt.icon}</span>
                    <span className="text-gray-300 text-xs">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {!isEmpty && (
            <div className="space-y-4 pt-4">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Bot className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center text-xs text-red-400 py-2">{error}</div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-4 border-t border-white/5"
        style={{ paddingBottom: `max(1rem, env(safe-area-inset-bottom))` }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end p-1 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the coach anything..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 px-3 py-2.5 resize-none outline-none leading-relaxed"
              style={{ maxHeight: '120px' }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = Math.min(el.scrollHeight, 120) + 'px'
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all disabled:opacity-30"
              style={{ background: input.trim() && !loading ? 'linear-gradient(135deg, #a855f7, #3B7DE8)' : 'rgba(255,255,255,0.05)' }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="text-center text-[10px] text-gray-700 mt-2">
            Shift+Enter for new line · Enter to send
          </div>
        </div>
      </div>
    </div>
  )
}
