export type GroupEventType =
  | "added"
  | "removed"
  | "joined"
  | "left"
  | "changed_number";

export type GroupEvent = {
  type: GroupEventType;
  actor?: string;
  target: string;
  rawLine: string;
};

export type GroupEventStats = {
  joinedCount: number;
  leftCount: number;
  addedCount: number;
  removedCount: number;
  changedNumberCount: number;
  detectedParticipants: string[];
  events: GroupEvent[];
};

function cleanParticipantName(name: string): string {
  return name
    .trim()
    .replace(/\u200e/g, "")
    .replace(/\u202a/g, "")
    .replace(/\u202c/g, "")
    .replace(/\.$/, "")
    .trim();
}

function isJunkParticipantName(name: string): boolean {
  const lower = name.toLowerCase();

  if (!name) return true;
  if (lower === "you") return true;

  // WhatsApp helper text after number-change events
  if (lower.includes("message or add the new number")) return true;
  if (lower.includes("a new number")) return true;

  // WhatsApp summary placeholders, not actual participants
  if (/^\d+\s+other[s]?$/.test(lower)) return true;
  if (/and\s+\d+\s+other[s]?/i.test(name)) return true;

  return false;
}

function splitParticipants(value: string): string[] {
  const cleaned = cleanParticipantName(value);

  return cleaned
    .replace(/,\s+and\s+/gi, ", ")
    .replace(/\s+and\s+/gi, ", ")
    .split(",")
    .map((part) => cleanParticipantName(part))
    .filter((part) => !isJunkParticipantName(part));
}

function addParticipant(set: Set<string>, name?: string) {
  if (!name) return;

  const participants = splitParticipants(name);

  for (const participant of participants) {
    if (!participant) continue;
    set.add(participant);
  }
}

function getSystemText(rawLine: string): string | null {
  const match = rawLine.match(/^.+?\s+-\s+(.*)$/);
  return match ? match[1].trim() : null;
}

function isNormalMessage(systemText: string): boolean {
  return systemText.includes(": ");
}

export function analyzeGroupEvents(rawText: string): GroupEventStats {
  const participants = new Set<string>();
  const events: GroupEvent[] = [];

  const lines = rawText.split(/\r?\n/);

  for (const line of lines) {
    const rawLine = line.trim();
    if (!rawLine) continue;

    const systemText = getSystemText(rawLine);
    if (!systemText) continue;

    // Normal messages look like "Alice: hello"
    // System messages usually do not have ": "
    if (isNormalMessage(systemText)) continue;

    let match: RegExpMatchArray | null;

    // Alice added Bob
    // You added Bob
    // Alice added Bob, Charlie, and 1 other
    match = systemText.match(/^(.+?) added (.+?)\.?$/i);
    if (match) {
      const actor = cleanParticipantName(match[1]);
      const target = cleanParticipantName(match[2]);

      addParticipant(participants, actor);
      addParticipant(participants, target);

      events.push({
        type: "added",
        actor,
        target,
        rawLine,
      });

      continue;
    }

    // Bob was added
    match = systemText.match(/^(.+?) was added\.?$/i);
    if (match) {
      const target = cleanParticipantName(match[1]);

      addParticipant(participants, target);

      events.push({
        type: "added",
        target,
        rawLine,
      });

      continue;
    }

    // Alice removed Bob
    // You removed Bob
    match = systemText.match(/^(.+?) removed (.+?)\.?$/i);
    if (match) {
      const actor = cleanParticipantName(match[1]);
      const target = cleanParticipantName(match[2]);

      addParticipant(participants, actor);
      addParticipant(participants, target);

      events.push({
        type: "removed",
        actor,
        target,
        rawLine,
      });

      continue;
    }

    // Bob was removed
    match = systemText.match(/^(.+?) was removed\.?$/i);
    if (match) {
      const target = cleanParticipantName(match[1]);

      addParticipant(participants, target);

      events.push({
        type: "removed",
        target,
        rawLine,
      });

      continue;
    }

    // Bob joined
    // Bob joined the group
    // Bob joined using this group's invite link
    // Bob joined via an invite link
    match = systemText.match(/^(.+?) joined(?:\s+.*)?\.?$/i);
    if (match) {
      const target = cleanParticipantName(match[1]);

      addParticipant(participants, target);

      events.push({
        type: "joined",
        target,
        rawLine,
      });

      continue;
    }

    // Bob left
    match = systemText.match(/^(.+?) left\.?$/i);
    if (match) {
      const target = cleanParticipantName(match[1]);

      addParticipant(participants, target);

      events.push({
        type: "left",
        target,
        rawLine,
      });

      continue;
    }

    // Bob changed their phone number to +39 123 456 7890.
    // Bob changed their phone number to +39 123 456 7890. Message or add the new number.
    match = systemText.match(
      /^(.+?) changed their phone number to (.+?)(?:\. Message or add the new number\.?)?$/i
    );
    if (match) {
      const oldNameOrNumber = cleanParticipantName(match[1]);
      const newNameOrNumber = cleanParticipantName(match[2]);

      addParticipant(participants, oldNameOrNumber);
      addParticipant(participants, newNameOrNumber);

      events.push({
        type: "changed_number",
        actor: oldNameOrNumber,
        target: newNameOrNumber,
        rawLine,
      });

      continue;
    }

    // Bob changed from +39 111 111 1111 to +39 222 222 2222
    match = systemText.match(/^(.+?) changed from (.+?) to (.+?)\.?$/i);
    if (match) {
      const actor = cleanParticipantName(match[1]);
      const oldNumber = cleanParticipantName(match[2]);
      const newNumber = cleanParticipantName(match[3]);

      addParticipant(participants, actor);
      addParticipant(participants, oldNumber);
      addParticipant(participants, newNumber);

      events.push({
        type: "changed_number",
        actor,
        target: newNumber,
        rawLine,
      });

      continue;
    }

    // +39 111 111 1111 changed to +39 222 222 2222
    match = systemText.match(/^(.+?) changed to (.+?)\.?$/i);
    if (match) {
      const oldNameOrNumber = cleanParticipantName(match[1]);
      const newNameOrNumber = cleanParticipantName(match[2]);

      addParticipant(participants, oldNameOrNumber);
      addParticipant(participants, newNameOrNumber);

      events.push({
        type: "changed_number",
        actor: oldNameOrNumber,
        target: newNameOrNumber,
        rawLine,
      });

      continue;
    }
  }

  return {
    joinedCount: events.filter((event) => event.type === "joined").length,
    leftCount: events.filter((event) => event.type === "left").length,
    addedCount: events.filter((event) => event.type === "added").length,
    removedCount: events.filter((event) => event.type === "removed").length,
    changedNumberCount: events.filter(
      (event) => event.type === "changed_number"
    ).length,
    detectedParticipants: Array.from(participants),
    events,
  };
}