import type { ChatMessage } from "../parser/types";
import type { GroupEventStats } from "./groupEvents";

export type ChatSummary = {
  totalMessages: number;
  totalParticipants: number;

  recentMessages: number;
  activeParticipantsLast30Days: number;

  joinedCount: number;
  leftCount: number;
  addedCount: number;
  removedCount: number;
  changedNumberCount: number;
};

export function calculateChatSummary(
  messages: ChatMessage[],
  groupEventStats?: GroupEventStats,
  recentMessages: ChatMessage[] = []
): ChatSummary {
  const allMessageSenders = new Set(
    messages
      .filter((message) => message.sender && message.type !== "system")
      .map((message) => message.sender as string)
  );

  const detectedParticipants = new Set([
    ...allMessageSenders,
    ...(groupEventStats?.detectedParticipants ?? []),
  ]);

  const recentSenders = new Set(
    recentMessages
      .filter((message) => message.sender && message.type !== "system")
      .map((message) => message.sender as string)
  );

  return {
    totalMessages: messages.filter((message) => message.type !== "system").length,
    totalParticipants: detectedParticipants.size,

    recentMessages: recentMessages.filter((message) => message.type !== "system").length,
    activeParticipantsLast30Days: recentSenders.size,

    joinedCount: groupEventStats?.joinedCount ?? 0,
    leftCount: groupEventStats?.leftCount ?? 0,
    addedCount: groupEventStats?.addedCount ?? 0,
    removedCount: groupEventStats?.removedCount ?? 0,
    changedNumberCount: groupEventStats?.changedNumberCount ?? 0,
  };
}