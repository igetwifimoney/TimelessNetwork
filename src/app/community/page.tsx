'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import { MessageSquare, Heart, Star, Send, Hash, ChevronDown, ChevronUp, X } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────
interface Reply {
  id: string
  avatar: string
  name: string
  content: string
  time: string
  likes: number
  likedByMe: boolean
}

interface Post {
  id: string
  avatar: string
  name: string
  role: string
  time: string
  channel: string
  content: string
  likes: number
  likedByMe: boolean
  isWin: boolean
  replies: Reply[]
}

// ─── Channels ────────────────────────────────────────────
const CHANNELS = [
  { id: 'general',          label: 'general'          },
  { id: 'wins',             label: 'wins'             },
  { id: 'product-research', label: 'product-research' },
  { id: 'content-tips',     label: 'content-tips'     },
  { id: 'tiktok-shop',      label: 'tiktok-shop'      },
  { id: 'accountability',   label: 'accountability'   },
]

// ─── Seed posts (one set per channel) ────────────────────
const SEED_POSTS: Post[] = [
  // general
  {
    id: 'g1', avatar: 'TB', name: 'Ty - igetwifimoney', role: 'Founder', time: '5m ago',
    channel: 'general', isWin: false, likes: 142, likedByMe: false,
    content: 'Welcome to the Timeless community. This is your home base. Ask questions, share wins, help each other out. The people in this room are building real businesses — treat it like a mastermind, not a comment section.',
    replies: [
      { id: 'g1r1', avatar: 'MK', name: 'Marcus K.', content: 'Appreciate you for building this Ty. Already learned more here in 2 weeks than the past year on YouTube.', time: '3m ago', likes: 31, likedByMe: false },
    ],
  },
  {
    id: 'g2', avatar: 'JT', name: 'Jordan T.', role: 'Elite Member', time: '22m ago',
    channel: 'general', isWin: false, likes: 18, likedByMe: false,
    content: 'Anyone else notice TikTok Shop pushed a new affiliate dashboard update? The analytics section looks completely different now. Curious if the commission tracking changed.',
    replies: [
      { id: 'g2r1', avatar: 'SR', name: 'Sofia R.', content: 'Yes! Noticed this morning. Seems like they added breakdown by video now which is huge.', time: '18m ago', likes: 9, likedByMe: false },
      { id: 'g2r2', avatar: 'AD', name: 'Aaliyah D.', content: 'The new breakdown is actually way easier to read. You can see which exact products are driving the most volume.', time: '12m ago', likes: 14, likedByMe: false },
    ],
  },
  {
    id: 'g3', avatar: 'NP', name: 'Nadia P.', role: 'Member', time: '1h ago',
    channel: 'general', isWin: false, likes: 7, likedByMe: false,
    content: 'Just finished the onboarding quiz. The personalized roadmap actually makes sense for where I am right now. Week 1 here we go.',
    replies: [],
  },

  // wins
  {
    id: 'w1', avatar: 'MK', name: 'Marcus K.', role: 'Gold Member', time: '8m ago',
    channel: 'wins', isWin: true, likes: 94, likedByMe: false,
    content: 'Just crossed $10k in total TikTok Shop sales! Started 6 weeks ago with zero experience. The product research system in the foundation course changed everything for me. DM me if you want to know what niche I went with. 🔥',
    replies: [
      { id: 'w1r1', avatar: 'JT', name: 'Jordan T.', content: 'LFG Marcus!! Six weeks is insane. What was your starting budget if you don\'t mind sharing?', time: '5m ago', likes: 22, likedByMe: false },
      { id: 'w1r2', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'This is exactly why I built Timeless. Proud of you bro. Keep posting.', time: '2m ago', likes: 47, likedByMe: false },
    ],
  },
  {
    id: 'w2', avatar: 'JT', name: 'Jordan T.', role: 'Elite Member', time: '1h ago',
    channel: 'wins', isWin: true, likes: 89, likedByMe: false,
    content: 'Day 45 check-in ✅ Posted every day for 45 days straight. Revenue: $0 to $6,800/mo. Consistency is the entire game. Who else is on a streak?',
    replies: [
      { id: 'w2r1', avatar: 'SR', name: 'Sofia R.', content: 'Day 12 here! Not at your numbers yet but the momentum is real. This post keeps me going.', time: '55m ago', likes: 18, likedByMe: false },
      { id: 'w2r2', avatar: 'NP', name: 'Nadia P.', content: 'This is goals. Saving this post for the days I want to quit.', time: '40m ago', likes: 11, likedByMe: false },
    ],
  },
  {
    id: 'w3', avatar: 'CL', name: 'Chris L.', role: 'Member', time: '3h ago',
    channel: 'wins', isWin: true, likes: 56, likedByMe: false,
    content: 'First video to hit 500K views 🎉 It\'s a simple unboxing. Nothing fancy. Just good lighting, clear audio, and the hook from lesson 3 of the viral hook course. Goes to show it really is the basics.',
    replies: [
      { id: 'w3r1', avatar: 'MK', name: 'Marcus K.', content: 'What hook did you use if you don\'t mind? Lesson 3 has like 5 different formats.', time: '2h ago', likes: 8, likedByMe: false },
    ],
  },

  // product-research
  {
    id: 'pr1', avatar: 'AD', name: 'Aaliyah D.', role: 'Member', time: '2h ago',
    channel: 'product-research', isWin: false, likes: 31, likedByMe: false,
    content: 'Has anyone tested the kitchen gadget niche recently? Seeing crazy engagement on my test videos but conversions are low. Wondering if it\'s a product selection issue or my CTAs.',
    replies: [
      { id: 'pr1r1', avatar: 'JT', name: 'Jordan T.', content: 'Kitchen gadgets are saturated at the low end but the $40-80 range is still printing. What price point are you testing?', time: '1h ago', likes: 19, likedByMe: false },
      { id: 'pr1r2', avatar: 'MK', name: 'Marcus K.', content: 'Your CTA matters a lot. If your video ends without a clear "link in bio" or shop link visible, people just swipe.', time: '45m ago', likes: 14, likedByMe: false },
    ],
  },
  {
    id: 'pr2', avatar: 'BK', name: 'Brandon K.', role: 'Gold Member', time: '4h ago',
    channel: 'product-research', isWin: false, likes: 43, likedByMe: false,
    content: 'Finding winner products framework I use: 1) TikTok search for "TikTok made me buy" in the niche 2) Check order count on TikTok Shop 3) Find the product on 1688 and check margin 4) Order sample before scaling. Simple but it works every time.',
    replies: [
      { id: 'pr2r1', avatar: 'AD', name: 'Aaliyah D.', content: 'Bookmarking this. Do you use any tools to check the order count or just native TikTok?', time: '3h ago', likes: 7, likedByMe: false },
      { id: 'pr2r2', avatar: 'SR', name: 'Sofia R.', content: 'This is gold. The 1688 check is the step most people skip.', time: '2h ago', likes: 22, likedByMe: false },
    ],
  },
  {
    id: 'pr3', avatar: 'LP', name: 'Lena P.', role: 'Member', time: '6h ago',
    channel: 'product-research', isWin: false, likes: 15, likedByMe: false,
    content: 'Quick question — when you find a winning product someone else is selling, how close can you get with a similar product before it\'s considered copying? Or is that not really a concern in this space?',
    replies: [
      { id: 'pr3r1', avatar: 'BK', name: 'Brandon K.', content: 'Not copying at all. Products aren\'t unique. Your content and positioning are. That\'s where differentiation happens.', time: '5h ago', likes: 29, likedByMe: false },
    ],
  },

  // content-tips
  {
    id: 'ct1', avatar: 'SR', name: 'Sofia R.', role: 'Member', time: '34m ago',
    channel: 'content-tips', isWin: false, likes: 67, likedByMe: false,
    content: 'Quick tip: posting between 6–8pm EST has doubled my views consistently. Also stop overthinking the hook. Just start with the product and let the results speak. Tested this across 30+ videos now.',
    replies: [
      { id: 'ct1r1', avatar: 'JT', name: 'Jordan T.', content: 'The 6–8pm window is real. I\'ve tested it across two accounts now and the pattern holds.', time: '28m ago', likes: 24, likedByMe: false },
      { id: 'ct1r2', avatar: 'CL', name: 'Chris L.', content: 'What about weekends? I\'ve been avoiding Sundays but not sure if that\'s right.', time: '15m ago', likes: 5, likedByMe: false },
      { id: 'ct1r3', avatar: 'SR', name: 'Sofia R.', content: 'Sundays before 9pm EST actually outperform Friday for me. Test it for 2 weeks and see.', time: '10m ago', likes: 17, likedByMe: false },
    ],
  },
  {
    id: 'ct2', avatar: 'MK', name: 'Marcus K.', role: 'Gold Member', time: '2h ago',
    channel: 'content-tips', isWin: false, likes: 52, likedByMe: false,
    content: 'Hook formats that are working for me right now:\n\n"The reason [X product] keeps selling out..."\n"I tested [X] for 30 days and here\'s what happened"\n"Nobody talks about this but [X]"\n\nPattern: curiosity gap + clear product in frame in first 0.3 seconds.',
    replies: [
      { id: 'ct2r1', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'The curiosity gap format is probably the highest ROI hook structure on TikTok Shop right now. Great post Marcus.', time: '1h ago', likes: 38, likedByMe: false },
    ],
  },
  {
    id: 'ct3', avatar: 'BK', name: 'Brandon K.', role: 'Gold Member', time: '5h ago',
    channel: 'content-tips', isWin: false, likes: 29, likedByMe: false,
    content: 'Stop using trending sounds for product videos. Your viewer is there for the product not the vibe. Clean simple audio almost always converts better. Controversial take but look at your analytics — it\'ll back this up.',
    replies: [
      { id: 'ct3r1', avatar: 'AD', name: 'Aaliyah D.', content: 'Actually tested this side by side. Trending audio: 800K views, 40 sales. Silent product demo: 200K views, 180 sales. The numbers don\'t lie.', time: '4h ago', likes: 61, likedByMe: false },
    ],
  },

  // tiktok-shop
  {
    id: 'ts1', avatar: 'JT', name: 'Jordan T.', role: 'Elite Member', time: '15m ago',
    channel: 'tiktok-shop', isWin: false, likes: 38, likedByMe: false,
    content: 'For anyone just starting affiliate: focus on ONE product for 30 days minimum. Most people hop between 10 products and wonder why nothing converts. Depth beats breadth especially when the algorithm is still learning your content.',
    replies: [
      { id: 'ts1r1', avatar: 'LP', name: 'Lena P.', content: 'This is the advice I wish I had 3 months ago. I was switching products weekly and making zero progress.', time: '10m ago', likes: 12, likedByMe: false },
    ],
  },
  {
    id: 'ts2', avatar: 'CL', name: 'Chris L.', role: 'Member', time: '1h ago',
    channel: 'tiktok-shop', isWin: false, likes: 24, likedByMe: false,
    content: 'TikTok Shop commission rates thread — what\'s everyone seeing? I\'m getting 10–15% on beauty, 8% on home goods. Is that normal or am I leaving money on the table?',
    replies: [
      { id: 'ts2r1', avatar: 'BK', name: 'Brandon K.', content: '10–15% beauty is solid. Some brands negotiate higher if you have consistent volume. Email them directly after you have 5+ sales.', time: '50m ago', likes: 16, likedByMe: false },
      { id: 'ts2r2', avatar: 'MK', name: 'Marcus K.', content: 'I\'ve gotten up to 20% on home goods by DMing the brand owner directly. Most sellers on TikTok Shop are small businesses and they\'ll work with you.', time: '35m ago', likes: 23, likedByMe: false },
    ],
  },
  {
    id: 'ts3', avatar: 'NP', name: 'Nadia P.', role: 'Member', time: '3h ago',
    channel: 'tiktok-shop', isWin: false, likes: 11, likedByMe: false,
    content: 'Newbie question — is it better to start with high-ticket or low-ticket products as a beginner? I\'ve heard both sides.',
    replies: [
      { id: 'ts3r1', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'Start low-ticket ($15–40 range). Lower barrier for buyers, faster feedback loop, easier to get your first 10 sales. Move up once you know what converts for YOU.', time: '2h ago', likes: 44, likedByMe: false },
    ],
  },

  // accountability
  {
    id: 'ac1', avatar: 'JT', name: 'Jordan T.', role: 'Elite Member', time: '1h ago',
    channel: 'accountability', isWin: true, likes: 89, likedByMe: false,
    content: 'Day 45 check-in ✅ Posted every day for 45 days straight. Revenue: $0 to $6,800/mo. Consistency is the entire game. Who else is on a streak?',
    replies: [
      { id: 'ac1r1', avatar: 'SR', name: 'Sofia R.', content: 'Day 12! Still going. This post is my daily motivation.', time: '55m ago', likes: 18, likedByMe: false },
      { id: 'ac1r2', avatar: 'LP', name: 'Lena P.', content: 'Day 7 checking in. Small but showing up.', time: '30m ago', likes: 9, likedByMe: false },
    ],
  },
  {
    id: 'ac2', avatar: 'AD', name: 'Aaliyah D.', role: 'Member', time: '3h ago',
    channel: 'accountability', isWin: false, likes: 22, likedByMe: false,
    content: 'Weekly accountability check-in 📊\n\nVideos posted: 7\nBest performer: 180K views\nSales: $340\nBiggest lesson: thumbnails on the first frame matter way more than I thought.',
    replies: [
      { id: 'ac2r1', avatar: 'MK', name: 'Marcus K.', content: '$340 in a week is real money. Don\'t overlook that. Keep stacking.', time: '2h ago', likes: 15, likedByMe: false },
    ],
  },
  {
    id: 'ac3', avatar: 'NP', name: 'Nadia P.', role: 'Member', time: '6h ago',
    channel: 'accountability', isWin: false, likes: 14, likedByMe: false,
    content: 'Day 1 official. Posting my accountability here so I have to show up. Goal: 5 videos per week for the next 90 days. Someone hold me to this.',
    replies: [
      { id: 'ac3r1', avatar: 'JT', name: 'Jordan T.', content: 'Locked in. We\'re watching 👀 Tag me in your day 30 check-in.', time: '5h ago', likes: 19, likedByMe: false },
      { id: 'ac3r2', avatar: 'SR', name: 'Sofia R.', content: 'Let\'s go! Day 1 energy is everything. Come back and update us end of week.', time: '4h ago', likes: 7, likedByMe: false },
    ],
  },
]

