import type { ParticipantStats } from "../parser/types";
import { exportStatsToExcel } from "../export/exportExcel";
import { exportReportToPdf } from "../export/exportPdf";

type Props = {
  stats: ParticipantStats[];
};

export function ExportButtons({ stats }: Props) {
  return (
    <div style={{ display: "flex", gap: "12px", margin: "24px 0" }}>
      <button onClick={() => exportReportToPdf("pdf-report")}>
        Export PDF
      </button>

      <button onClick={() => exportStatsToExcel(stats)}>
        Export Data Excel
      </button>
    </div>
  );
}