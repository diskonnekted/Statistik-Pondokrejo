
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export interface StandardStatData {
  id: number;
  label: string;
  total: number;
  male: number;
  female: number;
}

export function readStandardStatsExcel(filename: string): StandardStatData[] {
  try {
    const filePath = path.join(process.cwd(), "public", filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filename}`);
      return [];
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = "Sheet2";
    
    if (!workbook.Sheets[sheetName]) {
        console.warn(`Sheet2 not found in ${filename}`);
        return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Data usually starts at row 1 (index 1), row 0 is header
    // Filter out rows that are summaries (JUMLAH, TOTAL, BELUM MENGISI) or empty
    // But sometimes "BELUM MENGISI" is a valid category to show.
    // For now, we will exclude "JUMLAH" and "TOTAL" rows which are usually aggregates.
    
    const statsData = rawData
      .slice(1) // Skip header
      .filter(row => {
        const label = row[1];
        // Filter out summary rows if they exist in the data list itself to avoid double counting
        // However, based on inspection, "JUMLAH" and "TOTAL" are at the bottom.
        // We want to keep "BELUM MENGISI" if it's relevant, but maybe separate it?
        // Let's keep everything except explicit "JUMLAH" and "TOTAL" totals.
        return label && 
               typeof label === 'string' && 
               !label.includes("JUMLAH") && 
               !label.includes("TOTAL");
      })
      .map((row, index) => ({
        id: typeof row[0] === 'number' ? row[0] : index + 1,
        label: String(row[1]).trim(),
        total: Number(row[2]) || 0,
        male: Number(row[3]) || 0,
        female: Number(row[4]) || 0
      }));

    return statsData;
  } catch (error) {
    console.error(`Error reading Excel ${filename}:`, error);
    return [];
  }
}
