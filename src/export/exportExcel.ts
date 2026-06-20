import * as XLSX from "xlsx";
import type { ParticipantStats } from "../parser/types";

export function exportStatsToExcel(stats: ParticipantStats[]) {
  const worksheet = XLSX.utils.json_to_sheet(stats);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Participant Stats");
  XLSX.writeFile(workbook, "whatsdown-stats.xlsx");
}