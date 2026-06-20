type SummarySentenceProps = {
  summary: {
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
};

export function SummarySentence({ summary }: SummarySentenceProps) {
  return (
    <p>
      This export contains <strong>{summary.totalMessages}</strong> messages from{" "}
      <strong>{summary.totalParticipants}</strong> detected participants. In the
      last 30 days, <strong>{summary.activeParticipantsLast30Days}</strong>{" "}
      participants sent <strong>{summary.recentMessages}</strong> messages. Since
      the beginning of the export, <strong>{summary.joinedCount}</strong> people
      joined, <strong>{summary.leftCount}</strong> left,{" "}
      <strong>{summary.addedCount}</strong> were added,{" "}
      <strong>{summary.removedCount}</strong> were removed, and{" "}
      <strong>{summary.changedNumberCount}</strong> number changes were detected.
    </p>
  );
}