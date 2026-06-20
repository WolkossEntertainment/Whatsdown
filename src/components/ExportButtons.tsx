import type { ParticipantStats } from "../parser/types";
import { exportStatsToExcel } from "../export/exportExcel";
import { exportReportToPdf } from "../export/exportPdf";

type Props = {
  stats: ParticipantStats[];
};

export function ExportButtons({ stats }: Props) {
  async function handlePdfExport() {
    try {
      await exportReportToPdf("pdf-report");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    }
  }

  return (
    <div style={{ display: "flex", gap: "12px", margin: "24px 0" }}>
      <button onClick={handlePdfExport}>
        Export PDF
      </button>

      <button onClick={() => exportStatsToExcel(stats)}>
        Export Data Excel
      </button>
    </div>
  );
}