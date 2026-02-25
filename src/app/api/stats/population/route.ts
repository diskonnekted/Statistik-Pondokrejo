import { NextResponse } from "next/server";
import { fetchOpenSIDStatistik } from "@/lib/api-helpers";

export async function GET() {
    // Data from official website (approximate/extracted)
    const mockFallbackData = {
        totalPenduduk: 4520,
        lakiLaki: 2200,
        perempuan: 2320,
        usia: {
            "0-5": 350,
            "6-12": 420,
            "13-17": 380,
            "18-60": 2850,
            ">60": 520
        },
        growth: 1.2, // Added for dashboard
    };

    const response = await fetchOpenSIDStatistik("/internal_api/statistik/penduduk", {
        cacheTags: ["opensid-data-penduduk"],
        fallbackData: mockFallbackData,
    });

    // Ensure the response structure is consistent whether from API or fallback
    const data = response.success ? response.data : mockFallbackData;

    return NextResponse.json(data);
}
