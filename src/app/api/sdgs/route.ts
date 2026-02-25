import { NextRequest, NextResponse } from "next/server";
import { fetchSDGSData, extractQueryParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    const params = extractQueryParams(request);
    const locationCode = params.locationCode || "3404140004";

    const response = await fetchSDGSData(locationCode);

    if (!response.success) {
        return NextResponse.json(
            {
                error: "Failed to fetch SDGS data",
                message: response.message,
                data: [],
            },
            { status: 500 }
        );
    }

    return NextResponse.json(response.data);
}
