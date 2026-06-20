import type { ChatMessage, ParticipantStats } from "../parser/types";

function createEmptyParticipantStats(sender: string): ParticipantStats {
  return {
    sender,
    messageCount: 0,
    wordCount: 0,
    averageWordsPerMessage: 0,
    mediaCount: 0,
    lastActivityAgo: "No messages",
    averageHour: "",
  };
}

export function calculateParticipantStats(
  messages: ChatMessage[],
  detectedParticipants: string[] = []
): ParticipantStats[] {
  const statsMap = new Map<string, ParticipantStats>();

  for (const participant of detectedParticipants) {
    const sender = participant.trim();

    if (!sender) continue;

    statsMap.set(sender, createEmptyParticipantStats(sender));
  }

  for (const message of messages) {
    if (!message.sender) continue;
    if (message.type === "system") continue;

    const sender = message.sender.trim();

    if (!statsMap.has(sender)) {
      statsMap.set(sender, createEmptyParticipantStats(sender));
    }

    const participantStats = statsMap.get(sender)!;

    participantStats.messageCount += 1;

    if (message.type === "media") {
      participantStats.mediaCount += 1;
    }

    const words = message.text.trim().split(/\s+/).filter(Boolean);
    participantStats.wordCount += words.length;

const averageWords =
  participantStats.messageCount === 0
    ? 0
    : participantStats.wordCount / participantStats.messageCount;

participantStats.averageWordsPerMessage = Number(averageWords.toFixed(1));

    if (message.timestamp) {
      participantStats.lastActivityAgo = message.timestamp.toLocaleDateString();

      const hour = message.timestamp.getHours();
      participantStats.averageHour = String(hour);
    }
  }

  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.messageCount !== a.messageCount) {
      return b.messageCount - a.messageCount;
    }

    return a.sender.localeCompare(b.sender);
  });
}