const LEADERBOARD = [
  { initials: 'MK', name: 'Marcus K.', xp: '3,240 XP' },
  { initials: 'JT', name: 'Jordan T.', xp: '2,890 XP' },
  { initials: 'SR', name: 'Sofia R.',  xp: '2,610 XP' },
]

// ─── Post component ───────────────────────────────────────
function PostCard({
  post,
  onLike,
  onReply,
  onLikeReply,
}: {
  post: Post
  onLike: (id: string) => void
  onReply: (postId: string, content: string) => void
  onLikeReply: (postId: string, replyId: string) => void
}) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function submitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(post.id, replyText.trim())
    setReplyText('')
    setShowReplyForm(false)
    setShowReplies(true)
  }

  function openReply() {
    setShowReplies(true)
    setShowReplyForm(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <article className="card-premium p-4 lg:p-5">
      <div className="flex items-start gap-3 lg:gap-3.5">
        <div
          className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-xs lg:text-sm font-black text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
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
              <Hash className="w-2.5 h-2.5" />{post.channel}
            </span>
            {post.isWin && (
              <span
                className="text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full text-emerald-400"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
              >
                <Star className="w-2.5 h-2.5" /> Win
              </span>
            )}
            <time className="text-xs text-gray-700 ml-auto">{post.time}</time>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5 text-xs transition-colors group/heart"
              style={{ color: post.likedByMe ? '#F87171' : '#6B7280' }}
            >
              <Heart
                className="w-3.5 h-3.5 group-hover/heart:scale-125 transition-transform"
                style={{ fill: post.likedByMe ? '#F87171' : 'none' }}
              />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={openReply}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
            {post.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(v => !v)}
                className="flex items-center gap-1.5 text-xs text-[#60A5FA] hover:text-[#93C5FD] transition-colors ml-auto"
              >
                {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Replies section */}
          {showReplies && (
            <div className="mt-3 space-y-3 pl-3" style={{ borderLeft: '2px solid rgba(79,142,247,0.15)' }}>
              {post.replies.map(reply => (
                <div key={reply.id} className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                  >
                    {reply.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-xs">{reply.name}</span>
                      <time className="text-[10px] text-gray-700">{reply.time}</time>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{reply.content}</p>
                    <button
                      onClick={() => onLikeReply(post.id, reply.id)}
                      className="flex items-center gap-1 mt-1.5 text-[10px] transition-colors"
                      style={{ color: reply.likedByMe ? '#F87171' : '#6B7280' }}
                    >
                      <Heart
                        className="w-3 h-3"
                        style={{ fill: reply.likedByMe ? '#F87171' : 'none' }}
                      />
                      {reply.likes}
                    </button>
                  </div>
                </div>
              ))}

              {/* Reply form */}
              {showReplyForm && (
                <form onSubmit={submitReply} className="flex items-end gap-2 mt-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                  >
                    Y
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(e) }
                      }}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full bg-transparent text-xs text-white placeholder-gray-600 resize-none outline-none leading-relaxed rounded-xl px-3 py-2 pr-16"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div className="absolute right-1 bottom-1.5 flex gap-1">
                      <button
                        type="button"
                        onClick={() => { setShowReplyForm(false); setReplyText('') }}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold transition-all disabled:opacity-30"
                        style={{ background: 'rgba(79,142,247,0.2)', color: '#60A5FA', border: '1px solid rgba(79,142,247,0.3)' }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Main page ────────────────────────────────────────────
export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState('general')
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS)
  const [newPost, setNewPost] = useState('')

  // Load any saved posts from localStorage (user-added ones)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeless_community_posts')
      if (saved) {
        const extra: Post[] = JSON.parse(saved)
        setPosts([...SEED_POSTS, ...extra])
      }
    } catch {}
  }, [])

  function savePosts(updated: Post[]) {
    // Only persist user-added posts (not seed)
    const seedIds = new Set(SEED_POSTS.map(p => p.id))
    const userPosts = updated.filter(p => !seedIds.has(p.id))
    try { localStorage.setItem('timeless_community_posts', JSON.stringify(userPosts)) } catch {}
  }

  function handleLike(postId: string) {
    setPosts(prev => {
      const updated = prev.map(p => {
        if (p.id !== postId) return p
        return { ...p, likes: p.likedByMe ? p.likes - 1 : p.likes + 1, likedByMe: !p.likedByMe }
      })
      savePosts(updated)
      return updated
    })
  }

  function handleLikeReply(postId: string, replyId: string) {
    setPosts(prev => {
      const updated = prev.map(p => {
        if (p.id !== postId) return p
        return {
          ...p,
          replies: p.replies.map(r => {
            if (r.id !== replyId) return r
            return { ...r, likes: r.likedByMe ? r.likes - 1 : r.likes + 1, likedByMe: !r.likedByMe }
          }),
        }
      })
      savePosts(updated)
      return updated
    })
  }

  function handleReply(postId: string, content: string) {
    const newReply: Reply = {
      id: `r_${Date.now()}`,
      avatar: 'Y',
      name: 'You',
      content,
      time: 'Just now',
      likes: 0,
      likedByMe: false,
    }
    setPosts(prev => {
      const updated = prev.map(p =>
        p.id !== postId ? p : { ...p, replies: [...p.replies, newReply] }
      )
      savePosts(updated)
      return updated
    })
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!newPost.trim()) return
    const post: Post = {
      id: `user_${Date.now()}`,
      avatar: 'Y',
      name: 'You',
      role: 'Member',
      time: 'Just now',
      channel: activeChannel,
      content: newPost.trim(),
      likes: 0,
      likedByMe: false,
      isWin: false,
      replies: [],
    }
    setPosts(prev => {
      const updated = [post, ...prev]
      savePosts(updated)
      return updated
    })
    setNewPost('')
  }

  const visiblePosts = posts.filter(p => p.channel === activeChannel)

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex-1 flex min-w-0 overflow-hidden">

        {/* ── Channel sidebar (desktop) ── */}
        <nav
          className="hidden lg:flex w-52 flex-shrink-0 flex-col h-screen sticky top-0"
          style={{ background: '#050505', borderRight: '1px solid rgba(255,255,255,0.04)' }}
          aria-label="Community channels"
        >
          <div className="p-4 pt-5">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-1">
              Channels
            </div>
            <ul className="space-y-0.5">
              {CHANNELS.map(ch => {
                const count = posts.filter(p => p.channel === ch.id).length
                return (
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
                    >
                      <span className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate text-xs font-medium">{ch.label}</span>
                      </span>
                      <span
                        className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                        style={activeChannel === ch.id
                          ? { background: 'rgba(79,142,247,0.2)', color: '#4F8EF7' }
                          : { background: 'rgba(255,255,255,0.05)', color: '#6B7280' }}
                      >
                        {count > 9 ? '9+' : count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="px-4 pt-4 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-1">This Week</div>
            <ol className="space-y-2">
              {LEADERBOARD.map((member, i) => (
                <li key={member.name} className="flex items-center gap-2.5 px-1">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                    >
                      {member.initials}
                    </div>
                    <div className="absolute -top-1 -right-1 text-[9px] font-black" style={{ lineHeight: 1 }}>
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

          {/* Mobile channel tabs */}
          <div
            className="lg:hidden flex gap-2 overflow-x-auto px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: '#000' }}
          >
            {CHANNELS.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
                style={activeChannel === ch.id
                  ? { background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.25)', color: '#60A5FA' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6B7280' }
                }
              >
                <Hash className="w-3 h-3" />
                {ch.label}
              </button>
            ))}
          </div>

          {/* Top bar (desktop) */}
          <div
            className="hidden lg:flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}
          >
            <div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#4F8EF7]" />
                <h1 className="font-bold">{activeChannel}</h1>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">1,200+ members · {visiblePosts.length} posts</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-400"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              128 online
            </div>
          </div>

          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#4F8EF7]" />
              <h1 className="font-bold text-sm">{activeChannel}</h1>
            </div>
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
            >
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              128 online
            </div>
          </div>

          {/* Posts feed */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-3 pb-24 lg:pb-0">
            {visiblePosts.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No posts in #{activeChannel} yet. Be the first.</p>
              </div>
            ) : (
              visiblePosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onReply={handleReply}
                  onLikeReply={handleLikeReply}
                />
              ))
            )}
          </div>

          {/* Composer */}
          <div
            className="flex-shrink-0 p-3 lg:p-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#000', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
          >
            <div className="pb-16 lg:pb-0">
              <form onSubmit={handlePost} className="flex gap-2 lg:gap-3 items-end">
                <div
                  className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                >
                  Y
                </div>
                <div
                  className="flex-1 rounded-2xl px-3 lg:px-4 py-2.5 lg:py-3 transition-all"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <label htmlFor="post-input" className="sr-only">Post to #{activeChannel}</label>
                  <textarea
                    id="post-input"
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost(e) }
                    }}
                    placeholder={`Post to #${activeChannel}...`}
                    rows={2}
                    className="w-full bg-transparent text-sm text-white placeholder-gray-700 resize-none outline-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-700"># {activeChannel}</span>
                    <button
                      type="submit"
                      disabled={!newPost.trim()}
                      className="btn-premium flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-lg text-xs disabled:opacity-40"
                    >
                      <Send className="w-3 h-3" />
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
