export type ChatMessageType = "message" | "system" | "media";

export type ChatMessage = {
  id: number;
  timestamp: Date | null;
  sender: string | null;
  text: string;
  type: ChatMessageType;
  raw: string;
};

export type ParticipantStats = {
  sender: string;
  messageCount: number;
  wordCount: number;
  averageWordsPerMessage: number;
  mediaCount: number;
  lastActivityAgo: string;
  averageHour: string;
};

export type ChatSummary = {
  startDate: string;
  mostActiveDay: string;
  mostActiveHour: string;
  activeUsersLastMonth: number;
};