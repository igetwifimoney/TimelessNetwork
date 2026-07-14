'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Download, Search, FileText, Video, Image, MessageSquare, ClipboardList, Zap, ChevronRight } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: 'doc' | 'template' | 'script' | 'checklist' | 'prompt' | 'video'
  format: string
  content: string // The actual text content to copy/download
}

const CATEGORIES = ['All', 'Hooks & Scripts', 'Templates', 'Research Tools', 'Checklists', 'Prompts', 'CapCut']

const RESOURCES: Resource[] = [
  // ── Hooks & Scripts
  {
    id: 'hooks-50',
    title: '50 Viral TikTok Hooks',
    description: 'Proven opening lines that stop the scroll. Copy-paste ready for any niche.',
    category: 'Hooks & Scripts',
    type: 'script',
    format: 'Text',
    content: `50 VIRAL TIKTOK HOOKS — Timeless Network

CURIOSITY HOOKS
1. "I can't believe this actually works..."
2. "Nobody is talking about this and I don't know why"
3. "Wait until you see what happens at the end"
4. "This changed everything for me"
5. "I wish I knew this sooner"
6. "POV: You just found the best product on TikTok Shop"
7. "The reason you're not making sales yet"
8. "I tested this so you don't have to"
9. "This might be controversial but..."
10. "Hot take: you're doing this wrong"

PROBLEM HOOKS
11. "If you struggle with [problem], watch this"
12. "Does anyone else deal with [problem]?"
13. "I finally fixed [problem] and here's how"
14. "The #1 mistake people make with [topic]"
15. "Stop doing this if you want [result]"

STORY HOOKS
16. "6 months ago I had nothing. Now I [result]"
17. "I tried [thing] for 30 days. Here's what happened"
18. "My honest review after [time period]"
19. "I spent $[amount] so you don't have to"
20. "This is the product that [changed my life / routine / morning]"

RESULT HOOKS
21. "This is how I made $[X] from one video"
22. "I went from [before] to [after] using this"
23. "The exact system I use to [result]"
24. "How I [achieved result] without [obstacle]"
25. "[X] days later — here's the update"

URGENCY/SCARCITY HOOKS
26. "This product is going viral and it's about to sell out"
27. "Grab this before the price goes up"
28. "I only have [X] left in my showcase"
29. "TikTok keeps removing this so watch now"
30. "This deal won't last — grab it quick"

ENGAGEMENT HOOKS
31. "Comment [word] and I'll send you [thing]"
32. "Tag someone who needs to see this"
33. "Save this — you'll need it later"
34. "Which one would you pick? Comment A or B"
35. "Tell me in the comments if this happened to you"

PRODUCT HOOKS
36. "Amazon vs TikTok Shop — which is actually cheaper?"
37. "I found a $[price] dupe for [expensive product]"
38. "TikTok made me buy it — was it worth it?"
39. "Rating every product I bought this month"
40. "Things that look cheap but are actually worth it"

EDUCATIONAL HOOKS
41. "3 things every TikTok Shop creator needs to know"
42. "Here's what the algorithm actually wants"
43. "Why your TikTok views dropped (and how to fix it)"
44. "The hook formula that got me [X] views"
45. "Watch this before you post another TikTok"

RELATABLE HOOKS
46. "Me before vs. after discovering TikTok Shop"
47. "The face I make when my video goes viral 😭"
48. "Real talk: here's what actually works"
49. "Nobody told me this when I started and I'm mad"
50. "If I had to start over, I'd do this differently"`
  },
  {
    id: 'cta-scripts',
    title: 'CTA Script Templates (20)',
    description: '20 proven call-to-action scripts ranked by conversion strength.',
    category: 'Hooks & Scripts',
    type: 'script',
    format: 'Text',
    content: `20 HIGH-CONVERTING CTA SCRIPTS — Timeless Network

DIRECT CTAs (Highest Conversion)
1. "Tap the yellow shopping bag in the bottom left — I linked it right there for you"
2. "The link is IN this video — yellow bag, bottom left corner. Takes 30 seconds"
3. "It's pinned in my TikTok Shop — tap my profile and you'll see it at the top"

URGENCY CTAs
4. "I only added [X] to my showcase — grab it before it's gone"
5. "This is selling fast — link is in the video before it sells out"
6. "Price fluctuates on this one — lock it in now while it's this low"

SOFT CTAs (For educational content)
7. "I'll link it below if you want to check the reviews yourself"
8. "You can see what it looks like in person — link below"
9. "Check the price for yourself — you'll be surprised. Link below"

SOCIAL PROOF CTAs
10. "Thousands have bought this through my page — link's still up"
11. "My followers have been loving this — link below to join them"
12. "The reviews on this are insane — see for yourself. Link below"

COMBO CTAs (Most Effective)
13. "Tap the yellow bag — I only added 10 so it might already be gone, but check"
14. "Link in bio AND in the video — two chances to grab it"
15. "Tap it real quick — it's like $[price] and free returns if you don't love it"

QUESTION CTAs
16. "Have you tried this yet? If not, link is below"
17. "What are you waiting for? The link is right there 👇"
18. "Seriously — why haven't you tried this yet? Link below"

LIVE CTAs
19. "It's pinned at the top of the screen right now — tap it"
20. "For anyone just joining — [product] is pinned above. Tap to grab it"`
  },
  {
    id: 'video-script',
    title: 'Product Video Script Template',
    description: 'Fill-in-the-blank script structure for any product video. Hook to CTA.',
    category: 'Hooks & Scripts',
    type: 'script',
    format: 'Text',
    content: `PRODUCT VIDEO SCRIPT TEMPLATE — Timeless Network

HOOK (0-3 seconds)
"[Attention-grabbing statement about the problem OR result]"

Examples:
• "I can't sleep and I tried everything until..."
• "This $[price] product completely changed my [routine/life/mornings]"
• "Does anyone else struggle with [problem]?"

PROBLEM (3-10 seconds)
"[Relatable pain point your audience experiences]"

Example:
"I've been dealing with [problem] for [time period] and nothing was working..."

INTRODUCTION (10-20 seconds)
"Then I found this [product name/category] on TikTok Shop and..."

DEMO/PROOF (20-40 seconds)
[Show the product working. Be specific about results]
"Look at the difference..." / "Watch what happens when..." / "After [X days/uses]..."

KEY BENEFITS (weave into demo)
• Benefit 1: "[Specific feature] means [specific outcome]"
• Benefit 2: "It's [price point] which is [less than/same as] [comparison]"
• Benefit 3: "[Free shipping / easy returns / comes with...]"

CTA (final 5 seconds)
"[Specific instruction to find the link] — thank me later 😂"

CAPTION FORMULA:
[Hook rephrased] + [Key benefit] + [CTA with location]
Example: "Found the best solution for [problem] 🙌 [Key benefit]. Shop linked in video & bio 👇"`
  },

  // ── Research Tools
  {
    id: 'product-research-sheet',
    title: 'Product Research Scoring Sheet',
    description: 'Score potential products across 8 factors to find winners objectively.',
    category: 'Research Tools',
    type: 'template',
    format: 'Text',
    content: `PRODUCT RESEARCH SCORING SHEET — Timeless Network

Rate each factor 1-5. Products scoring 30+ are worth testing.

PRODUCT: _______________________
DATE EVALUATED: _________________

SCORING CRITERIA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. COMMISSION RATE         [ /5]
   1 = Under 5%
   3 = 10-15%
   5 = 20%+
   Score: ___

2. PRICE POINT             [ /5]
   1 = Under $10 or over $100
   3 = $20-$40
   5 = $15-$50 (impulse buy range)
   Score: ___

3. VISUAL APPEAL           [ /5]
   1 = Boring/unclear
   3 = Decent visuals
   5 = Highly visual, dramatic results
   Score: ___

4. EXISTING PROOF          [ /5]
   1 = No viral videos exist
   3 = Some viral content
   5 = Multiple 1M+ view videos
   Score: ___

5. COMPETITION LEVEL       [ /5]
   1 = 1000+ creators promoting
   3 = 100-500 creators
   5 = Under 100 creators
   Score: ___

6. PROBLEM SOLVED          [ /5]
   1 = No clear problem
   3 = Solves a minor inconvenience
   5 = Solves a painful daily problem
   Score: ___

7. REPEAT PURCHASE         [ /5]
   1 = One-time purchase only
   3 = Could repurchase occasionally
   5 = Consumable/repurchased regularly
   Score: ___

8. CONTENT POTENTIAL       [ /5]
   1 = Hard to make content about
   3 = Can make a few video types
   5 = Endless content angles
   Score: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL SCORE: ___ / 40

SCORING KEY:
35-40: 🔥 Priority test immediately
28-34: ✅ Worth testing
20-27: ⚠️  Test only if low competition
Under 20: ❌ Skip this product

NOTES:
_________________________________
_________________________________`
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Analysis Template',
    description: 'Systematically reverse-engineer what\'s working for top creators in your niche.',
    category: 'Research Tools',
    type: 'template',
    format: 'Text',
    content: `COMPETITOR ANALYSIS TEMPLATE — Timeless Network

CREATOR HANDLE: @_________________
NICHE: ___________________________
FOLLOWER COUNT: __________________
DATE ANALYZED: ___________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT ANALYSIS (Top 5 Videos)

Video 1:
• Views: _______ | Likes: _______ | Comments: _______
• Hook (first 3 seconds): ________________________________
• Product/Topic: ________________________________________
• CTA used: _____________________________________________
• What made it work: ____________________________________

Video 2:
• Views: _______ | Likes: _______ | Comments: _______
• Hook: _________________________________________________
• Product/Topic: ________________________________________
• What made it work: ____________________________________

Video 3:
• Views: _______ | Likes: _______ | Comments: _______
• Hook: _________________________________________________
• Product/Topic: ________________________________________
• What made it work: ____________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATTERNS I NOTICED:
• Hook pattern: _________________________________________
• Content format: _______________________________________
• Posting frequency: ____________________________________
• Engagement style: _____________________________________

TOP PRODUCTS THEY PROMOTE:
1. _______________________ Commission: ____%
2. _______________________ Commission: ____%
3. _______________________ Commission: ____%

GAPS I CAN EXPLOIT:
• What they're NOT doing: _______________________________
• Audience complaints in comments: ______________________
• Angles they haven't covered: __________________________

MY DIFFERENTIATION:
How I'll do it differently/better: _______________________`
  },

  // ── Checklists
  {
    id: 'pre-post-checklist',
    title: 'Pre-Post Video Checklist',
    description: 'Run through this before hitting publish on every TikTok video.',
    category: 'Checklists',
    type: 'checklist',
    format: 'Text',
    content: `PRE-POST VIDEO CHECKLIST — Timeless Network

Run this before every upload. Takes 2 minutes. Worth thousands.

VIDEO QUALITY
☐ Hook lands in first 2-3 seconds (no slow intros)
☐ Audio is clear — no background noise
☐ Lighting is good — face/product is visible
☐ No dead air or awkward pauses
☐ Video is under 60 seconds unless intentionally longer
☐ Captions/text overlays are readable
☐ Trending audio added (if applicable)

PRODUCT SETUP
☐ Product is linked in the video (pin it)
☐ Product is added to your Showcase
☐ Correct product variant is linked
☐ Commission rate confirmed before filming

CAPTION & HASHTAGS
☐ Caption starts with hook (not "hey guys")
☐ Primary keyword included naturally
☐ 3-5 relevant hashtags added
☐ CTA is in the caption
☐ Product link mentioned in caption

CTA CHECK
☐ Verbal CTA mentioned at least once (ideally 2-3 times)
☐ Specific instructions given ("tap the yellow bag")
☐ Urgency added if applicable

POSTING
☐ Posted during peak hours (7-9am, 12-1pm, or 7-10pm your audience's timezone)
☐ First comment pinned with CTA and link
☐ Replied to first 5-10 comments within 1 hour
☐ Posted to Instagram Reels within 24 hours
☐ Posted to YouTube Shorts within 24 hours`
  },
  {
    id: 'live-checklist',
    title: 'Pre-Live Stream Checklist',
    description: 'Everything to check before going live. Never forget anything again.',
    category: 'Checklists',
    type: 'checklist',
    format: 'Text',
    content: `PRE-LIVE STREAM CHECKLIST — Timeless Network

Run this 30 minutes before going live.

TECH SETUP
☐ Phone is charged or plugged in
☐ WiFi connection is stable (run a speed test)
☐ Ring light is on and positioned correctly
☐ Background is clean and branded
☐ Phone is mounted securely
☐ Do Not Disturb is ON
☐ Notifications silenced

TIKTOK SHOP SETUP
☐ Products are loaded in your showcase (updated today)
☐ Products are ready to pin during the live
☐ Confirmed commission rates on all products
☐ Test: tap each product to confirm the link works

PRODUCTS TO FEATURE (plan your order)
☐ Hero product: _________________________
☐ Supporting product 1: _________________
☐ Supporting product 2: _________________
☐ Supporting product 3: _________________
☐ Wild card: ___________________________

CONTENT PREP
☐ Opening hook planned (first 60 seconds)
☐ Key talking points written for each product
☐ Games/giveaways planned if using them
☐ Comeback planned if viewership drops

PERSONAL
☐ Water bottle filled and nearby
☐ Any props or products you're featuring are at hand
☐ You've eaten and feel energized
☐ Promote the live on your TikTok feed before starting

DURING LIVE — REMINDERS
• Read names every 2-3 minutes
• Pin product at the start, remind every 10 min
• React audibly to every purchase
• Keep talking — never go silent for more than 30 seconds`
  },
  {
    id: 'launch-checklist',
    title: 'New Account Launch Checklist',
    description: 'Everything to set up when starting a new TikTok Shop creator account from scratch.',
    category: 'Checklists',
    type: 'checklist',
    format: 'Text',
    content: `NEW ACCOUNT LAUNCH CHECKLIST — Timeless Network

Complete all of these before posting your first video.

ACCOUNT SETUP
☐ Created TikTok account with non-salesy username
☐ Display name reflects your niche/brand
☐ Profile photo uploaded (clear face or clean logo)
☐ Bio written (what you do + who you help + CTA)
☐ Link in bio pointing to TikTok Shop showcase

TIKTOK SHOP CREATOR
☐ Applied and approved for TikTok Shop for Creators
☐ Logged into Creator Studio at least once
☐ Connected payout method (bank account)
☐ Tax information submitted
☐ Browsed Product Marketplace in your niche

FIRST PRODUCTS
☐ Selected 5-10 products to start with (scored with research sheet)
☐ All 5-10 added to your Showcase
☐ Best product pinned to the top of Showcase
☐ Sample requests submitted for products that offer them

CONTENT PLAN
☐ Decided on your posting niche/angle
☐ Written 10 video ideas for the first week
☐ Written hooks for first 3 videos
☐ Downloaded CapCut and learned basic editing

FIRST WEEK GOALS
☐ Post 3-5 videos before judging results
☐ Reply to every single comment for first 2 weeks
☐ Follow 20 creators in your niche
☐ Complete TikTok Shop Foundation course on Timeless

YOU'RE READY. POST YOUR FIRST VIDEO TODAY.`
  },

  // ── Prompts
  {
    id: 'ai-hook-generator',
    title: 'AI Hook Generator Prompt',
    description: 'Paste this into ChatGPT or Claude to generate unlimited hooks for any product.',
    category: 'Prompts',
    type: 'prompt',
    format: 'Prompt',
    content: `AI HOOK GENERATOR PROMPT — Timeless Network

Copy this entire prompt and paste into ChatGPT or Claude. Fill in the brackets.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are a TikTok content strategist who specializes in creating viral hooks for TikTok Shop creators. Your hooks must stop people from scrolling within the first 2-3 seconds.

Generate 20 unique hooks for the following product:

PRODUCT: [Product name and what it does]
TARGET AUDIENCE: [Who you're selling to]
MAIN BENEFIT: [The #1 result the customer gets]
PRICE: [$XX]
NICHE: [Your content niche]

Create hooks in these categories:
• 5 curiosity hooks (make them wonder what happens)
• 5 problem hooks (address a pain point)
• 5 result hooks (lead with the outcome)
• 5 relatable hooks (make them feel seen)

Format: Just the hook text, numbered 1-20. No explanations.
Each hook must be under 15 words.
Make them conversational, not salesy.`
  },
  {
    id: 'ai-script-generator',
    title: 'AI Full Script Generator Prompt',
    description: 'Generate a complete, ready-to-film video script for any product in seconds.',
    category: 'Prompts',
    type: 'prompt',
    format: 'Prompt',
    content: `AI SCRIPT GENERATOR PROMPT — Timeless Network

Copy and fill in the brackets.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write a 45-60 second TikTok Shop video script for the following product. The script should be conversational, natural, and not sound like an ad.

PRODUCT: [Name and description]
PRICE: [$XX]
MAIN BENEFIT: [What it does for the customer]
MY PERSONALITY: [Funny / Informative / Excited / Relatable / Educational]
NICHE: [Your niche/category]

SCRIPT STRUCTURE:
1. Hook (0-3 sec): Attention-grabbing opener — no "hey guys"
2. Problem (3-10 sec): Relatable pain point
3. Product intro (10-20 sec): Natural introduction
4. Demo talking points (20-40 sec): 2-3 key benefits shown/mentioned
5. CTA (final 5 sec): Specific instruction to tap the link

Requirements:
• Written in first person
• No corporate language or buzzwords
• Include [SHOW PRODUCT] and [DEMO] markers where visuals go
• End with this exact CTA: "Tap the yellow bag in the bottom left — link's right there"
• Script should feel like a friend recommending something, not a sales pitch`
  },
  {
    id: 'ai-caption-generator',
    title: 'AI Caption Generator Prompt',
    description: 'Generate scroll-stopping captions with keywords, hashtags, and CTAs baked in.',
    category: 'Prompts',
    type: 'prompt',
    format: 'Prompt',
    content: `AI CAPTION GENERATOR PROMPT — Timeless Network

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write 5 different TikTok captions for a video about [PRODUCT].

Each caption should:
• Start with a hook (not "check out" or "hey guys")
• Include a natural mention of the product benefit
• Include a CTA directing to the link
• Be 2-4 sentences max
• Include 4-6 relevant hashtags at the end

Product: [Name]
Main benefit: [What it does]
Price: [$XX]
Target audience: [Who's watching]

Caption styles to write:
1. Curiosity-based
2. Problem/solution
3. Personal story angle
4. Social proof angle
5. Urgency/scarcity angle

Make the hashtags a mix of: 1-2 broad (#TikTokShop #TikTokMadeMeBuyIt), 2-3 niche-specific, 1 ultra-specific.`
  },

  // ── Templates
  {
    id: 'brand-outreach',
    title: 'Brand Outreach DM Template',
    description: 'Cold message templates for reaching out to brands for gifted collabs and paid partnerships.',
    category: 'Templates',
    type: 'template',
    format: 'Text',
    content: `BRAND OUTREACH TEMPLATES — Timeless Network

TEMPLATE 1 — Gifted Collab Request (under 10K followers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: Creator Collab — [Your Niche] Creator

Hi [Brand Name] team,

I'm a [niche] creator on TikTok (@[handle]) with [X] engaged followers. I came across your [product name] and genuinely love it — it's exactly what my audience has been asking about.

I'd love to create authentic content featuring your product. I specialize in [content style] and my audience has a [X]% engagement rate.

Would you be open to a gifted collab? I can offer:
• 1-2 dedicated TikTok videos
• Stories/reposts to my other platforms
• Full usage rights to the content

Let me know if this sounds interesting — happy to share more about my audience demographics.

Best,
[Your name]
@[handle]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMPLATE 2 — Paid Partnership Pitch (10K+ followers)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: Paid Partnership Opportunity — [X]K TikTok Audience

Hi [Brand],

I'm reaching out because [specific reason you chose this brand — mention their product specifically].

About my channel: [X]K followers | Avg [X]K views | [Niche] content | [Engagement rate]%

I've driven [X] sales for products in your category through TikTok Shop, with an average conversion rate of [X]%.

I'd love to explore a paid partnership for [product/campaign]. My rate for a dedicated video is $[rate], which includes:
• 1 main TikTok video (posted during peak hours)
• 30-day usage rights
• Monthly performance report

If this aligns with your Q[X] plans, I'd love to connect.

[Your name] | @[handle] | [email]`
  },
  {
    id: 'content-calendar',
    title: 'Weekly Content Calendar Template',
    description: 'Plan your full week of content in one sitting. Never wonder what to post again.',
    category: 'Templates',
    type: 'template',
    format: 'Text',
    content: `WEEKLY CONTENT CALENDAR — Timeless Network

Week of: ____________________
Weekly goal: ________________ (views / sales / followers)
Products featured this week: ________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONDAY — Product Research Day
Content slot 1:
• Format: [ ] Video  [ ] Slideshow  [ ] Live
• Topic/Product: _________________________________
• Hook: _________________________________________
• Scheduled time: ________________________________

Content slot 2:
• Format: [ ] Video  [ ] Slideshow
• Topic/Product: _________________________________
• Hook: _________________________________________
• Scheduled time: ________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TUESDAY — Script & Plan
Content slot 1: ________________________________
Content slot 2: ________________________________
Scripts to write today: _________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WEDNESDAY — Film Day
Videos to film: ________________________________
Slideshows to create: __________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THURSDAY — Upload Day
Videos uploading: _____________________________
Target posting times: __________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRIDAY — Analyze
Top video this week: ___________________________
Top earning product: ___________________________
What to replicate: _____________________________
What to drop: _________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SATURDAY — Live Stream
Product lineup: ________________________________
Target revenue: ________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WEEKLY STATS TRACKER
Total videos posted: ___
Total views: ___________
Total sales: ___________
Commission earned: _____
New followers: _________`
  },
]

