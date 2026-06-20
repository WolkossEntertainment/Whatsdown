import type { ChatMessage } from "./types";

export type WhatsAppMessage = {
  date: Date;
  sender: string;
  text: string;
};

const messageStartRegex =
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM|am|pm)?)\s+-\s+(.*)$/;

function parseDate(datePart: string, timePart: string): Date | null {
  const date = new Date(`${datePart} ${timePart}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function classifyMessage(text: string): ChatMessage["type"] {
  const lower = text.toLowerCase();

  if (
    lower.includes("<media omitted>") ||
    lower.includes("image omitted") ||
    lower.includes("video omitted") ||
    lower.includes("audio omitted") ||
    lower.includes("sticker omitted")
  ) {
    return "media";
  }

  return "message";
}

export function parseWhatsAppText(rawText: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const lines = rawText.split(/\r?\n/);

  let currentMessage: ChatMessage | null = null;

  for (const line of lines) {
    const match = line.match(messageStartRegex);

    if (match) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const [, datePart, timePart, content] = match;
      const separatorIndex = content.indexOf(": ");

      if (separatorIndex === -1) {
        currentMessage = {
          id: messages.length,
          timestamp: parseDate(datePart, timePart),
          sender: null,
          text: content,
          type: "system",
          raw: line,
        };
      } else {
        const sender = content.slice(0, separatorIndex);
        const text = content.slice(separatorIndex + 2);

        currentMessage = {
          id: messages.length,
          timestamp: parseDate(datePart, timePart),
          sender,
          text,
          type: classifyMessage(text),
          raw: line,
        };
      }
    } else if (currentMessage && line.trim() !== "") {
      currentMessage.text += `\n${line}`;
      currentMessage.raw += `\n${line}`;
    }
  }

  if (currentMessage) {
    messages.push(currentMessage);
  }

  return messages;
}