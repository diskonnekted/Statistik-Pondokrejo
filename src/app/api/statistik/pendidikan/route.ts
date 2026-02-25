import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "pendidikan-dalam-kk-statistik_penduduk_24_02_2026.xls");
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        success: false, 
        message: "File not found" 
      }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    const sheetName = "Sheet2"; // Validated from inspection
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return NextResponse.json({ 
        success: false, 
        message: "Sheet2 not found in excel file" 
      }, { status: 500 });
    }

    // Read as array of arrays
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Filter valid rows (starting from row 1, index 1)
    // Structure: [No, Label, Total, Male, Female]
    const educationData = rawData
      .slice(1) // Skip header
      .filter(row => row[1] && typeof row[0] === 'number') // Ensure valid data row
      .map(row => ({
        id: row[0],
        label: row[1],
        total: Number(row[2]) || 0,
        male: Number(row[3]) || 0,
        female: Number(row[4]) || 0
      }));

    return NextResponse.json({
      success: true,
      data: educationData,
      source: "Excel: pendidikan-dalam-kk-statistik_penduduk_24_02_2026.xls"
    });

  } catch (error) {
    console.error("Error reading education stats:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
