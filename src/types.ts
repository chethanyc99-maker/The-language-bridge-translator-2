export interface Chapter {
  chapterNumber: number;
  chapterTitle: string;
  textTarget: string;
  textEnglish: string;
  sentences?: {
    textTarget: string;
    textEnglish: string;
    audioId?: string;
    volunteerName?: string;
    volunteerRole?: string;
    volunteerAvatar?: string;
  }[];
}

export interface Story {
  id: string;
  title: string;
  titleTranslation: string;
  category: string;
  language: string;
  readTime: string;
  rating: number;
  featured?: boolean;
  coverUrl: string;
  chapters: Chapter[];
  description?: string;
  isFallback?: boolean;
  isQuotaExceeded?: boolean;
}

export interface Phrase {
  id: string;
  english: string;
  translation: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "partner";
  text: string;
  translation?: string;
  timestamp: string;
  audioUrl?: string;
  status?: "sent" | "received" | "read";
}

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  type: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  country: string;
  xp: number;
  isSelf?: boolean;
  avatarUrl: string;
}

export interface ActivityLog {
  id: string;
  type: "story" | "challenge" | "chat" | "streak";
  title: string;
  detail: string;
  timeAgo: string;
  xpGained?: number;
}

export interface LanguageStatus {
  name: string;
  level: string;
  percent: number;
  badgeUrl?: string;
}
