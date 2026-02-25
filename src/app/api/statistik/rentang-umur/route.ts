
import { NextResponse } from "next/server";
import { readStandardStatsExcel } from "@/lib/excel-helper";

export async function GET() {
  try {
    const data = readStandardStatsExcel("statistik_penduduk_24_02_2026 rentang_umur.xls");
    
    // In the inspected data: "BELUM MENGISI": 4329 (Huge!)
    // "0 S/D 1 TAHUN", "16 S/D 17 TAHUN", "18 S/D 27 TAHUN", "59 S/D 69 TAHUN"
    // The categories are sparse, but that's what the file provides.
    
    return NextResponse.json({
      success: true,
      data: data,
      source: "Excel: statistik_penduduk_24_02_2026 rentang_umur.xls"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}
