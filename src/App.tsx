import { useMemo, useState } from "react";
import "./App.css";

import { parseWhatsAppText } from "./parser/parseWhatsAppText";
import { calculateParticipantStats } from "./analysis/participation";
import { StatsTable } from "./components/StatsTable";
import { FileDropzone } from "./components/FileDropzone";
import { MessageChart } from "./components/MessageChart";
import { ExportButtons } from "./components/ExportButtons";
import { calculateChatSummary } from "./analysis/summary";
import { SummarySentence } from "./components/SummarySentence";
import logo from "./assets/whatsdown-logo.png";
import { analyzeGroupEvents } from "./analysis/groupEvents";
import type { ChatMessage } from "./parser/types";

function getRecentMessages(messages: ChatMessage[]) {
  const now = new Date();
  const cutoff = new Date(now);

  cutoff.setDate(cutoff.getDate() - 30);

  return messages.filter((message) => {
    if (!message.timestamp) return false;
    if (message.type === "system") return false;

    return message.timestamp >= cutoff;
  });
}

function App() {
  const [rawText, setRawText] = useState("");

  const messages = useMemo(() => parseWhatsAppText(rawText), [rawText]);

  const recentMessages = useMemo(
    () => getRecentMessages(messages),
    [messages]
  );

  const groupEventStats = useMemo(
    () => analyzeGroupEvents(rawText),
    [rawText]
  );

const stats = useMemo(
  () =>
    calculateParticipantStats(
      messages,
      groupEventStats.detectedParticipants
    ),
  [messages, groupEventStats.detectedParticipants]
);

  const summary = useMemo(
    () => calculateChatSummary(messages, groupEventStats, recentMessages),
    [messages, groupEventStats, recentMessages]
  );

  return (
    <main style={{ padding: "24px" }}>
      <header className="app-header">
        <img src={logo} alt="WhatsDown logo" className="app-logo" />
        <span className="app-title">WhatsDown</span>
        <p>
          is a private WhatsApp chat analysis. No upload. No storage. Only you
          see your data.
        </p>
      </header>

      <FileDropzone onTextLoaded={setRawText} />

      {stats.length > 0 && (
        <>
          <ExportButtons stats={stats} />

          <div id="pdf-report">
            <SummarySentence summary={summary} />

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
                alignItems: "start",
                marginTop: "32px",
              }}
            >
              <div>
                <h2>Participant statistics</h2>
                <StatsTable stats={stats} exportMode />
              </div>

              <div>
                <MessageChart stats={stats} />
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

export default App;