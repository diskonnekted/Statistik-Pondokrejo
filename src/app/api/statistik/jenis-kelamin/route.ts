
import { NextResponse } from "next/server";
import { readStandardStatsExcel } from "@/lib/excel-helper";

export async function GET() {
  try {
    const data = readStandardStatsExcel("statistik_penduduk_24_02_2026_jenis_kelamin.xls");
    
    // Filter out "BELUM MENGISI" if desired, but let's keep it for completeness
    // Actually, "BELUM MENGISI" for gender is weird (usually everyone has one).
    // In the inspected data: "BELUM MENGISI": 14.
    
    return NextResponse.json({
      success: true,
      data: data,
      source: "Excel: statistik_penduduk_24_02_2026_jenis_kelamin.xls"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}
