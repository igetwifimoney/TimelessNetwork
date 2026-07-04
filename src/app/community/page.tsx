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
    id: 'g1', avatar: 'TB', name: 'Ty - igetwifimoney', role: 'Founder', time: '3m ago',
    channel: 'general', isWin: false, likes: 184, likedByMe: false,
    content: 'Welcome to the Timeless community. This is your home base. Ask questions, share wins, help each other out. The people in this room are building real businesses — treat it like a mastermind, not a comment section.',
    replies: [
      { id: 'g1r1', avatar: 'ZM', name: 'Zara M.', content: 'Been here 3 weeks and already made my first sale. The energy in this community is different. Thank you Ty.', time: '2m ago', likes: 41, likedByMe: false },
    ],
  },
  {
    id: 'g2', avatar: 'DH', name: 'Darius H.', role: 'Elite Member', time: '11m ago',
    channel: 'general', isWin: false, likes: 27, likedByMe: false,
    content: 'TikTok just pushed another algorithm update. Short-form under 30 seconds is getting way more reach than longer vids right now. If your content is 60+ seconds, test cutting it down and see what happens.',
    replies: [
      { id: 'g2r1', avatar: 'PK', name: 'Priya K.', content: 'Tested this last week. 28-second version of my video got 3x the views of the original 55-second cut.', time: '8m ago', likes: 19, likedByMe: false },
      { id: 'g2r2', avatar: 'CW', name: 'Cameron W.', content: 'Makes sense. TikTok rewards completion rate and short vids are easier to watch twice.', time: '4m ago', likes: 11, likedByMe: false },
    ],
  },
  {
    id: 'g3', avatar: 'ET', name: 'Elise T.', role: 'Member', time: '42m ago',
    channel: 'general', isWin: false, likes: 9, likedByMe: false,
    content: 'Just did the onboarding quiz and the roadmap it gave me actually makes sense for where I am. Week 1, let\'s go. Gonna post updates here every Sunday.',
    replies: [],
  },
  {
    id: 'g4', avatar: 'NB', name: 'Noah B.', role: 'Gold Member', time: '1h ago',
    channel: 'general', isWin: false, likes: 34, likedByMe: false,
    content: 'Reminder for anyone feeling stuck: the goal isn\'t to go viral. The goal is to find one product that converts, then post about it until it does. Virality is a bonus. Consistency is the strategy.',
    replies: [
      { id: 'g4r1', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'Pin this. Honestly the most common mistake I see. Everyone chasing views instead of conversions.', time: '50m ago', likes: 62, likedByMe: false },
    ],
  },

  // wins
  {
    id: 'w1', avatar: 'JR', name: 'Jasmine R.', role: 'Gold Member', time: '6m ago',
    channel: 'wins', isWin: true, likes: 113, likedByMe: false,
    content: 'First $10k month hit 🎉 I almost quit at week 4 because nothing was converting. Week 5 I switched products and something clicked. $0 to $10,200 in 7 weeks total. The foundation course product research section literally saved me.',
    replies: [
      { id: 'w1r1', avatar: 'DH', name: 'Darius H.', content: 'JASMINE!! This is massive. What niche if you don\'t mind sharing?', time: '4m ago', likes: 28, likedByMe: false },
      { id: 'w1r2', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'Week 4 is where most people quit. You didn\'t. That\'s everything. So proud of you.', time: '2m ago', likes: 55, likedByMe: false },
    ],
  },
  {
    id: 'w2', avatar: 'MC', name: 'Malik C.', role: 'Elite Member', time: '58m ago',
    channel: 'wins', isWin: true, likes: 97, likedByMe: false,
    content: '60 day update 📍 Posted every single day. No days off. Revenue went from $0 to $9,400/mo. The algorithm started rewarding me around day 22. If you\'re in the first 3 weeks and nothing\'s happening — that\'s normal. Keep going.',
    replies: [
      { id: 'w2r1', avatar: 'ET', name: 'Elise T.', content: 'I\'m on day 9. Needed to see this so bad right now. Saving this post.', time: '45m ago', likes: 21, likedByMe: false },
      { id: 'w2r2', avatar: 'ZM', name: 'Zara M.', content: 'Day 22 is real. I noticed a shift at exactly that point too. Hang in there everyone.', time: '30m ago', likes: 17, likedByMe: false },
    ],
  },
  {
    id: 'w3', avatar: 'TV', name: 'Taylor V.', role: 'Member', time: '2h ago',
    channel: 'wins', isWin: true, likes: 71, likedByMe: false,
    content: 'First video to crack 1M views 🔥 It was my 34th video. Simple talking-head demo, natural lighting, no fancy editing. The hook from lesson 2 of the viral content module. Just goes to show — volume + basics beats production value every time.',
    replies: [
      { id: 'w3r1', avatar: 'MC', name: 'Malik C.', content: '1M!! What hook did you open with? Lesson 2 has a few frameworks.', time: '1h ago', likes: 12, likedByMe: false },
      { id: 'w3r2', avatar: 'NB', name: 'Noah B.', content: 'This is the post right here. 34 videos in before the big one. Consistency wins.', time: '45m ago', likes: 33, likedByMe: false },
    ],
  },

  // product-research
  {
    id: 'pr1', avatar: 'DF', name: 'Destiny F.', role: 'Member', time: '25m ago',
    channel: 'product-research', isWin: false, likes: 38, likedByMe: false,
    content: 'Tested the pet niche for 2 weeks. Engagement is insane but conversions are mid. Anyone with experience here — is it an audience intent problem or a product selection problem?',
    replies: [
      { id: 'pr1r1', avatar: 'DH', name: 'Darius H.', content: 'Pet niche engagement is emotional not purchase-intent. You need products that solve a visible problem — leash pullers, anxiety wraps, dental stuff. Cute products get likes, problem-solving products get sales.', time: '18m ago', likes: 44, likedByMe: false },
      { id: 'pr1r2', avatar: 'MC', name: 'Malik C.', content: 'Price point matters a lot too. $20-35 range converts way better in pet than anything over $50.', time: '10m ago', likes: 16, likedByMe: false },
    ],
  },
  {
    id: 'pr2', avatar: 'KS', name: 'Kwame S.', role: 'Gold Member', time: '3h ago',
    channel: 'product-research', isWin: false, likes: 58, likedByMe: false,
    content: 'My product vetting checklist before I touch anything:\n\n✅ 500+ orders on TikTok Shop already\n✅ At least 4.2 star rating\n✅ Margin >40% after shipping\n✅ Can demo the result in under 10 seconds\n✅ Solves a problem I can show on camera\n\nIf it doesn\'t clear all 5, I skip it. Period.',
    replies: [
      { id: 'pr2r1', avatar: 'DF', name: 'Destiny F.', content: 'The "demo in under 10 seconds" one is huge. I never thought about it that way.', time: '2h ago', likes: 22, likedByMe: false },
      { id: 'pr2r2', avatar: 'PK', name: 'Priya K.', content: 'Bookmarked. This is going in my product research doc right now.', time: '1h ago', likes: 19, likedByMe: false },
    ],
  },
  {
    id: 'pr3', avatar: 'BL', name: 'Bianca L.', role: 'Member', time: '5h ago',
    channel: 'product-research', isWin: false, likes: 22, likedByMe: false,
    content: 'Question: do you guys research products by scrolling TikTok organically or do you use tools like Kalodata/Shoplus? Trying to figure out the best workflow.',
    replies: [
      { id: 'pr3r1', avatar: 'KS', name: 'Kwame S.', content: 'Both. Organic scroll catches what\'s trending now. Tools give you order data you can\'t see natively. Start organic, graduate to tools once you have consistent income.', time: '4h ago', likes: 31, likedByMe: false },
    ],
  },

  // content-tips
  {
    id: 'ct1', avatar: 'PK', name: 'Priya K.', role: 'Gold Member', time: '17m ago',
    channel: 'content-tips', isWin: false, likes: 79, likedByMe: false,
    content: 'Posting time data after 90 videos:\n\n📈 Best: Tuesday–Thursday 7–9pm EST\n📈 Surprise winner: Sunday 6pm EST\n📉 Worst: Monday mornings, Saturday afternoon\n\nThis is MY data on MY account. Test your own. But if you haven\'t tested posting times yet, start here.',
    replies: [
      { id: 'ct1r1', avatar: 'TN', name: 'Troy N.', content: 'Sunday 6pm is real. Consistent for me too. People are bored and doom-scrolling before the week starts.', time: '12m ago', likes: 28, likedByMe: false },
      { id: 'ct1r2', avatar: 'JR', name: 'Jasmine R.', content: 'The Monday morning thing is real too. Always tanks for me.', time: '8m ago', likes: 14, likedByMe: false },
    ],
  },
  {
    id: 'ct2', avatar: 'TN', name: 'Troy N.', role: 'Elite Member', time: '1h ago',
    channel: 'content-tips', isWin: false, likes: 64, likedByMe: false,
    content: 'The hooks that are printing right now:\n\n"I spent $200 testing this so you don\'t have to"\n"This is why [product] is always sold out"\n"POV: you finally tried [product]"\n\nKey is making the viewer feel like they\'re missing out on something real, not something you\'re selling.',
    replies: [
      { id: 'ct2r1', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'The FOMO hook is underrated. Especially "always sold out" — that one triggers both curiosity and social proof at the same time.', time: '48m ago', likes: 41, likedByMe: false },
    ],
  },
  {
    id: 'ct3', avatar: 'SA', name: 'Simone A.', role: 'Member', time: '4h ago',
    channel: 'content-tips', isWin: false, likes: 35, likedByMe: false,
    content: 'Hot take: stop trying to make content look professional. The more "filmed on my kitchen counter" your video looks, the more it blends with organic content and the less it gets flagged as an ad. Polish can actually hurt you.',
    replies: [
      { id: 'ct3r1', avatar: 'MC', name: 'Malik C.', content: 'Data backs this up. My highest converting video was filmed vertically on my kitchen table with a ring light. My most "professional" video flopped.', time: '3h ago', likes: 47, likedByMe: false },
    ],
  },

  // tiktok-shop
  {
    id: 'ts1', avatar: 'CW', name: 'Cameron W.', role: 'Elite Member', time: '9m ago',
    channel: 'tiktok-shop', isWin: false, likes: 46, likedByMe: false,
    content: 'Starting tip nobody told me: before spending hours making content, request the product sample and TEST IT. I wasted 3 weeks on a product that fell apart after a week. Real review > fake enthusiasm every time, and TikTok Shop reviews tank your commission if returns spike.',
    replies: [
      { id: 'ts1r1', avatar: 'BL', name: 'Bianca L.', content: 'This is so important. I had a similar situation with a skincare product. Broke me out, caused returns, commission dropped. Not worth it.', time: '5m ago', likes: 18, likedByMe: false },
    ],
  },
  {
    id: 'ts2', avatar: 'ZM', name: 'Zara M.', role: 'Gold Member', time: '2h ago',
    channel: 'tiktok-shop', isWin: false, likes: 33, likedByMe: false,
    content: 'Commission rate thread — what\'s everyone getting?\n\nBeauty: 12-18%\nHome goods: 10-15%\nFitness: 8-12%\nElectronics: 5-8%\n\nIf you\'re getting less than these ranges, email the brand directly and ask. Most will bump you after consistent sales.',
    replies: [
      { id: 'ts2r1', avatar: 'KS', name: 'Kwame S.', content: 'Got bumped from 12% to 20% on a beauty brand by DMing the seller after I sent them 40 orders in a month. They\'ll negotiate.', time: '1h ago', likes: 29, likedByMe: false },
      { id: 'ts2r2', avatar: 'DH', name: 'Darius H.', content: 'The direct DM approach is slept on. Most TikTok Shop sellers are small businesses and they actually respond.', time: '45m ago', likes: 21, likedByMe: false },
    ],
  },
  {
    id: 'ts3', avatar: 'SA', name: 'Simone A.', role: 'Member', time: '4h ago',
    channel: 'tiktok-shop', isWin: false, likes: 16, likedByMe: false,
    content: 'Beginner question — how many products should I be running at once when starting out? I\'ve heard everything from 1 to 10.',
    replies: [
      { id: 'ts3r1', avatar: 'TB', name: 'Ty - igetwifimoney', content: 'One. Always one to start. You need to understand why something converts before you scale. Two products means split attention and half the data. Find one winner first.', time: '3h ago', likes: 51, likedByMe: false },
    ],
  },

  // accountability
  {
    id: 'ac1', avatar: 'MC', name: 'Malik C.', role: 'Elite Member', time: '30m ago',
    channel: 'accountability', isWin: true, likes: 102, likedByMe: false,
    content: 'Day 60 official ✅\n\nPosted 60 days straight. Zero days missed.\n\nRevenue this month: $9,400\nVideos posted: 60\nBest video: 840K views\n\nThe people who said "take rest days" were wrong. Momentum is fragile. Protect it.',
    replies: [
      { id: 'ac1r1', avatar: 'ET', name: 'Elise T.', content: 'I\'m on day 9 and this is exactly what I needed to see. Not stopping.', time: '22m ago', likes: 24, likedByMe: false },
      { id: 'ac1r2', avatar: 'DF', name: 'Destiny F.', content: 'Day 17 checking in. $580 so far this month. Small but I see it building.', time: '15m ago', likes: 16, likedByMe: false },
    ],
  },
  {
    id: 'ac2', avatar: 'PK', name: 'Priya K.', role: 'Gold Member', time: '2h ago',
    channel: 'accountability', isWin: false, likes: 29, likedByMe: false,
    content: 'Weekly check-in 📊\n\nVideos: 7/7 ✅\nBest video: 320K views\nSales this week: $1,140\nKey win: finally figured out why my CTAs weren\'t working (I was waiting too long in the video to mention the link)\n\nWho else is checking in?',
    replies: [
      { id: 'ac2r1', avatar: 'TN', name: 'Troy N.', content: '$1,140 in a week is real money. Don\'t sleep on that number. That\'s $4k+ a month pace.', time: '1h ago', likes: 18, likedByMe: false },
    ],
  },
  {
    id: 'ac3', avatar: 'BL', name: 'Bianca L.', role: 'Member', time: '5h ago',
    channel: 'accountability', isWin: false, likes: 18, likedByMe: false,
    content: 'Day 1. Starting today. Goal is 5 videos a week for the next 12 weeks. Posting this publicly so I can\'t back out. Someone check on me.',
    replies: [
      { id: 'ac3r1', avatar: 'MC', name: 'Malik C.', content: 'Locked in. Come back on day 30. We\'re watching 👀', time: '4h ago', likes: 22, likedByMe: false },
      { id: 'ac3r2', avatar: 'JR', name: 'Jasmine R.', content: 'I did exactly this 8 weeks ago. Best decision I ever made. You\'ve got this.', time: '3h ago', likes: 14, likedByMe: false },
    ],
  },
]

