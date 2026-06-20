import type { ParticipantStats } from "../parser/types";

type Props = {
  stats: ParticipantStats[];
  exportMode?: boolean;
};

export function StatsTable({ stats, exportMode = false }: Props) {
  return (
    <div
      style={{
        maxHeight: exportMode ? "none" : "460px",
        overflowY: exportMode ? "visible" : "auto",
        border: "1px solid #ccc",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead
          style={{
            position: exportMode ? "static" : "sticky",
            top: 0,
            background: "white",
          }}
        >
          <tr>
            <th>Participant</th>
            <th>Messages</th>
            <th>Words</th>
            <th>Avg words</th>
            <th>Media</th>
            <th>Last activity</th>
            <th>Avg time</th>
          </tr>
        </thead>

        <tbody>
          {stats.map((row) => (
            <tr key={row.sender}>
              <td>{row.sender}</td>
              <td>{row.messageCount}</td>
              <td>{row.wordCount}</td>
              <td>{row.averageWordsPerMessage}</td>
              <td>{row.mediaCount}</td>
              <td>{row.lastActivityAgo}</td>
              <td>{row.averageHour}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}