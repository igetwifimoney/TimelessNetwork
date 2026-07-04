export interface Lesson {
  slug: string
  title: string
  duration: string
  xp: number
  videoUrl?: string // YouTube embed ID or direct URL — fill in later
  content: string  // Rich text content (supports markdown-style)
}

export interface Course {
  slug: string
  title: string
  description: string
  category: 'ttshop' | 'tiktok' | 'youtube'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  totalLessons: number
  totalXP: number
  badge: string
  lessons: Lesson[]
}

export const COURSES: Course[] = [

  // ══════════════════════════════════════════════════════════
  // TIKTOK SHOP COURSES
  // ══════════════════════════════════════════════════════════

  {
    slug: 'ttshop-foundation',
    title: 'TikTok Shop Foundation',
    description: 'Everything you need to start selling on TikTok Shop — from setting up your account to mastering the Creator Studio.',
    category: 'ttshop',
    level: 'Beginner',
    totalLessons: 5,
    totalXP: 250,
    badge: '🛒',
    lessons: [
      {
        slug: 'account-setup',
        title: 'Setting Up Your TikTok Account for Sales',
        duration: '12 min',
        xp: 50,
        content: `## Setting Up Your TikTok Account for Sales

Your TikTok profile is the first impression viewers get — make it count.

### Step 1: Create a Non-Salesy Username

First impressions matter. Your username shouldn't scream "seller."

**❌ Avoid:** Anything too commercial — "Best_Seller_123" or "DiscountsNow"

**✅ Instead:** Go for something personal, memorable, or creative — a fun alias or brand name that fits your vibe.

**Examples:**
- JohnsGreatFinds
- TheCoolShopper
- GadgetGuru

> **Tip:** Your username is what people search for, so make it memorable but approachable.

### Step 2: Profile Name vs. Username

Your TikTok profile has both a **username** (@handle) and a **display name**.

- **Username:** The handle people use to find you (e.g., @JohnsGreatFinds)
- **Display Name:** What appears above your video captions on the For You Page — this is what viewers see first

> **Pro Tip:** Choose a display name that reflects your personality or the theme of your account. Keep it fun but professional.

### Step 3: Write a Magnetic Bio

Your bio needs to communicate value in 2–3 lines:
1. What you do ("I find the best products on TikTok Shop so you don't have to")
2. Why follow you ("New finds weekly")
3. A CTA ("Shop my favorites 👇")

### Step 4: Profile Picture

Use a clear, high-quality photo — either your face or a clean brand logo. Accounts with faces tend to get more trust and engagement.`
      },
      {
        slug: 'creator-studio',
        title: 'Navigating TikTok Shop Creator Studio',
        duration: '15 min',
        xp: 50,
        content: `## Navigating TikTok Shop Creator Studio

Creator Studio is your command center for managing products, tracking earnings, and optimizing performance.

### Step 1: Accessing TikTok Creator Studio

1. Go to your **profile page**
2. Tap the **three lines** in the top right corner (the "waffle")
3. Select **TikTok Shop for Creators** from the menu

### Step 2: Overview of the Dashboard

Once inside Creator Studio, you'll see:

- **📊 Performance Data** — A quick view of your video and product performance
- **🛍️ Product Marketplace** — All products available for you to promote
- **🛒 Manage Showcase** — The products pinned to your profile
- **💰 Earnings** — Your commissions and sales data

### Step 3: Exploring the Product Marketplace

1. Tap **Product Marketplace**
2. Browse products and filter by category, commission rate, or trending status
3. Choose products that **match your niche** and **fit your audience's interests**

> **🔑 Key Tip:** Stick to products you genuinely believe in. Your audience will trust you more when you promote things that align with your content.

### Step 4: Manage Your Showcase

Your Showcase is visible on your profile — anyone who visits can browse your pinned products.

- Update it frequently with fresh, trending items
- Keep it under 10–15 items so it doesn't feel overwhelming
- Always put your best-converting products at the top`
      },
      {
        slug: 'mastering-sales',
        title: 'Mastering the Art of Selling on TikTok',
        duration: '18 min',
        xp: 50,
        content: `## Mastering the Art of Selling on TikTok

TikTok selling is all about **authenticity** and **relatability**. Your audience doesn't want to feel like they're watching an ad — they want recommendations from a real person they can trust.

### Step 1: Don't Sound Like a Salesperson

**❌ Avoid:** Hard selling or sounding pushy.
"This is the best melatonin, buy it now!" — won't work.

**✅ Instead:** Be authentic and personal.
"Hey everyone, does anyone else struggle with sleep, or is it just me? I found this melatonin on TikTok Shop, and the first night I tried it, I was out like a light in 10 minutes."

> **📝 Pro Tip:** People love stories. Focus on your personal experience with the product rather than a generic pitch.

### Step 2: Engage with Your Audience

- **💬 Ask questions** in your video: "Have you tried melatonin before? Let me know in the comments!"
- **💡 Use CTAs** to guide viewers: "Tap the link in the bottom left to check it out!"
- **⚡ Reply to comments** — this builds community and trust

### Step 3: The Hook Formula

The first 2–3 seconds of your video determine everything. Hook formats that work:

1. **Problem hook:** "I can't sleep and I tried everything until..."
2. **Curiosity hook:** "This $12 product changed my morning routine"
3. **Proof hook:** *shows result first, then explains*

### Step 4: Video Structure

1. **Hook** (0–3 sec) — Stop the scroll
2. **Problem** (3–8 sec) — Relate to the viewer
3. **Solution** (8–20 sec) — Introduce the product naturally
4. **Proof** (20–35 sec) — Show it working / results
5. **CTA** (final 5 sec) — Tell them exactly what to do`
      },
      {
        slug: 'content-creation',
        title: 'Content Creation for TikTok Shop',
        duration: '20 min',
        xp: 50,
        content: `## Content Creation for TikTok Shop

Content is king on TikTok. Here's how to create videos that not only grab attention but convert views into sales.

### Step 1: Visuals Are Everything

- Use **fast cuts** and **dynamic angles** to keep viewers hooked
- **Engaging captions** — add text overlays to your key points
- Good lighting makes a massive difference — natural light or a ring light works great
- Use **CapCut** to enhance your video quality and edits

### Step 2: Include a Clear Call-to-Action

Every video you create should have a CTA. Examples:

- "Tap the **link in the bottom left** of my video to check out the product!"
- "Tap the **shopping bag** in my profile to see more!"
- "Tag a friend who would love this!"

> **💡 Pro Tip:** Place your CTA at the END of the video — after the viewer is fully engaged.

### Step 3: Video Length Strategy

- **7–15 seconds** — highest completion rates, great for simple products
- **20–40 seconds** — good for demonstrating a product
- **60+ seconds** — deep dives, tutorials, review-style content

### Step 4: Batch Your Content

Instead of filming one video at a time, **batch 5–10 videos in one session**:
1. Film all your raw footage
2. Edit all videos in one sitting
3. Schedule them out over the week

This saves time and keeps you consistent without daily pressure.

### Step 5: Trending Audio

- Check the **Trending** tab for popular sounds
- Use trending audio to boost your chances of landing on the FYP
- Even a subtle trending sound in the background helps`
      },
      {
        slug: 'trust-credibility',
        title: 'Building Trust and Credibility',
        duration: '14 min',
        xp: 50,
        content: `## Building Trust and Credibility

People are more likely to buy from someone they **trust**. Here's how to build that trust with your audience.

### Step 1: Be Authentic

- Always be honest about your personal experience with the product
- If something didn't work perfectly for you, you can still explain how it could benefit others
- Never promote something you wouldn't use yourself

### Step 2: Show Proof

- **📦 Show unboxing videos** or demo the product in your content
- **Before/after results** if applicable
- **Screenshots of your earnings** (this builds massive credibility)
- Real reviews from your comment section

### Step 3: Consistency = Trust

Posting consistently signals that you're a real creator, not a one-off spammer:
- Aim for **3–5 posts per week** minimum
- Keep your content in the same niche
- Same energy, same style — people follow *you*, not just the product

### Step 4: Engage Like a Human

- Reply to every comment in your first hour of posting
- Pin a comment with your CTA
- Go live occasionally to interact in real-time
- Like and respond to DMs

### Step 5: Social Proof Snowball

Once you start getting sales and testimonials, feature them:
- Share screenshots of happy customers in your videos
- Show your commission dashboard (blur out sensitive info)
- This creates FOMO and confirms you're the real deal

🎉 **Congratulations on completing the TikTok Shop Foundation course!**`
      }
    ]
  },

  {
    slug: 'ttshop-slideshow',
    title: 'TikTok Shop Slideshow Course',
    description: 'The easiest way to make money on TikTok Shop — no face needed. Create engaging product slideshows that sell.',
    category: 'ttshop',
    level: 'Beginner',
    totalLessons: 4,
    totalXP: 200,
    badge: '🖼️',
    lessons: [
      {
        slug: 'slideshow-intro',
        title: 'Why Slideshows Work (And How to Start)',
        duration: '10 min',
        xp: 50,
        content: `## Why Slideshows Work (And How to Start)

Slideshows are the **easiest and most beginner-friendly** format for TikTok Shop. No camera. No face. No video editing skills required.

### What Is a TikTok Slideshow?

A TikTok slideshow is a series of images that play one after another — like a carousel on Instagram, but with audio and effects on TikTok.

### Why They Work

- **Low barrier to entry** — anyone can make one in 5 minutes
- **Product images are free** — pull them directly from TikTok Shop
- **High volume strategy** — post 10–15 slideshows per day for maximum reach
- **Passive income potential** — old slideshows keep getting views and sales

### Getting Started

1. Open TikTok → Tap the **+** button
2. Select **Upload** → Choose **Photos**
3. Pick 3–7 product images
4. Add a trending audio track
5. Write a compelling caption with your product link`
      },
      {
        slug: 'slideshow-design',
        title: 'Designing High-Converting Slideshows',
        duration: '15 min',
        xp: 50,
        content: `## Designing High-Converting Slideshows

A great slideshow isn't just pretty — it's **strategically designed to convert**.

### The Winning Slideshow Formula

**Slide 1 — The Hook**
This is your thumbnail. It needs to stop the scroll.
- Use the most visually striking product image
- Add bold text overlay: "This changed my life 😭" or "POV: You found the best product"

**Slides 2–4 — The Value**
- Show the product from multiple angles
- Add text explaining key benefits
- "Waterproof ✅ Lightweight ✅ Under $20 ✅"

**Slides 5–6 — Social Proof**
- Customer reviews
- Before/after if applicable
- Star ratings screenshot

**Final Slide — CTA**
- "Link in bio / bottom left to shop!"
- Keep it simple and direct

### Audio Strategy
- Use trending audio with 50K–500K videos (not over-saturated)
- Upbeat, positive sounds work best for product content`
      },
      {
        slug: 'slideshow-scaling',
        title: 'Scaling to 10+ Slideshows Per Day',
        duration: '18 min',
        xp: 50,
        content: `## Scaling to 10+ Slideshows Per Day

Volume is the key to slideshow success. Here's how to systematize your content creation.

### The Batch System

**Morning (30 min):**
1. Find 5–10 winning products in the Product Marketplace
2. Download all product images
3. Note down the key benefits for each

**Afternoon (60 min):**
1. Create all slideshows in one sitting
2. Use a template so each one only takes 5–7 minutes
3. Schedule them throughout the day

**Tools to speed up:**
- **CapCut** — batch templates
- **Google Photos** — store product image libraries
- **TikTok Scheduler** — post at peak times without being online

### Finding Winning Products

Look for:
- Products with **high commission rates (15%+)**
- Products with **existing viral videos** (search the product and sort by likes)
- Price point of **$15–$50** (best impulse-buy range)
- Items that **solve a clear problem**`
      },
      {
        slug: 'slideshow-analytics',
        title: 'Reading Your Analytics and Optimizing',
        duration: '12 min',
        xp: 50,
        content: `## Reading Your Analytics and Optimizing

The creators who scale are the ones who let data guide their decisions.

### Key Metrics to Track

**In TikTok Analytics:**
- **Views** — How many people saw it
- **Completion rate** — What % watched to the end (aim for 60%+)
- **Click-through rate** — How many tapped the product link
- **Conversion rate** — How many actually bought

**In Creator Studio:**
- **GMV (Gross Merchandise Value)** — Total sales you generated
- **Commission earned** — Your actual earnings
- **Top-performing products** — Double down on these

### The Optimization Loop

Every week:
1. Identify your **top 3 performing slideshows**
2. Note what they have in common (product type, hook, audio)
3. Create 10 more slideshows following the same pattern
4. Kill what's not working — don't waste time on dead content

> **The rule:** If a slideshow gets under 500 views in 48 hours, move on. If it hits 5K+, recreate it 5 different ways immediately.`
      }
    ]
  },

  {
    slug: 'ttshop-video',
    title: 'TikTok Shop Video Course',
    description: 'Create product videos that balance creativity with results. The middle ground between slideshows and live streaming.',
    category: 'ttshop',
    level: 'Intermediate',
    totalLessons: 5,
    totalXP: 250,
    badge: '🎬',
    lessons: [
      {
        slug: 'video-fundamentals',
        title: 'Product Video Fundamentals',
        duration: '16 min',
        xp: 50,
        content: `## Product Video Fundamentals

Product videos earn more than slideshows but require more effort. The payoff is worth it.

### Why Videos Outperform Slideshows

- Higher engagement signals to the algorithm
- More opportunities to build connection with your audience
- Better conversion — people see the product *in action*
- Higher commission potential per video

### The 3 Types of Product Videos

**1. Unboxing/Review**
Film yourself receiving and opening the product. Raw and authentic. Works great for beauty, tech, and lifestyle products.

**2. Demo/Tutorial**
Show the product being used. "Watch me use this in my morning routine." Best for gadgets, skincare, kitchen tools.

**3. Problem/Solution**
Start with the pain point, introduce the product as the solution. Highest conversion rate of all formats.

### Equipment You Need (Budget Setup)

- Your phone (any modern iPhone or Android)
- Natural window light OR a $20 ring light
- A simple tripod or phone stand
- CapCut for editing (free)

That's it. Don't overcomplicate it.`
      },
      {
        slug: 'video-scripting',
        title: 'Scripting Videos That Convert',
        duration: '20 min',
        xp: 50,
        content: `## Scripting Videos That Convert

Great videos don't happen by accident. They follow a proven structure.

### The AIDA Framework for TikTok

**A — Attention (0–3 seconds)**
Your hook must stop someone mid-scroll. Options:
- Visual shock: Show the before/after immediately
- Bold statement: "I made $4,000 last month doing this"
- Question: "Why is nobody talking about this product?"

**I — Interest (3–12 seconds)**
Keep them watching by delivering on the hook's promise.
- Show the product
- Explain what it does in plain language
- Relate it to a problem your audience has

**D — Desire (12–25 seconds)**
Make them WANT it.
- Share your personal experience
- Show results / proof
- Give specific details (price, how long it lasts, etc.)

**A — Action (final 5 seconds)**
One clear CTA — don't give multiple options.
- "Tap the link in the bottom left"
- "Check my bio"
- "It's linked in my TikTok Shop"

### Script Template

*Hook:* "I can't believe I found this for under $20—"
*Problem:* "I've been struggling with [X] for years"
*Solution:* "Then I found this [product] on TikTok Shop"
*Proof:* *show demo* "Look at the difference"
*CTA:* "It's linked below — grab it before it sells out"`
      },
      {
        slug: 'video-filming',
        title: 'Filming Like a Pro on Your Phone',
        duration: '18 min',
        xp: 50,
        content: `## Filming Like a Pro on Your Phone

You don't need expensive gear. You need good technique.

### Lighting (Most Important Factor)

**Natural light:** Position yourself facing a window. This is free and often the best option.

**Ring light:** Place it directly in front of you at eye level. $20–$40 on Amazon.

**Avoid:** Overhead lighting (harsh shadows), filming with a window behind you (silhouette effect).

### Camera Settings

- **Film in 4K** if your phone supports it
- **Lock focus and exposure** — tap and hold the subject on your screen
- **Keep your phone horizontal** for some content, vertical for all TikTok-first content
- **Stabilize** — use a tripod or lean against a wall

### B-Roll and Cutaways

Don't just film yourself talking. Alternate between:
- Close-ups of the product
- You using the product
- The product on its own
- Text overlays explaining features

### Editing in CapCut

1. Import your clips in order
2. Trim aggressively — cut any dead air
3. Add captions (Auto-caption feature is 🔥)
4. Add your hook text in the first 2 seconds
5. Color grade — slightly saturated and bright performs best
6. Export in 1080p minimum`
      },
      {
        slug: 'video-niches',
        title: 'Best Niches for Product Videos',
        duration: '14 min',
        xp: 50,
        content: `## Best Niches for Product Videos

The right product in the right niche is 80% of the battle.

### Top Converting Niches on TikTok Shop

**Beauty & Skincare** 💄
Massive audience. High repeat purchases. Demo videos work extremely well.
Examples: serums, SPF, hair tools, lip products

**Kitchen & Home** 🏠
"TikTok made me buy it" energy. Gadgets and organizers go viral constantly.
Examples: air fryers, drawer organizers, reusable bags

**Tech Accessories** 📱
Always trending. Great for "you need this" content.
Examples: phone stands, chargers, LED lights, earbuds

**Fitness & Wellness** 💪
High-intent buyers. Before/after content kills it here.
Examples: resistance bands, supplements, massage guns

**Pet Products** 🐾
Insane engagement. Pet owners spend BIG.
Examples: toys, feeders, grooming tools

### How to Pick YOUR Niche

Ask yourself:
1. What do I already know about?
2. What could I talk about daily without getting bored?
3. What problems do I personally have that products could solve?

Authenticity within your niche = long-term success.`
      },
      {
        slug: 'video-monetization',
        title: 'Maximizing Your Earnings Per Video',
        duration: '16 min',
        xp: 50,
        content: `## Maximizing Your Earnings Per Video

Working smarter, not harder — here's how to squeeze maximum revenue out of each video.

### Commission Rate Strategy

Not all products pay the same. Always check:
- Base commission rate (look for 15%+)
- Sample availability (free products = zero cost content)
- Price point ($20–$60 converts best)
- Competition (fewer creators promoting = more sales for you)

### Stacking Multiple Products

In one video, you can feature 2–3 related products. Example: a skincare routine video that includes toner + serum + moisturizer — all linked.

This multiplies your earnings per video.

### Pinning and Linking

- Always pin the product in your video
- Add it to your Showcase before posting
- Include it in your bio link as well
- Post at peak times (7–9am, 12–1pm, 7–10pm in your target timezone)

### Repurposing

Every great video should become:
1. A TikTok video (primary)
2. An Instagram Reel (same video, repost)
3. A YouTube Short (same video, repost)

One video, three platforms, three streams of traffic — all linking to your TikTok Shop.`
      }
    ]
  },

  {
    slug: 'ttshop-live',
    title: 'TikTok Shop Live Stream Course',
    description: 'The highest earning TikTok Shop format. Learn to run live streams that convert viewers into buyers in real time.',
    category: 'ttshop',
    level: 'Advanced',
    totalLessons: 5,
    totalXP: 300,
    badge: '🔴',
    lessons: [
      {
        slug: 'live-setup',
        title: 'Setting Up Your Live Stream Studio',
        duration: '20 min',
        xp: 60,
        content: `## Setting Up Your Live Stream Studio

Live streaming is the highest-earning format on TikTok Shop. Top creators make $10,000+ per day. Here's how to set up properly.

### Minimum Setup (Start Here)

- **Phone** with good camera (iPhone or Samsung)
- **Ring light** or window light
- **Clean background** — solid wall, simple shelf, or branded backdrop
- **Stable phone mount** or tripod
- **Stable WiFi** — Ethernet via adapter is ideal

### Upgrade Path

When you start earning:
- Add a second light for even, flattering lighting
- Use a capture card + DSLR for higher quality
- Add a microphone for clearer audio
- Set up a dedicated streaming space

### TikTok Live Requirements

To go live on TikTok Shop:
1. You need **1,000+ followers**
2. Your account must be in good standing
3. Apply for TikTok Shop for Creators if you haven't

### Pre-Live Checklist

☐ Products are loaded in your showcase
☐ Products are pinned and ready to feature
☐ Ring light is on
☐ WiFi is stable
☐ Phone is charged or plugged in
☐ Water bottle nearby (you'll talk a LOT)
☐ Notes for products you're featuring today`
      },
      {
        slug: 'live-structure',
        title: 'Structuring a High-Converting Live',
        duration: '25 min',
        xp: 60,
        content: `## Structuring a High-Converting Live

Winging it on live doesn't work. The top earners follow a proven structure.

### The Live Blueprint

**Phase 1: Warm-Up (0–10 minutes)**
Don't start selling immediately. Build your audience first.
- Welcome viewers as they join: "Hey [name], glad you're here!"
- Ask easy questions: "Where are you tuning in from?"
- Tease what's coming: "I'm showing something INSANE in about 10 minutes"

**Phase 2: First Feature (10–20 minutes)**
Start with your BEST product.
- Introduce it naturally: "Okay guys, I've been obsessed with this"
- Demo it live on stream
- Pin it to the stream
- Create urgency: "I only have 3 left in my showcase"

**Phase 3: Mid-Show Drops (20–50 minutes)**
Rotate products every 10 minutes.
- Return to top performers
- Re-engage new viewers who just joined
- Read out purchases: "Sarah just bought this — congrats!"

**Phase 4: Power Hour (final 10 minutes)**
Create maximum urgency.
- Feature your top 2–3 products again
- Flash deals if possible
- "Last chance before I go off"

### The Golden Rule: Always Be Engaging

If you go quiet for more than 30 seconds, you lose viewers. Always be talking — ask questions, read names, react to comments.`
      },
      {
        slug: 'live-engagement',
        title: 'Keeping Viewers Hooked During Lives',
        duration: '18 min',
        xp: 60,
        content: `## Keeping Viewers Hooked During Lives

The longer viewers stay, the more TikTok promotes your live — and the more you sell.

### Engagement Tactics That Work

**Read names constantly**
"Hey Mike, welcome! Staying for the whole show?"
People love being acknowledged. It keeps them watching.

**Run games and giveaways**
"First person to share this live gets a prize!"
"Comment your favorite emoji for a chance to win!"

**Ask opinion questions about products**
"Would you guys rock this in black or beige? Comment your vote!"

**React to purchases**
"YOOO Sarah just grabbed the organizer! You're going to love it!"
This creates social proof in real-time and encourages others to buy.

**Create recurring moments**
- Have a "Product of the Hour"
- Do a countdown before featuring something new
- Have a "hidden deal" that you reveal mid-stream

### Handling Dead Moments

If viewership drops:
1. Start a new product feature
2. Ask a polarizing question: "Hot take: this is better than [competitor product] — agree or disagree?"
3. Tease something coming up: "In 5 minutes I'm showing something that's going to blow your mind"`
      },
      {
        slug: 'live-products',
        title: 'Choosing Products for Live Streams',
        duration: '15 min',
        xp: 60,
        content: `## Choosing Products for Live Streams

The right product selection is the difference between a $200 live and a $2,000 live.

### Products That Crush on Lives

**High visual impact** — things that look impressive on camera
- Beauty tools (hair straighteners, gua sha)
- Kitchen gadgets in action
- Cleaning products with dramatic before/afters

**Impulse price points** — $15–$45
Too cheap feels low quality. Too expensive needs too much deliberation.

**Limited availability** — real or perceived scarcity drives urgency
"I only added 20 to my showcase for tonight's live"

**Easy to demo** — you should be able to show it working in 60 seconds

### Building Your Live Product List

For each live, prepare:
- 1 "hero" product (your best performer — lead with this)
- 3–5 "supporting" products (rotate throughout)
- 1 "wild card" (something new you're testing)

### Ordering Strategy

Open with your best product → build trust → introduce new products → return to top performers in the final 10 minutes for last-chance purchases.`
      },
      {
        slug: 'live-earnings',
        title: 'Scaling Your Live Stream Earnings',
        duration: '20 min',
        xp: 60,
        content: `## Scaling Your Live Stream Earnings

Once you have the basics down, here's how to 10x your results.

### Consistency Is Everything

TikTok rewards creators who go live consistently. Aim for:
- **5–7 times per week** at minimum
- **2–4 hours per live** for maximum earnings
- **Same time daily** so your audience knows when to tune in

### Growing Your Live Audience

- Post 2–3 videos per day promoting your upcoming live: "Going live tonight at 7pm 🔴"
- Go live right after posting a video that goes viral — your momentum carries over
- Collaborate with other creators who go live (trade shoutouts)

### The $10K Day Blueprint

Top earners hitting $10K+ in one live do these things:
1. 5K+ concurrent viewers minimum
2. High-ticket products ($50–$200) in the mix
3. Flash sales: "Next 5 minutes only — 20% off"
4. Massive engagement to keep TikTok boosting the live
5. Regular posting so their audience is primed and ready

### Track Your Numbers

After each live, note:
- Peak concurrent viewers
- Total GMV (gross merchandise value)
- Commission earned
- Top product
- What you'd do differently

Treat it like a business — because it is one. 🚀`
      }
    ]
  },

  {
    slug: 'ttshop-cta',
    title: 'TikTok Shop CTA Mastery',
    description: 'The calls-to-action that actually convert. Learn exactly what to say (and when) to turn viewers into buyers.',
    category: 'ttshop',
    level: 'Beginner',
    totalLessons: 4,
    totalXP: 200,
    badge: '🎯',
    lessons: [
      {
        slug: 'cta-psychology',
        title: 'The Psychology Behind CTAs That Convert',
        duration: '12 min',
        xp: 50,
        content: `## The Psychology Behind CTAs That Convert

Most creators lose sales because their CTA is either missing, weak, or poorly timed. Let's fix that.

### Why CTAs Are Non-Negotiable

Without a CTA, viewers watch your video and do nothing. A strong CTA removes friction and tells the viewer exactly what to do next.

### The 3 Principles of High-Converting CTAs

**1. Specificity**
Vague: "Check it out!"
Specific: "Tap the yellow shopping bag icon in the bottom left corner of this video"

The more specific you are, the higher the conversion. Many viewers literally don't know where to click — tell them exactly.

**2. Urgency**
"Check it out whenever" = low urgency
"It's selling fast and I only added 10 to my showcase" = urgency

Real urgency (limited stock) or implied urgency ("trend-based" products) both work.

**3. Benefit-Forward**
Don't just say what to do — say why.
"Tap the link and finally get the sleep you've been missing" > "Tap the link to buy"

### Timing Your CTA

- **Early mention** (15–20 seconds in): Plant the seed
- **Mid-video** (around the demo): Reinforce as you show the product
- **Final CTA** (last 3–5 seconds): Hard close — one clear action`
      },
      {
        slug: 'cta-scripts',
        title: '20 High-Converting CTA Scripts',
        duration: '15 min',
        xp: 50,
        content: `## 20 High-Converting CTA Scripts

Copy these word-for-word or adapt them to your style.

### Standard Product CTAs
1. "Tap the yellow bag icon at the bottom of this video — I linked it right there for you"
2. "It's in my TikTok Shop showcase — tap my profile and you'll see it"
3. "Link's in my bio — takes 30 seconds to order"
4. "I linked this directly in the video — bottom left, yellow shopping bag"
5. "Go to my profile and tap the shopping bag at the top — it's right there"

### Urgency CTAs
6. "I only added 15 to my showcase — grab it before it's gone"
7. "This is selling out everywhere — got mine just in time"
8. "TikTok keeps making this go viral so stock moves fast"
9. "Prices on this fluctuate — lock it in now while it's this low"

### Curiosity / Soft CTAs
10. "I'll link it below if you want to check the reviews yourself"
11. "You can see what it looks like in person on the product page — link below"
12. "Check the price — you'll be shocked at how affordable it is. Link below."

### Social Proof CTAs
13. "Thousands of people have bought this through my page — link's still up"
14. "My followers have been loving this — link below to join them"

### Question-Based CTAs
15. "Have you tried this yet? If not, the link is below"
16. "What are you waiting for? The link is right there 👇"

### Combo CTAs (Most Effective)
17. "Tap the yellow bag — I only added 10 so it might already be gone, but check"
18. "Link in bio and in the video — two chances to grab it before it sells out"
19. "Tap it real quick — it's like $18 and free returns if you don't love it"
20. "Bottom left corner — tap it and thank me later 😂"`
      },
      {
        slug: 'cta-placement',
        title: 'When and Where to Place Your CTAs',
        duration: '10 min',
        xp: 50,
        content: `## When and Where to Place Your CTAs

Timing and placement are just as important as the words you use.

### In Your Videos

**Text overlay CTAs:**
Add text on screen pointing to the shopping bag: "↙️ Linked below" or "TAP THE BAG ↙️"

**Verbal CTAs:**
- Don't wait until the end — mention the link 2–3 times throughout
- Your first verbal CTA should come by the 15-second mark

**Caption CTAs:**
Your video caption should always end with a CTA:
"This changed my mornings 🙌 Shop linked in video & bio 👇"

### In Your Bio

Your bio should have ONE clear CTA:
"🛒 Shop my TikTok Shop ↓"

Don't clutter it with multiple links.

### In Lives

During live streams, verbally reference the pinned product constantly:
"For anyone just joining — I'm featuring [product], it's pinned right at the top of the screen"

Repeat your CTA every 5–10 minutes because new viewers keep joining throughout the stream.

### In Comments

Pin your own comment on every video:
"🔗 Link to the [product] is in the video and my bio! Free returns if you don't love it 💙"`
      },
      {
        slug: 'cta-testing',
        title: 'A/B Testing Your CTAs',
        duration: '12 min',
        xp: 50,
        content: `## A/B Testing Your CTAs

The creators who dominate TikTok Shop are constantly testing. Here's how to run simple experiments.

### What to Test

**CTA Wording:**
Post the same video twice (different days) with different CTAs in the caption.
Version A: "Link in bio 👇"
Version B: "Tap the yellow bag below — I linked it directly ↙️"

Check which gets more clicks/sales.

**CTA Timing:**
Test early CTA (within 10 seconds) vs. late CTA (final 5 seconds).

**Urgency Level:**
Test soft ("linked below") vs. hard urgency ("only 5 left in my showcase").

### How to Track Results

In TikTok Creator Studio:
- Video click rate (how many tapped the product link)
- GMV per video
- Conversion rate

Look for patterns after testing 10+ videos in each variation.

### The 80/20 Rule

Once you find a CTA formula that works, use it 80% of the time. Reserve 20% for testing new variations.

Don't fix what isn't broken — but never stop optimizing.`
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  // TIKTOK GROWTH COURSES
  // ══════════════════════════════════════════════════════════

  {
    slug: 'tiktok-algorithm',
    title: 'TikTok Algorithm Decoded',
    description: 'Understand exactly how the TikTok algorithm works and engineer your content to go viral consistently.',
    category: 'tiktok',
    level: 'Beginner',
    totalLessons: 4,
    totalXP: 200,
    badge: '⚡',
    lessons: [
      {
        slug: 'how-algorithm-works',
        title: 'How the TikTok Algorithm Actually Works',
        duration: '18 min',
        xp: 50,
        content: `## How the TikTok Algorithm Actually Works

The TikTok algorithm isn't mysterious — it follows patterns you can reverse-engineer.

### The Core Signals TikTok Measures

**1. Completion Rate (Most Important)**
What percentage of people watch your video to the end?
- Under 50%: TikTok stops pushing the video
- 70%+: TikTok considers it high quality and pushes it further
- 100%+ (rewatches): Viral territory

This is why your hook matters more than anything else.

**2. Engagement Rate**
Likes, comments, shares, and saves — in that order of importance.
Shares are the most powerful signal. When someone shares your video, TikTok sees it as highly valuable content.

**3. Video Information**
- Sounds used (trending vs. original)
- Hashtags
- Captions
- Text overlays

**4. Device & Account Settings**
- Language preference
- Location
- Device type

### How Videos Get Distributed

TikTok shows your video to a small test batch first (100–500 accounts). If those viewers engage well, it expands to a larger batch. This keeps expanding until engagement drops below a threshold.

Your job: **make the first batch love it** — the algorithm handles the rest.`
      },
      {
        slug: 'algorithm-signals',
        title: 'Engineering Engagement Signals',
        duration: '20 min',
        xp: 50,
        content: `## Engineering Engagement Signals

You can design your videos specifically to trigger positive algorithm signals.

### Boosting Completion Rate

**Start with your best frame:**
The algorithm evaluates early completion — if people click away in 2 seconds, it's over. Never start with slow intros, logos, or "hey guys."

**Create a loop:**
End your video in a way that makes viewers want to watch again. "Watch until the end" type content. The algorithm counts re-watches.

**Interrupt pattern:**
Use a sudden audio cut, zoom, or text reveal mid-video to re-engage anyone who's about to scroll away.

### Boosting Comments

Ask a direct question at the end of your video:
- "Which color would you pick — comment below!"
- "Drop a 🔥 if you'd buy this"
- "Tell me your experience with this in the comments"

Comments also keep your video in front of viewers longer (they come back to check replies).

### Boosting Shares

Create "send this to a friend" content:
- Relatable humor
- Genuinely useful information
- Surprising product reveals

Shares are TikTok's strongest signal. One viral share cascade can take a video from 5K to 5M views.

### Boosting Saves

Create "reference content" people want to come back to:
- "Save this for when you need it"
- Tutorials
- Product lists
- Tips and strategies`
      },
      {
        slug: 'algorithm-timing',
        title: 'Timing, Frequency, and Posting Strategy',
        duration: '14 min',
        xp: 50,
        content: `## Timing, Frequency, and Posting Strategy

When and how often you post matters — here's the data-backed approach.

### Best Times to Post

Analyze when YOUR audience is most active in TikTok Analytics → Followers tab. General benchmarks:

- **7–9 AM** — Morning scroll
- **12–1 PM** — Lunch break
- **7–10 PM** — Peak evening hours

Post at these times consistently for 2 weeks and compare performance.

### Posting Frequency

**Minimum:** 1 video per day
**Optimal for growth:** 3–5 videos per day
**Slideshow strategy:** 10–15 posts per day (lower effort per post)

TikTok rewards active accounts. The more you post, the more shots you have at a viral hit — and the more data you give TikTok about your content.

### Account Warmup

If your account is new:
- Week 1: Post 1–2 videos per day, focus on niche content
- Week 2: Increase to 3–4 per day
- Week 3+: Full throttle

Don't post 20 videos on Day 1 — ease in to establish your content identity.

### Consistency > Perfection

It's better to post an average video today than to spend 3 days editing a perfect one. Volume and consistency beat perfection on TikTok.`
      },
      {
        slug: 'algorithm-hashtags',
        title: 'Hashtags, Audio, and Discoverability',
        duration: '12 min',
        xp: 50,
        content: `## Hashtags, Audio, and Discoverability

These aren't the primary growth drivers — but they help TikTok categorize your content correctly.

### Hashtag Strategy

**Avoid:** Using 20 random hashtags
**Use:** 3–5 targeted hashtags that describe exactly what your content is about

Mix of:
- 1–2 broad hashtags (high volume): #TikTokShop, #TikTokMadeMeBuyIt
- 1–2 niche hashtags (medium volume): #SkincareTikTok, #HomeOrganization
- 1 tiny hashtag (low competition): your niche-specific sub-category

### Audio Strategy

Trending audio gives your video an automatic boost in the discovery system.

**How to find trending audio:**
1. Go to the Discover tab
2. Tap "Trending" → "Sounds"
3. Choose sounds with 50K–500K videos (sweet spot — trending but not oversaturated)

**Original audio:**
If your own audio goes viral, all videos using your sound link back to you.

### Caption SEO

TikTok now indexes captions for search. Write captions that include natural keyword phrases:
- "The best TikTok Shop product for small apartments"
- "How I made my first TikTok Shop sale"

Think of your caption as a mini-SEO description for your video.`
      }
    ]
  },

  {
    slug: 'tiktok-engagement',
    title: 'TikTok Engagement Mastery',
    description: 'Build a loyal, engaged community that buys from you again and again.',
    category: 'tiktok',
    level: 'Intermediate',
    totalLessons: 4,
    totalXP: 200,
    badge: '💬',
    lessons: [
      {
        slug: 'engagement-fundamentals',
        title: 'Why Engagement Beats Follower Count',
        duration: '14 min',
        xp: 50,
        content: `## Why Engagement Beats Follower Count

1,000 engaged followers who trust you > 100,000 passive followers who don't.

### The Engagement Rate Formula

Engagement Rate = (Likes + Comments + Shares) / Views × 100

A healthy TikTok engagement rate is **5–10%**. Top performers hit 15–20%+.

### Why Engaged Audiences Buy

An engaged follower:
- Watches your videos to completion (boosts algorithm)
- Comments and shares (expands reach)
- Trusts your recommendations (buys what you promote)
- Comes back repeatedly (long-term revenue)

A passive follower does none of the above.

### Signals That Your Account Is Healthy

- Comments ratio is high relative to views
- People are tagging friends in your comments
- You're getting DMs asking about products
- Your profile visits-to-follow ratio is strong

If you're not seeing these, your content isn't connecting — time to adjust your approach.`
      },
      {
        slug: 'engagement-tactics',
        title: 'Daily Engagement Tactics That Build Community',
        duration: '18 min',
        xp: 50,
        content: `## Daily Engagement Tactics That Build Community

Engagement is not a once-in-a-while activity. It's a daily practice.

### The First Hour Rule

When you post a video, spend the first 60 minutes:
- Replying to every comment
- Liking comments from engaged viewers
- Responding to DMs about the video

TikTok's algorithm monitors creator activity after posting. Active engagement in the first hour signals that the content is worth promoting.

### Comment Reply Strategy

**Good comment reply (weak):** "Thank you! 😊"

**Good comment reply (strong):** "Yes! The [product] honestly exceeded my expectations. Did you end up trying it? Let me know what you thought!"

Longer, conversational replies keep people in your comment section longer and build real relationships.

### Creating Comment-Bait Content

Every video should have a reason to comment:
- End with a direct question
- Create a debate: "Hot take: [product A] is better than [product B] — discuss"
- Use incomplete sentences that beg for a response: "The one thing I wish someone told me when I started was..."
- Pin a funny or engaging comment to invite pile-on responses`
      },
      {
        slug: 'engagement-community',
        title: 'Building a Community, Not Just an Audience',
        duration: '16 min',
        xp: 50,
        content: `## Building a Community, Not Just an Audience

An audience watches. A community participates. Here's how to build the latter.

### Give Your Followers an Identity

Name your community. When people have an identity, they're more loyal.
- "You're all part of the [Your Brand] fam"
- Reference them consistently: "To my [fam name]..."

### Create Inside Jokes and Recurring Content

Running jokes and recurring formats build familiarity:
- "Monday product finds"
- A signature sign-off phrase
- A recurring character or bit

When viewers recognize a pattern, they come back expecting it.

### Feature Your Community

- Share user-generated content (people using products you recommended)
- Read comments on screen: "Someone asked me..."
- Reply to comments with a video — creates reciprocity

### Discord / Community Groups

Point your most engaged viewers to a private community (like this Discord). This filters for your most loyal fans and creates a tight-knit group that becomes your inner circle and best customers.`
      },
      {
        slug: 'engagement-retention',
        title: 'Retaining Followers Through Content Strategy',
        duration: '12 min',
        xp: 50,
        content: `## Retaining Followers Through Content Strategy

Getting followers is one thing. Keeping them is another.

### The Content Mix

Don't just post promotions. Vary your content:
- 60% entertaining/educational (no selling)
- 30% soft promotion (product mention, not hard sell)
- 10% direct promotion (hard CTA, link below)

This ratio keeps your audience engaged without burning them out on sales content.

### Consistent Personality

People follow *you*, not your products. Let your personality shine:
- Be consistently funny, informative, or inspiring
- Your energy on camera should be the same across all videos
- Don't be a different person based on the product you're promoting

### Managing Unfollows

It's normal to lose followers when you:
- Post inconsistently
- Change content style dramatically
- Go too heavy on promotional content

Monitor your follower growth chart weekly. Sharp drops = something changed that your audience didn't like.

### The Reactivation Strategy

If engagement drops:
1. Post a "back to basics" video in your core niche
2. Ask your audience directly: "What content do you want more of?"
3. Run a giveaway to re-engage dormant followers`
      }
    ]
  },

  {
    slug: 'tiktok-niche',
    title: 'Finding Your Perfect TikTok Niche',
    description: 'Choose the right niche once and win. Learn how to identify a profitable, sustainable niche you can own.',
    category: 'tiktok',
    level: 'Beginner',
    totalLessons: 4,
    totalXP: 200,
    badge: '🎯',
    lessons: [
      {
        slug: 'niche-selection',
        title: 'The Science of Niche Selection',
        duration: '16 min',
        xp: 50,
        content: `## The Science of Niche Selection

Your niche is the foundation of everything. Choose correctly and everything gets easier.

### The Niche Triangle

The perfect niche sits at the intersection of:
1. **What you know** (expertise or experience)
2. **What you enjoy** (sustainability — you'll be creating daily)
3. **What people buy** (profitable — products exist in this space)

If you pick a niche you hate, you'll burn out in 3 months. If you pick a niche with no products, you can't monetize. The overlap is your sweet spot.

### High-Profit Niches on TikTok Shop

- Beauty & skincare
- Tech accessories
- Home organization & decor
- Kitchen gadgets
- Pet products
- Fitness & wellness
- Baby & parenting products
- Cleaning & household hacks

### Niche Depth vs. Breadth

**Broad niche:** "Lifestyle" — high competition, hard to stand out
**Narrow niche:** "Apartment organization for renters" — lower competition, loyal audience

Start narrow and expand once you've built authority.`
      },
      {
        slug: 'niche-validation',
        title: 'Validating Your Niche Before You Commit',
        duration: '14 min',
        xp: 50,
        content: `## Validating Your Niche Before You Commit

Don't spend months building in a niche that won't work. Validate first.

### The 5-Point Validation Checklist

**1. Are there products available in TikTok Shop for this niche?**
Search your niche in the Product Marketplace. If there are 50+ products, it's monetizable.

**2. Are other creators in this niche making money?**
Search TikTok for creators in your niche. Look at their TikTok Shop showcase. Are they active and posting frequently? Good sign.

**3. Is the audience buying?**
Look at product review counts in TikTok Shop. High reviews = high sales volume.

**4. Is there room for you?**
Is the niche oversaturated? Can you bring a unique angle, personality, or sub-niche?

**5. Can you create consistent content here?**
Think of 50 video ideas right now. If you can't, the niche is too narrow or you don't know it well enough.

### Quick Validation Method

Post 5 videos in your potential niche this week. Don't commit fully — just test. Which videos perform best? Let the data tell you if the niche has an audience.`
      },
      {
        slug: 'niche-positioning',
        title: 'Positioning Yourself Within Your Niche',
        duration: '15 min',
        xp: 50,
        content: `## Positioning Yourself Within Your Niche

Two creators can be in the same niche and serve completely different audiences. Positioning is how you differentiate.

### Positioning Angles

**The Expert:** "I've been in skincare for 10 years — here's what actually works"
**The Beginner:** "I know nothing about skincare — let's figure this out together"
**The Budget Hunter:** "I find the best products under $20"
**The Luxury Reviewer:** "Testing the most popular high-end products — are they worth it?"
**The Skeptic:** "I try every viral product so you don't have to"

Each of these serves a different audience segment — even in the same niche.

### Your Unique Value Proposition

Complete this sentence:
"I help [audience] get [result] without [pain point]"

Example: "I help busy moms find the best TikTok Shop products without spending hours scrolling."

This becomes the core of your bio, content strategy, and messaging.

### Owning Your Angle

Pick one positioning angle and commit. Be so consistently that angle that when someone thinks of it, they think of you.

Consistency in positioning = authority. Authority = trust. Trust = sales.`
      },
      {
        slug: 'niche-pivoting',
        title: 'When and How to Pivot Your Niche',
        duration: '12 min',
        xp: 50,
        content: `## When and How to Pivot Your Niche

Sometimes the niche you chose isn't working. Here's how to know and what to do.

### Signs Your Niche Isn't Working

- You've posted 30+ videos and still under 1,000 views average
- You hate creating the content
- There aren't enough products to promote
- Comments show your audience isn't the buyer demographic

### When NOT to Pivot

Don't pivot after 2 weeks because results are slow. Give a niche at least 60–90 days and 50+ videos before concluding it doesn't work.

Many creators abandon niches right before they were about to break through.

### How to Pivot Without Losing Everything

**The soft pivot:** Gradually shift content. If you started with general lifestyle, start leaning 70% into home organization. Your existing audience evolves with you.

**The fresh start:** Create a new account specifically for the new niche. Keep the old one for now, double down on the new direction.

**The sub-niche pivot:** Stay in your broad niche but drill down. "Home products" → "Small apartment hacks" — you keep your audience but get more specific.

### The Right Reason to Pivot

Pivot when the data clearly shows a sub-niche or angle outperforms everything else. Not because you're bored or impatient.`
      }
    ]
  },

  {
    slug: 'tiktok-crp',
    title: 'TikTok Creator Rewards Program',
    description: 'How to qualify for and maximize earnings from TikTok\'s Creator Rewards Program (CRP).',
    category: 'tiktok',
    level: 'Intermediate',
    totalLessons: 4,
    totalXP: 200,
    badge: '💰',
    lessons: [
      {
        slug: 'crp-overview',
        title: 'What Is the Creator Rewards Program',
        duration: '12 min',
        xp: 50,
        content: `## What Is the Creator Rewards Program

TikTok pays creators directly for views. The Creator Rewards Program (CRP) replaced the old Creator Fund and pays significantly more.

### CRP vs. Old Creator Fund

| | Creator Fund | Creator Rewards Program |
|---|---|---|
| RPM | $0.02–$0.04 | $0.40–$1.00+ |
| Min. followers | 10K | 10K |
| Video length | Any | 1 minute+ |
| Availability | Being phased out | Current program |

The CRP can pay **20–50x more** than the old Creator Fund.

### How to Qualify

To be eligible for CRP:
- 10,000+ followers
- 100,000+ views in the last 30 days
- Account must be 18+ years old
- Located in an eligible country
- Post original content (not reposts)

### What You Earn

CRP pays based on:
- Total views
- Audience engagement
- Video quality score
- Originality score

Top creators earn $0.50–$1.50 per 1,000 views. A video with 1 million views = $500–$1,500 from CRP alone.`
      },
      {
        slug: 'crp-optimization',
        title: 'Optimizing Content for CRP Payouts',
        duration: '18 min',
        xp: 50,
        content: `## Optimizing Content for CRP Payouts

The CRP rewards specific types of content. Here's how to engineer your videos for maximum payouts.

### The 1-Minute Minimum

CRP only pays for videos 1 minute or longer. This changes your content strategy.

For TikTok Shop creators: blend your CRP strategy with your shop content — make longer, more detailed product reviews or educational videos that earn from both sources.

### What the Quality Score Measures

TikTok evaluates:
- **Originality** — is this truly new content, not a rip from another platform?
- **Completion rate** — are people watching to the end?
- **Search value** — does this answer a question people are searching for?
- **Engagement depth** — meaningful comments, not just emojis?

### CRP-Optimized Content Formats

**Long-form reviews (2–5 min):** Deep dive into one product. Covers all features, pros, cons, pricing comparison.

**Tutorial content:** "How to set up TikTok Shop" — searchable, educational, high completion rate.

**List videos:** "10 TikTok Shop products that actually changed my life" — people watch all the way through to see if their favorite made the list.

**Story content:** Share your journey — how you went from zero to [result]. Deeply personal, high shares.`
      },
      {
        slug: 'crp-rpm',
        title: 'Understanding RPM and Maximizing It',
        duration: '14 min',
        xp: 50,
        content: `## Understanding RPM and Maximizing It

RPM (Revenue Per Mille) = how much you earn per 1,000 views. Understanding this number is key to scaling.

### What Affects Your RPM

**Audience demographics:**
US/UK/CA/AU viewers have the highest advertiser value. If your audience is predominantly from lower-value markets, your RPM will be lower.

**Content category:**
Finance, business, and tech content tends to command higher RPMs than entertainment.

**Engagement quality:**
TikTok pays more for videos where viewers are genuinely engaged (comments, shares, long watch time) vs. passive views.

**Seasonality:**
RPMs are highest in Q4 (Oct–Dec) when advertisers spend more. Plan major content pushes around this period.

### How to Improve Your RPM

1. **Target US/UK audiences** — use US slang, reference US-relevant products, post at US peak hours
2. **Create "search" content** — tutorials and how-tos attract high-intent viewers
3. **Go longer** — 3–5 minute videos tend to have higher RPMs than 1-minute videos
4. **Build authority** — established creators command higher payouts over time`
      },
      {
        slug: 'crp-strategy',
        title: 'Combining CRP with TikTok Shop for Maximum Income',
        duration: '16 min',
        xp: 50,
        content: `## Combining CRP with TikTok Shop for Maximum Income

The real money is in stacking multiple income streams from the same content.

### The Dual-Income Video

One video can earn from:
1. **CRP** — views-based payment (passive, ongoing)
2. **TikTok Shop commissions** — every sale you drive
3. **Brand deals** — if brands pay you to feature their products

Top creators use the same video to generate income from all three simultaneously.

### The Content Strategy

Create long-form content (1+ minutes) that naturally includes product recommendations:

"5 TikTok Shop products that upgraded my morning routine" (5 min video)
- CRP pays for the views
- Each product link in the video earns commission on sales
- Eventually, brands in that niche reach out for paid partnerships

### Scaling the Machine

As you grow:
- More followers = higher CRP earnings
- More trust = higher conversion on TikTok Shop
- More clout = higher rates for brand deals

Each stream reinforces the others. The creator economy rewards creators who build the full stack — not just one income source.

**Your goal:** Build to $5K/month between CRP + TikTok Shop by month 3–6. Everything after that is scale.`
      }
    ]
  },

  {
    slug: 'tiktok-organic-growth',
    title: 'TikTok Organic Growth Blueprint',
    description: 'Grow to 10K, 50K, and 100K followers without paying for ads. The complete organic growth system.',
    category: 'tiktok',
    level: 'Intermediate',
    totalLessons: 4,
    totalXP: 200,
    badge: '📈',
    lessons: [
      {
        slug: 'organic-foundation',
        title: 'The Foundation of Organic Growth',
        duration: '18 min',
        xp: 50,
        content: `## The Foundation of Organic Growth

Organic growth is free, sustainable, and compounds over time. Here's the foundation.

### The Growth Equation

Growth = Content Quality × Posting Frequency × Niche Clarity

All three must be present. Posting garbage 10x a day won't grow you. Posting 1 perfect video per week won't either. Posting the wrong niche won't work regardless.

### Content Quality Benchmarks

Strive for:
- Hook that stops 80%+ of viewers (test this by checking 3-second view rate)
- Completion rate of 60%+
- 1 comment per 100 views minimum
- 1 share per 500 views minimum

If your content doesn't hit these benchmarks, quality is the constraint — not frequency.

### Posting Frequency for Growth

**0–1K followers:** 3–5 videos/day (you're testing, need data fast)
**1K–10K followers:** 3–5 videos/day (maintaining momentum)
**10K–100K followers:** 1–3 quality videos/day (quality starts to matter more)
**100K+:** 1–2 premium videos/day + regular shorts for engagement

### Niche Clarity

TikTok needs to categorize your account to serve your content to the right people. If you post about cooking, fitness, and car reviews all in the same week, TikTok doesn't know who to show you to.

Stay in your lane until you hit 10K+ before expanding.`
      },
      {
        slug: 'organic-content',
        title: 'Creating Shareable, Save-Worthy Content',
        duration: '20 min',
        xp: 50,
        content: `## Creating Shareable, Save-Worthy Content

Shares and saves are the two most powerful growth signals. Here's how to engineer them.

### Why Shares > Likes for Growth

When someone shares your video:
1. TikTok counts it as a strong positive signal
2. Your video reaches an entirely new audience (the sharer's contacts)
3. The new audience might follow you

One share can bring in 5–50 new followers depending on who's doing the sharing.

### What Makes People Share

People share content that makes them look good or feel something:
- **Valuable:** "My friend needs to see this"
- **Funny:** "This is literally us"
- **Inspiring:** "This motivated me, it might help you too"
- **Shocking/Surprising:** "I can't believe this is only $15"

### What Makes People Save

People save content they want to reference later:
- Step-by-step tutorials
- Product lists ("Top 10 kitchen items")
- Tips they know they'll need again
- Prices on products they're considering buying

### Creating Both in One Video

The ideal video generates shares AND saves. Example:
"5 TikTok Shop products that are actually worth the hype" 
- Shareable (friend recommendations)
- Save-worthy (reference the list when shopping)`
      },
      {
        slug: 'organic-collab',
        title: 'Collaboration and Cross-Promotion Strategies',
        duration: '14 min',
        xp: 50,
        content: `## Collaboration and Cross-Promotion Strategies

Collaboration is the fastest organic growth hack on TikTok.

### Duets and Stitches

**Duet:** You react side-by-side with another creator's video
**Stitch:** You clip a portion of someone's video and respond to it

Both formats expose you to the original creator's audience. Target creators with 50K–500K followers in your niche (avoid mega-creators — too competitive).

### Creator Collaboration Formula

Reach out to 5 creators per week in your niche with similar audience sizes:
"Hey [Name], love your content on [topic]. I think our audiences would love a collaboration — would you be open to a duet or mutual shoutout?"

Success rate: 1 in 5–10 creators will say yes. Over time, this compounds massively.

### Cross-Platform Promotion

Post your TikTok content on:
- Instagram Reels (same video, same caption)
- YouTube Shorts (trim if needed)
- Pinterest (for home, beauty, lifestyle niches)

Each platform feeds followers back to your TikTok. Over time, you build a multi-platform presence that's harder to disrupt.

### Trending Sounds and Challenges

Participating in trending challenges is a free growth hack. TikTok actively promotes trending challenge content.

Check the Discover tab daily — participating in the top trend of the day can expose your content to millions of viewers browsing the trend.`
      },
      {
        slug: 'organic-milestones',
        title: 'Growth Milestones: 0 to 100K Roadmap',
        duration: '16 min',
        xp: 50,
        content: `## Growth Milestones: 0 to 100K Roadmap

Clear milestones keep you focused and motivated. Here's what to prioritize at each stage.

### 0 to 1,000 Followers

**Goal:** Find your niche and hook formula  
**Actions:**
- Post 3–5 videos/day
- Test different hooks until you find what works
- Engage with EVERYONE who comments
- Study your top-performing content

**Success looks like:** Consistent 1,000–5,000 views per video

### 1K to 10K Followers

**Goal:** Establish content consistency and community  
**Actions:**
- Maintain daily posting
- Start pinching your best-performing content style
- Begin collaborations with similar-size creators
- Set up TikTok Shop if not already done

**Success looks like:** 10K–50K views on top videos

### 10K to 50K Followers

**Goal:** Monetization and brand deals  
**Actions:**
- Apply for CRP (10K+ requirement)
- Focus on longer content (1+ min for CRP)
- Reach out to brands in your niche for gifted collabs
- Go live 3–4x per week

**Success looks like:** $1,000–$3,000/month from TikTok

### 50K to 100K Followers

**Goal:** Scale all revenue streams  
**Actions:**
- Premium brand partnerships ($500–$2,000 per post)
- Live stream daily for TikTok Shop
- Build email list from TikTok traffic
- Consider your own product/course

**Success looks like:** $5,000–$15,000/month, sustainable business`
      }
    ]
  },

  {
    slug: 'tiktok-content-reuse',
    title: 'TikTok Content Repurposing System',
    description: 'Create once, post everywhere. Build a system that multiplies your content across platforms for maximum reach.',
    category: 'tiktok',
    level: 'Intermediate',
    totalLessons: 4,
    totalXP: 200,
    badge: '♻️',
    lessons: [
      {
        slug: 'reuse-system',
        title: 'Building Your Content Repurposing System',
        duration: '16 min',
        xp: 50,
        content: `## Building Your Content Repurposing System

The most efficient creators don't create more content — they distribute the same content further.

### The Core Concept

One piece of content can become:
- TikTok video (primary)
- Instagram Reel (same video)
- YouTube Short (same or trimmed)
- Pinterest pin (thumbnail + link)
- Twitter/X clip (15-second highlight)

That's 5 distribution channels from 1 video. 5x the reach, same effort.

### Why Most Creators Don't Do This

Friction. Reposting to 5 platforms sounds like a lot of work. But with a system, it takes 15 extra minutes per video.

### The Repurposing Stack

**Step 1:** Create and post your TikTok (primary platform)
**Step 2:** Download the video (no watermark — use SnapTik or download from TikTok directly)
**Step 3:** Upload to Instagram Reels (same caption, same hashtags adapted for IG)
**Step 4:** Upload to YouTube Shorts (add a YouTube-specific title for SEO)
**Step 5:** Schedule in advance using Buffer or Later

Total time: 15–20 minutes per video. Your content is now working across 4 platforms simultaneously.`
      },
      {
        slug: 'reuse-platforms',
        title: 'Platform-by-Platform Adaptation Guide',
        duration: '18 min',
        xp: 50,
        content: `## Platform-by-Platform Adaptation Guide

Each platform has its own culture. Here's how to adapt your TikTok content for each.

### Instagram Reels

What's different:
- Instagram audience tends to be slightly older (25–40)
- Aesthetics matter more — cleaner, more polished content performs better
- Hashtags matter on IG (use 5–10 targeted hashtags)

Adaptation: Same video, but write a more polished caption. Add 5–10 relevant hashtags.

### YouTube Shorts

What's different:
- YouTube has a massive search engine — optimize for searchable titles
- Viewers often find Shorts through YouTube search, not just the feed
- YouTube Shorts can drive traffic to long-form YouTube videos (if you have them)

Adaptation: Rename your video with a searchable title. "This $15 product is going viral on TikTok" → "Best TikTok Shop Products Under $20 — Are They Worth It?"

### Pinterest

What's different:
- Pinterest is discovery-based, not following-based
- Content lives MUCH longer on Pinterest (weeks vs. hours)
- Best for home, beauty, fashion, food niches

Adaptation: Create a still image with your video link, optimized with keywords.

### Cross-Platform Monetization

Each platform has its own monetization:
- TikTok: CRP + TikTok Shop
- Instagram: Brand deals + affiliate
- YouTube: AdSense + YouTube Shopping
- Pinterest: Affiliate links

Same content, multiple revenue streams.`
      },
      {
        slug: 'reuse-tools',
        title: 'Tools and Automations for Content Repurposing',
        duration: '14 min',
        xp: 50,
        content: `## Tools and Automations for Content Repurposing

The right tools eliminate almost all the friction from repurposing.

### Essential Tools

**SnapTik / SaveTT**
Download TikTok videos without the watermark. Free, web-based.

**Buffer / Later**
Schedule posts to Instagram, Pinterest, and other platforms in advance. You can batch a week of reposts in one sitting.

**CapCut**
Edit your videos before posting to each platform. Add platform-specific text overlays or trim to the right length.

**Metricool**
All-in-one analytics dashboard. See performance across TikTok, Instagram, and YouTube in one place.

### The Batching Workflow

**Sunday (2 hours):**
1. Review this week's TikTok content
2. Download top-performing videos
3. Adapt captions for each platform
4. Schedule all reposts for the week via Buffer

This one 2-hour session covers your repurposing for the entire week.

### Automation Limits

Don't fully automate reposts without review. Trending audio on TikTok is often copyright-restricted on other platforms — always check before reposting. Use original audio or royalty-free music when repurposing.`
      },
      {
        slug: 'reuse-scaling',
        title: 'Scaling a Multi-Platform Content Business',
        duration: '16 min',
        xp: 50,
        content: `## Scaling a Multi-Platform Content Business

Once the repurposing system is running, here's how to scale it into a real business.

### Adding Long-Form Content

Short-form content is the top of the funnel. Long-form converts to money:
- **YouTube long-form:** Deep review videos (10–20 min) earn AdSense + affiliate at much higher RPMs
- **Podcast:** Audio version of your content — growing platform, low competition
- **Newsletter/Email list:** Owned audience that platforms can't take away from you

### Hiring Help

When you're earning $3K+/month from content:
- Hire a video editor ($5–$15/video on Upwork or Fiverr)
- Hire a VA to handle repurposing ($500–$1,500/month)

This frees you to focus only on filming and strategy — the highest-value activities.

### The Multi-Platform Revenue Stack

Mature multi-platform creator earnings:
- TikTok (CRP + TikTok Shop): $2,000–$10,000/month
- YouTube (AdSense + affiliate): $1,000–$5,000/month
- Instagram (brand deals): $2,000–$20,000/month
- Newsletter (affiliate + own products): $500–$5,000/month

**Total potential:** $5,500–$40,000/month from the same core content repurposed across platforms. This is the creator economy ceiling — and it's reachable.`
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  // YOUTUBE COURSES
  // ══════════════════════════════════════════════════════════

  {
    slug: 'youtube-shorts',
    title: 'YouTube Shorts Mastery',
    description: 'Grow on YouTube Shorts and unlock AdSense monetization with a strategy built for speed.',
    category: 'youtube',
    level: 'Beginner',
    totalLessons: 4,
    totalXP: 200,
    badge: '▶️',
    lessons: [
      {
        slug: 'shorts-overview',
        title: 'Why YouTube Shorts Is a Gold Rush Right Now',
        duration: '14 min',
        xp: 50,
        content: `## Why YouTube Shorts Is a Gold Rush Right Now

YouTube Shorts is at the same stage TikTok was in 2020. Early movers are winning big. Here's why.

### The YouTube Shorts Opportunity

- **YouTube is the #2 search engine in the world** — Shorts get indexed in search
- **AdSense RPMs are 3–10x higher** than TikTok CRP
- **Long-form funnel:** Shorts viewers convert to long-form subscribers
- **Less saturated** than TikTok in most niches — easier to stand out right now

### How Shorts Monetization Works

To qualify for YouTube Partner Program (YPP) via Shorts:
- 500 subscribers
- 3 public videos in the last 90 days
- 3,000 hours watch time OR 3 million Shorts views in 90 days

Once in YPP, you earn from:
- **Shorts ad revenue** (split between creators from an ad pool)
- **Super Thanks** (viewers can tip you on Shorts)
- **Channel memberships**

### Shorts vs. Long-Form

You don't have to choose. The smartest strategy:
1. Post Shorts daily (low effort, high volume)
2. Convert engaged viewers to long-form subscribers
3. Earn higher RPMs from long-form AdSense

Shorts is the top of the funnel. Long-form is where the real money is.`
      },
      {
        slug: 'shorts-content',
        title: 'Creating Shorts That Get Millions of Views',
        duration: '18 min',
        xp: 50,
        content: `## Creating Shorts That Get Millions of Views

YouTube Shorts has a different algorithm than TikTok. Here's what actually works.

### YouTube Shorts Algorithm Signals

Unlike TikTok (which pushes to non-followers), YouTube Shorts:
1. Shows to your subscribers first
2. Then expands to similar viewers based on performance
3. **Click-through rate of your thumbnail matters** (even for Shorts in browse)

Your title and first frame act as the thumbnail. Optimize both.

### Shorts That Consistently Perform

**Educational "Did You Know" content:**
"Did you know you can [surprising fact]?" — huge curiosity hook, highly shareable

**Tutorial content:**
"How to [achieve result] in under 60 seconds" — searchable, saves-worthy

**Reaction content:**
Reacting to other creators' content (with permission) or trends

**Series content:**
Daily or weekly recurring format ("Day X of learning [skill]") — viewers subscribe for continuity

### Title Optimization (Critical for YouTube)

YouTube is a search engine. Your Short's title is like a Google headline:
- Include the main keyword naturally
- Add intrigue: "...and the results shocked me"
- Keep it under 60 characters

Example: "I tried 5 viral TikTok Shop products — here's what's actually worth it"`
      },
      {
        slug: 'shorts-growth',
        title: 'Growing Your YouTube Channel Fast with Shorts',
        duration: '16 min',
        xp: 50,
        content: `## Growing Your YouTube Channel Fast with Shorts

Shorts is the fastest path to growing a YouTube channel from zero. Here's the strategy.

### The Shorts Growth Loop

1. Post 3–5 Shorts per day (repurposed from TikTok or original)
2. Each Short drives profile visits
3. Profile visitors see your channel page → subscribe
4. More subscribers = better distribution on your next Short
5. Repeat

### Converting Shorts Viewers to Subscribers

At the end of each Short:
- "Subscribe for more [niche] content"
- "Follow along as I [ongoing journey]"
- Pin a comment: "🔔 Subscribe — I drop new content daily"

Subscribers who came from Shorts are more likely to watch your long-form content later.

### Cross-Platform Synergy

Post TikTok videos to YouTube Shorts simultaneously. Your TikTok growth will accelerate your YouTube growth and vice versa.

If a TikTok video goes viral, upload it to Shorts within 24 hours while the topic is hot. You'll often get a second wave of views on YouTube from the same content.

### Consistency Window

To see real Shorts growth, commit to **60 consecutive days** of daily posting before evaluating. The algorithm needs time to learn your content and find your audience.`
      },
      {
        slug: 'shorts-monetization',
        title: 'Monetizing Your YouTube Shorts Channel',
        duration: '14 min',
        xp: 50,
        content: `## Monetizing Your YouTube Shorts Channel

YouTube offers more monetization options than TikTok. Here's how to stack them.

### Path to YouTube Partner Program

**Tier 1 (Fan Funding):**
- 500 subscribers + 3,000 watch hours or 3M Shorts views
- Unlocks: channel memberships, Super Thanks, Super Chat

**Tier 2 (Full YPP):**
- 1,000 subscribers + 4,000 watch hours or 10M Shorts views
- Unlocks: AdSense revenue sharing

### YouTube Affiliate Marketing

Unlike TikTok, YouTube allows product links in descriptions on every video.

Use this for:
- Amazon affiliate links (Amazon Associates)
- TikTok Shop links (cross-platform)
- Direct brand affiliate programs

A Shorts video with 100K views and affiliate links in the description can earn $200–$1,000 in commissions.

### YouTube + TikTok Shop Stack

Your YouTube Shorts can drive traffic to your TikTok Shop:
- In your YouTube description: "Shop the products I feature: [TikTok Shop link]"
- In your pinned comment: "All products linked in description"

Same product, two traffic sources, one commission.

### Long Game: YouTube AdSense

Long-form YouTube videos earn $2–$10 per 1,000 views depending on niche. 
With 100K subscribers and 500K monthly views:
**Monthly AdSense: $1,000–$5,000** (passive, recurring)

This is the end game. Build with Shorts, earn with long-form.`
      }
    ]
  },

  {
    slug: 'youtube-shorts-niche',
    title: 'YouTube Shorts Niche Selection',
    description: 'Find the most profitable YouTube Shorts niche for your personality and interests.',
    category: 'youtube',
    level: 'Beginner',
    totalLessons: 3,
    totalXP: 150,
    badge: '🎯',
    lessons: [
      {
        slug: 'yt-niche-research',
        title: 'Researching Profitable YouTube Niches',
        duration: '16 min',
        xp: 50,
        content: `## Researching Profitable YouTube Niches

YouTube's monetization rates vary massively by niche. Choose strategically.

### YouTube CPM by Niche (Approximate)

- Finance / Investing: $15–$50 CPM
- Business / Entrepreneurship: $10–$30 CPM
- Technology: $8–$20 CPM
- Health & Fitness: $5–$15 CPM
- Lifestyle / Vlogs: $3–$8 CPM
- Entertainment / Gaming: $2–$5 CPM

**CPM (cost per mille)** = what advertisers pay per 1,000 ad views. Higher CPM = more money per view for you.

A Finance channel earns 5–10x more per view than an Entertainment channel.

### How to Research Niche Viability

**Search volume check:**
Search your potential niche topics on YouTube. How many results? If there are millions of results, there's demand.

**Competitor analysis:**
Find 5 channels in your niche. Are they growing? Recent videos getting views? Multiple income streams visible?

**Comment sentiment:**
Read comments on competitor videos. Are viewers highly engaged? Asking questions? That's a buying audience.

### Balancing Passion and Profit

High CPM niches (finance, tech) are worth learning even if you're not naturally interested — the payoff is worth the effort.

But if you genuinely hate the content, you won't post consistently. A 50% passion + 50% profit blend is the target.`
      },
      {
        slug: 'yt-niche-competition',
        title: 'Beating Competition in Your Niche',
        duration: '14 min',
        xp: 50,
        content: `## Beating Competition in Your Niche

Competition isn't your enemy — it's proof there's an audience. Here's how to win anyway.

### The Differentiation Framework

You don't need to be the best creator. You need to be the **most relevant** creator for a specific sub-audience.

**Find the gap:**
What are top creators in your niche NOT covering? What angles are underserved?

Example: "Personal finance for TikTok creators" is less competitive than "personal finance" and more targeted.

**Own the format:**
If all competitors do talking-head videos, try tutorial-style. If everyone does tutorials, try storytelling. Format differentiation gets you noticed.

**Personality niche:**
"Brutally honest reviews of TikTok Shop products" vs. generic positive reviews. A strong personality is a competitive advantage nobody can copy.

### Speed to Authority

In newer niches or sub-niches, you can establish authority in 90 days with consistent posting. On YouTube, being early in a niche means your content ranks at the top of search for years.

### Long-Tail Keywords

Target long-tail search terms with lower competition:
- Instead of "TikTok Shop" → "best TikTok Shop products for college students"
- Instead of "make money online" → "how to make your first $100 on TikTok Shop"

Lower competition, more targeted viewer, higher conversion rate.`
      },
      {
        slug: 'yt-niche-content-plan',
        title: 'Building a 90-Day YouTube Content Plan',
        duration: '12 min',
        xp: 50,
        content: `## Building a 90-Day YouTube Content Plan

The creators who win on YouTube plan ahead. Here's how to build a 90-day roadmap.

### The First 30 Days: Foundation

**Goal:** Establish your content identity
**Volume:** 3–5 Shorts per day
**Content:** Test 5–10 different angles and formats
**Track:** Which videos get the highest completion rate and subscriber conversion

### Days 31–60: Double Down

**Goal:** Scale what's working
**Volume:** 3–5 Shorts per day + 1 long-form video per week
**Content:** Focus 80% on formats that performed best in month 1
**Track:** Subscriber growth rate, watch time

### Days 61–90: Monetization Push

**Goal:** Hit YPP requirements or maximize affiliate earnings
**Volume:** Maintain consistency from previous month
**Content:** Create "pillar" content — comprehensive videos that rank in search for years
**Track:** AdSense earnings (if monetized), affiliate commissions

### Content Batching Schedule

**Monday:** Film 5–10 Shorts
**Tuesday:** Edit and schedule all Shorts for the week
**Wednesday–Friday:** Engage with comments, analyze analytics, plan next week
**Weekend:** Film long-form content (if creating long-form)

This batching approach makes daily posting sustainable without daily effort.`
      }
    ]
  },

  {
    slug: 'youtube-content-reuse',
    title: 'YouTube Content Repurposing',
    description: 'Turn your YouTube Shorts into long-form content, blog posts, and multiple revenue streams.',
    category: 'youtube',
    level: 'Intermediate',
    totalLessons: 3,
    totalXP: 150,
    badge: '♻️',
    lessons: [
      {
        slug: 'yt-reuse-system',
        title: 'The YouTube Content Reuse System',
        duration: '16 min',
        xp: 50,
        content: `## The YouTube Content Reuse System

The most efficient YouTube creators aren't creating more — they're repurposing smarter.

### From Short to Long-Form

Your best Shorts can become full YouTube videos:

1. A 60-second Short on "5 TikTok Shop products worth buying"
2. Becomes a 10-minute long-form: "I Tested 5 Viral TikTok Shop Products — Complete Honest Review"
3. The Short drives viewers to the long-form for more depth
4. Long-form earns 10x more AdSense than the Short

### From YouTube to TikTok

Clip highlights from your long-form YouTube videos and post them as TikToks:
- A 10-minute YouTube review → five 60-second TikToks, each covering one product

This gives TikTok-first viewers a reason to visit your YouTube for the full review.

### The Content Ecosystem

```
TikTok Short → YouTube Short (repost)
YouTube Short → Long-form YouTube (expanded)
Long-form YouTube → Blog post (SEO)
Blog post → Newsletter (owned audience)
Newsletter → Direct sales / affiliate
```

Each piece of content feeds the next. The same 30 minutes of effort generates weeks of content across multiple platforms.`
      },
      {
        slug: 'yt-reuse-seo',
        title: 'YouTube SEO for Maximum Discoverability',
        duration: '18 min',
        xp: 50,
        content: `## YouTube SEO for Maximum Discoverability

YouTube is a search engine. Treat your videos like web pages that need to rank.

### The YouTube SEO Stack

**Title:** Include your primary keyword + an intrigue element
- Bad: "TikTok Shop Haul"
- Good: "I Spent $200 on TikTok Shop — Here's What's Actually Worth Buying"

**Description:** Write 200+ words with natural keyword usage
- Include the primary keyword in the first 2 sentences
- Add timestamps (YouTube uses these for search)
- Include all product links (affiliate/TikTok Shop)

**Tags:** Include 5–10 specific tags
- Primary keyword
- Secondary keywords
- Related topics
- Your channel name

**Thumbnail:** This is the click-through rate driver
- Bright colors with high contrast
- Readable text (3–5 words max)
- Emotional face expression (curiosity, shock, happiness)

### Keyword Research Tools

- **YouTube Autocomplete:** Type your topic in YouTube search and see what suggestions appear
- **TubeBuddy:** Free Chrome extension showing keyword competition scores
- **Google Trends:** Compare keyword popularity over time

### The Power of Playlists

Organize your videos into playlists. YouTube recommends playlist videos to viewers who just watched one — increasing session time and boosting all videos in the playlist.`
      },
      {
        slug: 'yt-reuse-revenue',
        title: 'Building Multiple Revenue Streams from YouTube',
        duration: '14 min',
        xp: 50,
        content: `## Building Multiple Revenue Streams from YouTube

YouTube is a platform with more monetization pathways than almost any other. Here's the full picture.

### Revenue Stream 1: AdSense

Activated through YouTube Partner Program. Earnings compound as your library grows — old videos keep earning.

**Optimization:** Niche matters most here. Finance and business creators earn $10–$30 RPM. Entertainment creators earn $2–$5 RPM.

### Revenue Stream 2: Affiliate Marketing

Every video can have affiliate links in the description. The best programs:
- Amazon Associates (easy entry, 3–8% commissions)
- TikTok Shop affiliate (link products in descriptions)
- Direct brand affiliate programs (often 15–40% commissions)

### Revenue Stream 3: Brand Sponsorships

As you grow (10K+ subscribers), brands will pay for dedicated mentions:
- 10K subscribers: $100–$500 per video
- 100K subscribers: $1,000–$5,000 per video
- 1M subscribers: $10,000–$50,000 per video

### Revenue Stream 4: Channel Memberships

Available at 500+ subscribers. Offer exclusive perks for $3–$15/month:
- Behind-the-scenes content
- Early access to videos
- Monthly live Q&As
- Private Discord community

### Revenue Stream 5: Courses and Products

Your YouTube audience trusts you. Once you have 5K+ subscribers, selling your own course or product is viable. A simple $50–$200 course sold to 1% of your audience generates life-changing income.`
      }
    ]
  }

]

// Helper functions
export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find(c => c.slug === slug)
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string): Lesson | undefined {
  const course = getCourseBySlug(courseSlug)
  return course?.lessons.find(l => l.slug === lessonSlug)
}

export function getCoursesByCategory(category: Course['category']): Course[] {
  return COURSES.filter(c => c.category === category)
}

export const TOTAL_XP_AVAILABLE = COURSES.reduce((sum, c) => sum + c.totalXP, 0)