const TYPE_ICON: Record<string, React.ReactNode> = {
  doc:       <FileText className="w-4 h-4" />,
  template:  <ClipboardList className="w-4 h-4" />,
  script:    <MessageSquare className="w-4 h-4" />,
  checklist: <ClipboardList className="w-4 h-4" />,
  prompt:    <Zap className="w-4 h-4" />,
  video:     <Video className="w-4 h-4" />,
}

const TYPE_COLOR: Record<string, string> = {
  doc:       'text-blue-400',
  template:  'text-purple-400',
  script:    'text-emerald-400',
  checklist: 'text-orange-400',
  prompt:    'text-yellow-400',
  video:     'text-red-400',
}

function copyToClipboard(text: string, cb: () => void) {
  navigator.clipboard.writeText(text).then(cb)
}

function downloadTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.txt`; a.click()
  URL.revokeObjectURL(url)
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = RESOURCES.filter(r => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleCopy = (r: Resource) => {
    copyToClipboard(r.content, () => {
      setCopied(r.id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0" id="main-content">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6 lg:py-8">

          <header className="mb-8">
            <h1 className="text-3xl font-black mb-1">Resources Library</h1>
            <p className="text-gray-500 text-sm">Scripts, templates, prompts, checklists — everything you need, organized and ready to use.</p>
          </header>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-white/[0.03] border border-white/[0.06] text-white placeholder-gray-600 outline-none focus:border-[#a855f7]/40 transition-colors"
              aria-label="Search resources"
            />
          </div>

          {/* Category filter */}
          <nav className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Resource categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
                style={activeCategory === cat
                  ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6B7280' }
                }
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Resource grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <article key={r.id} className="card-premium p-5 flex flex-col gap-3 group">
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${TYPE_COLOR[r.type]}`}>
                    <span aria-hidden="true">{TYPE_ICON[r.type]}</span>
                    {r.format}
                  </div>
                  <span className="text-[10px] text-gray-600 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {r.category}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-sm mb-1">{r.title}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                </div>

                <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <button
                    onClick={() => handleCopy(r)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={copied === r.id
                      ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }
                      : { background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', color: '#c084fc' }
                    }
                    aria-label={`Copy ${r.title} to clipboard`}
                  >
                    {copied === r.id ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => downloadTxt(r.content, r.title)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6B7280' }}
                    aria-label={`Download ${r.title}`}
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No resources match your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
