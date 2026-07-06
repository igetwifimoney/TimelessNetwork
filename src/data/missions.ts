// verify: how this mission is confirmed complete
// 'lesson'    → completed when user finishes any lesson today (course_progress)
// 'community' → completed when user posts in community today
// 'tracker'   → completed when user adds a product to tracker today
//  null        → happens on TikTok / IRL — shown as a task reminder, no checkbox
export type MissionVerify = 'lesson' | 'community' | 'tracker' | null

export interface Mission {
  id: string
  text: string
  xp: number
  emoji: string
  link?: string
  verify: MissionVerify
}

export interface DayPlan {
  theme: string
  tagline: string
  missions: Mission[]
}

// Day 0 = Sunday, 1 = Monday ... 6 = Saturday
export const DAILY_PLANS: Record<number, DayPlan> = {
  0: { // Sunday
    theme: 'Review & Reflect',
    tagline: 'Sunday is for studying. Absorb everything from the week.',
    missions: [
      { id: 'sun-1', text: 'Complete one full course lesson', xp: 50, emoji: '📚', link: '/courses', verify: 'lesson' },
      { id: 'sun-2', text: 'Review your top 3 performing videos from last week', xp: 30, emoji: '📊', verify: null },
      { id: 'sun-3', text: 'Plan your content schedule for the week ahead', xp: 25, emoji: '📅', verify: null },
      { id: 'sun-4', text: 'Post one win or lesson learned in the community', xp: 20, emoji: '🏆', link: '/community', verify: 'community' },
    ],
  },
  1: { // Monday
    theme: 'Product Research Day',
    tagline: 'Start the week right. Find your next winning product.',
    missions: [
      { id: 'mon-1', text: 'Find 10 potential products in TikTok Shop marketplace', xp: 50, emoji: '🔍', verify: null },
      { id: 'mon-2', text: 'Analyze 3 competitors in your niche — watch their top videos', xp: 40, emoji: '👀', verify: null },
      { id: 'mon-3', text: 'Add 2 products to your Product Tracker', xp: 30, emoji: '📋', link: '/tracker', verify: 'tracker' },
      { id: 'mon-4', text: 'Watch the TikTok Shop Foundation lesson', xp: 50, emoji: '📖', link: '/courses/ttshop-foundation', verify: 'lesson' },
    ],
  },
  2: { // Tuesday
    theme: 'Content Planning Day',
    tagline: 'Plan before you film. Great videos start with great scripts.',
    missions: [
      { id: 'tue-1', text: 'Write 3 video hooks using the hook formula from the CTA course', xp: 40, emoji: '✍️', link: '/courses/ttshop-cta', verify: null },
      { id: 'tue-2', text: 'Script 2 full video concepts (hook → problem → solution → CTA)', xp: 50, emoji: '📝', verify: null },
      { id: 'tue-3', text: 'Find trending audio on TikTok for this week', xp: 25, emoji: '🎵', verify: null },
      { id: 'tue-4', text: 'Study one lesson from the Algorithm course', xp: 50, emoji: '⚡', link: '/courses/tiktok-algorithm', verify: 'lesson' },
    ],
  },
  3: { // Wednesday
    theme: 'Film Day',
    tagline: 'Cameras out. Ship the content. Done is better than perfect.',
    missions: [
      { id: 'wed-1', text: 'Film at least 3 product videos', xp: 75, emoji: '🎬', verify: null },
      { id: 'wed-2', text: 'Film 5 slideshow-ready product photo sets', xp: 40, emoji: '📸', verify: null },
      { id: 'wed-3', text: 'Post a progress check-in in the community', xp: 20, emoji: '💬', link: '/community', verify: 'community' },
      { id: 'wed-4', text: 'Complete the TikTok Shop Video course lesson', xp: 50, emoji: '📺', link: '/courses/ttshop-video', verify: 'lesson' },
    ],
  },
  4: { // Thursday
    theme: 'Edit & Upload Day',
    tagline: 'Turn raw footage into money. Edit, optimize, and post.',
    missions: [
      { id: 'thu-1', text: 'Edit and upload 2+ videos to TikTok', xp: 75, emoji: '📤', verify: null },
      { id: 'thu-2', text: 'Post 3 slideshows with trending audio', xp: 50, emoji: '🖼️', verify: null },
      { id: 'thu-3', text: 'Optimize captions and hashtags on all posts', xp: 25, emoji: '🎯', verify: null },
      { id: 'thu-4', text: 'Read the CTA Mastery lesson', xp: 50, emoji: '📖', link: '/courses/ttshop-cta', verify: 'lesson' },
    ],
  },
  5: { // Friday
    theme: 'Analyze & Optimize',
    tagline: 'Data tells you what to do next. Let it.',
    missions: [
      { id: 'fri-1', text: 'Check TikTok analytics — note your top 3 videos this week', xp: 40, emoji: '📈', verify: null },
      { id: 'fri-2', text: 'Check Creator Studio earnings — what\'s actually converting?', xp: 30, emoji: '💰', verify: null },
      { id: 'fri-3', text: 'Double down: recreate your top performing video in a new angle', xp: 50, emoji: '🔄', verify: null },
      { id: 'fri-4', text: 'Complete the Organic Growth lesson', xp: 50, emoji: '🌱', link: '/courses/tiktok-organic-growth', verify: 'lesson' },
    ],
  },
  6: { // Saturday
    theme: 'Go Live Day',
    tagline: 'Saturday audiences are huge. Get in front of them.',
    missions: [
      { id: 'sat-1', text: 'Go live for at least 60 minutes on TikTok', xp: 100, emoji: '🔴', link: '/courses/ttshop-live', verify: null },
      { id: 'sat-2', text: 'Feature at least 3 products during your live', xp: 50, emoji: '🛒', verify: null },
      { id: 'sat-3', text: 'Engage with every comment during the live', xp: 30, emoji: '💬', verify: null },
      { id: 'sat-4', text: 'Post your live results in the wins channel', xp: 25, emoji: '🏆', link: '/community', verify: 'community' },
    ],
  },
}

export function getTodaysPlan(): DayPlan {
  const day = new Date().getDay()
  return DAILY_PLANS[day]
}

export function getDayName(day?: number): string {
  const d = day ?? new Date().getDay()
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
