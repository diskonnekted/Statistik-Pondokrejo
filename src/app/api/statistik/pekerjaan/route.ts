import { NextResponse } from "next/server";
import { DATA_PEKERJAAN } from "@/lib/data-pekerjaan";

export async function GET() {
  try {
    // Return static data provided by user
    return NextResponse.json({
      success: true,
      data: DATA_PEKERJAAN,
      source: "Manual Input: User Provided Data"
    });

  } catch (error) {
    console.error("Error reading occupation stats:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
