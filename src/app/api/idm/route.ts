import { NextRequest, NextResponse } from "next/server";
import { fetchIDMData, extractQueryParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    const params = extractQueryParams(request);
    const year = params.year || new Date().getFullYear().toString();

    const response = await fetchIDMData(year);

    if (!response.success) {
        return NextResponse.json(
            {
                error: "Failed to fetch IDM data",
                message: response.message,
                data: null,
            },
            { status: 500 }
        );
    }

    return NextResponse.json(response.data);
}