// ─── Live activity pool (rotates in automatically) ────────
const LIVE_POOL: Omit<Post, 'id'>[] = [
  { avatar: 'TN', name: 'Troy N.', role: 'Elite Member', time: 'just now', channel: 'wins', isWin: true, likes: 0, likedByMe: false, content: 'Just hit $4,200 in a single day for the first time 🔥 Product went semi-viral. Proving to myself this is real.', replies: [] },
  { avatar: 'SA', name: 'Simone A.', role: 'Member', time: 'just now', channel: 'general', isWin: false, likes: 0, likedByMe: false, content: 'Made my first sale!! It was $18 but I literally screamed. This is real, this works. Keep going everyone.', replies: [] },
  { avatar: 'KS', name: 'Kwame S.', role: 'Gold Member', time: 'just now', channel: 'content-tips', isWin: false, likes: 0, likedByMe: false, content: 'Quick reminder: batch your content. I film 7 videos every Sunday. Saves me from the "I don\'t feel like filming" trap during the week.', replies: [] },
  { avatar: 'DF', name: 'Destiny F.', role: 'Member', time: 'just now', channel: 'accountability', isWin: false, likes: 0, likedByMe: false, content: 'Day 21 check-in ✅ Revenue this week: $390. Slow but stacking. Not stopping.', replies: [] },
  { avatar: 'CW', name: 'Cameron W.', role: 'Elite Member', time: 'just now', channel: 'product-research', isWin: false, likes: 0, likedByMe: false, content: 'Niche that\'s slept on right now: posture and back pain products. Huge search volume, high purchase intent, easy to demo on camera.', replies: [] },
  { avatar: 'ZM', name: 'Zara M.', role: 'Gold Member', time: 'just now', channel: 'tiktok-shop', isWin: false, likes: 0, likedByMe: false, content: 'Pro tip: always disclose your affiliate link upfront. Not just for compliance — it actually increases trust and conversions in my experience.', replies: [] },
  { avatar: 'NB', name: 'Noah B.', role: 'Gold Member', time: 'just now', channel: 'wins', isWin: true, likes: 0, likedByMe: false, content: 'Week 8 total: $11,800. I keep this number in my phone lock screen so I never forget why I started.', replies: [] },
  { avatar: 'ET', name: 'Elise T.', role: 'Member', time: 'just now', channel: 'general', isWin: false, likes: 0, likedByMe: false, content: 'The community calls alone are worth the membership. Got a product idea validated in 5 minutes that I\'d been sitting on for 2 weeks.', replies: [] },
  { avatar: 'JR', name: 'Jasmine R.', role: 'Gold Member', time: 'just now', channel: 'content-tips', isWin: false, likes: 0, likedByMe: false, content: 'If your hook isn\'t written before you press record, you\'re wasting time. Script the first 3 seconds. The rest can be natural.', replies: [] },
  { avatar: 'DH', name: 'Darius H.', role: 'Elite Member', time: 'just now', channel: 'tiktok-shop', isWin: false, likes: 0, likedByMe: false, content: 'Heads up: TikTok Shop is expanding to more markets this quarter. If you\'re not already thinking about international products, start now.', replies: [] },
  { avatar: 'MC', name: 'Malik C.', role: 'Elite Member', time: 'just now', channel: 'accountability', isWin: false, likes: 0, likedByMe: false, content: 'If you posted today, drop a ✅ below. Let\'s see who\'s actually showing up.', replies: [] },
  { avatar: 'BL', name: 'Bianca L.', role: 'Member', time: 'just now', channel: 'product-research', isWin: false, likes: 0, likedByMe: false, content: 'Found a product with 2,000+ orders this week, 4.8 stars, and I can get it for $4 landed. Currently selling for $29. Running the demo tomorrow.', replies: [] },
]

const LEADERBOARD = [
  { initials: 'MC', name: 'Malik C.',   xp: '4,120 XP' },
  { initials: 'JR', name: 'Jasmine R.', xp: '3,740 XP' },
  { initials: 'TN', name: 'Troy N.',    xp: '3,290 XP' },
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

  // Live activity simulator — drops a new post every 35–65 seconds
  useEffect(() => {
    let poolIndex = Math.floor(Math.random() * LIVE_POOL.length)

    function dropPost() {
      const template = LIVE_POOL[poolIndex % LIVE_POOL.length]
      poolIndex++
      const newLivePost: Post = {
        ...template,
        id: `live_${Date.now()}`,
        time: 'just now',
        likes: Math.floor(Math.random() * 8),
      }
      setPosts(prev => [newLivePost, ...prev])
    }

    function scheduleNext() {
      const delay = 35000 + Math.random() * 30000 // 35–65 seconds
      return setTimeout(() => {
        dropPost()
        timerRef.current = scheduleNext()
      }, delay)
    }

    const timerRef = { current: scheduleNext() }
    return () => clearTimeout(timerRef.current)
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
