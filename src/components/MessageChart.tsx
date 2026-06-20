import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { ParticipantStats } from "../parser/types";

type Props = {
  stats: ParticipantStats[];
};

export function MessageChart({ stats }: Props) {
  const data = stats.map((row) => ({
    name: row.sender,
    messages: row.messageCount,
  }));

    return (
    <section style={{ width: "100%", height: "420px", marginTop: "32px" }}>
        <h2>Messages by participant</h2>

        <div style={{ width: "100%", height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="messages" fill="#646cff" />
            </BarChart>
        </ResponsiveContainer>
        </div>
    </section>
    );
}