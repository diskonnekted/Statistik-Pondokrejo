
import { NextResponse } from "next/server";
import { readStandardStatsExcel } from "@/lib/excel-helper";

export async function GET() {
  try {
    const data = readStandardStatsExcel("statistik_penduduk_24_02_2026_agama.xls");
    
    // In the inspected data: "ISLAM", "KRISTEN", "KATHOLIK", "BUDHA", "KHONGHUCU", "KEPERCAYAAN..."
    // "BELUM MENGISI": 0
    
    return NextResponse.json({
      success: true,
      data: data,
      source: "Excel: statistik_penduduk_24_02_2026_agama.xls"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}
