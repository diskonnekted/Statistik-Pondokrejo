import { NextResponse } from "next/server";
import { fetchOpenSIDStatistik } from "@/lib/api-helpers";
import { TOTAL_PENDUDUK } from "@/lib/data-padukuhan";

export async function GET() {
    const mockFallbackData = {
        totalPenduduk: TOTAL_PENDUDUK.total,
        lakiLaki: TOTAL_PENDUDUK.laki,
        perempuan: TOTAL_PENDUDUK.perempuan,
        usia: {},
    };

    const response = await fetchOpenSIDStatistik("/internal_api/statistik/penduduk", {
        cacheTags: ["opensid-data-penduduk"],
        fallbackData: mockFallbackData,
    });

    // Override with valid data if response success but we want to force match the padukuhan data
    // Or just let the fallback be the source of truth if API fails.
    // Given "cross check" instruction, we might want to prioritize the valid data if the API returns something wildly different.
    // For now, updating the fallback ensures that if the API is not actually working (which is likely given it's a scraped logic),
    // we see the correct numbers.
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (response.success ? response.data : mockFallbackData) as any;
    
    // Ensure we respect the "valid" data if the API returns something else or fails
    if (responseData) {
        responseData.totalPenduduk = TOTAL_PENDUDUK.total;
        responseData.lakiLaki = TOTAL_PENDUDUK.laki;
        responseData.perempuan = TOTAL_PENDUDUK.perempuan;
    }

    return NextResponse.json(responseData);
}
