export interface Achievement {
  id: string
  emoji: string
  title: string
  description: string
  category: 'streak' | 'learning' | 'community' | 'revenue' | 'content'
  xpReward: number
  // How to check unlock — evaluated client-side against user stats
  check: (stats: AchievementStats) => boolean
}

export interface AchievementStats {
  xp: number
  streakCount: number
  lessonsCompleted: number
  coursesCompleted: number
  postsCount: number
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Streak achievements
  {
    id: 'streak-1',
    emoji: '🔥',
    title: 'First Flame',
    description: 'Log in for 1 day in a row',
    category: 'streak',
    xpReward: 25,
    check: s => s.streakCount >= 1,
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    title: '3-Day Streak',
    description: 'Log in for 3 days in a row',
    category: 'streak',
    xpReward: 50,
    check: s => s.streakCount >= 3,
  },
  {
    id: 'streak-7',
    emoji: '🔥',
    title: 'Week Warrior',
    description: '7-day login streak',
    category: 'streak',
    xpReward: 100,
    check: s => s.streakCount >= 7,
  },
  {
    id: 'streak-14',
    emoji: '⚡',
    title: '2-Week Grinder',
    description: '14 days straight — you\'re serious',
    category: 'streak',
    xpReward: 200,
    check: s => s.streakCount >= 14,
  },
  {
    id: 'streak-30',
    emoji: '👑',
    title: '30-Day Legend',
    description: '30-day streak — elite level consistency',
    category: 'streak',
    xpReward: 500,
    check: s => s.streakCount >= 30,
  },
  {
    id: 'streak-100',
    emoji: '🏆',
    title: 'Century Club',
    description: '100 consecutive days. Absolute unit.',
    category: 'streak',
    xpReward: 1000,
    check: s => s.streakCount >= 100,
  },

  // ── Learning achievements
  {
    id: 'lesson-1',
    emoji: '📚',
    title: 'First Step',
    description: 'Complete your first lesson',
    category: 'learning',
    xpReward: 50,
    check: s => s.lessonsCompleted >= 1,
  },
  {
    id: 'lesson-5',
    emoji: '📖',
    title: 'Getting Momentum',
    description: 'Complete 5 lessons',
    category: 'learning',
    xpReward: 75,
    check: s => s.lessonsCompleted >= 5,
  },
  {
    id: 'lesson-10',
    emoji: '🎯',
    title: 'Dialed In',
    description: 'Complete 10 lessons',
    category: 'learning',
    xpReward: 100,
    check: s => s.lessonsCompleted >= 10,
  },
  {
    id: 'lesson-25',
    emoji: '🚀',
    title: 'Knowledge Stacker',
    description: 'Complete 25 lessons',
    category: 'learning',
    xpReward: 200,
    check: s => s.lessonsCompleted >= 25,
  },
  {
    id: 'lesson-50',
    emoji: '🧠',
    title: 'Deep Diver',
    description: 'Complete 50 lessons',
    category: 'learning',
    xpReward: 400,
    check: s => s.lessonsCompleted >= 50,
  },
  {
    id: 'course-1',
    emoji: '🥇',
    title: 'First Course Complete',
    description: 'Finish an entire course',
    category: 'learning',
    xpReward: 250,
    check: s => s.coursesCompleted >= 1,
  },
  {
    id: 'course-3',
    emoji: '🎓',
    title: 'Triple Threat',
    description: 'Complete 3 full courses',
    category: 'learning',
    xpReward: 500,
    check: s => s.coursesCompleted >= 3,
  },
  {
    id: 'course-all',
    emoji: '💎',
    title: 'Timeless Master',
    description: 'Complete every course in the library',
    category: 'learning',
    xpReward: 2000,
    check: s => s.coursesCompleted >= 15,
  },

  // ── XP achievements
  {
    id: 'xp-100',
    emoji: '⚡',
    title: 'XP Earner',
    description: 'Earn 100 total XP',
    category: 'learning',
    xpReward: 0,
    check: s => s.xp >= 100,
  },
  {
    id: 'xp-500',
    emoji: '💰',
    title: 'XP Collector',
    description: 'Earn 500 total XP',
    category: 'learning',
    xpReward: 0,
    check: s => s.xp >= 500,
  },
  {
    id: 'xp-1000',
    emoji: '🚀',
    title: 'Four Figures',
    description: 'Earn 1,000 total XP',
    category: 'learning',
    xpReward: 100,
    check: s => s.xp >= 1000,
  },
  {
    id: 'xp-5000',
    emoji: '🏆',
    title: 'XP Millionaire',
    description: 'Earn 5,000 total XP',
    category: 'learning',
    xpReward: 500,
    check: s => s.xp >= 5000,
  },

  // ── Community achievements
  {
    id: 'post-1',
    emoji: '💬',
    title: 'First Post',
    description: 'Post in the community for the first time',
    category: 'community',
    xpReward: 25,
    check: s => s.postsCount >= 1,
  },
  {
    id: 'post-10',
    emoji: '🗣️',
    title: 'Community Voice',
    description: 'Post 10 times in the community',
    category: 'community',
    xpReward: 100,
    check: s => s.postsCount >= 10,
  },
]

export function getUnlockedAchievements(stats: AchievementStats): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.check(stats))
}

export function getLockedAchievements(stats: AchievementStats): Achievement[] {
  return ACHIEVEMENTS.filter(a => !a.check(stats))
}

export function getNextAchievement(stats: AchievementStats): Achievement | null {
  return ACHIEVEMENTS.find(a => !a.check(stats)) ?? null
}
