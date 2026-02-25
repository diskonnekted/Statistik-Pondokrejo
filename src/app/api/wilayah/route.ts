import { NextRequest, NextResponse } from "next/server";
import { fetchOpenSIDWilayah, extractQueryParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    extractQueryParams(request); // Extract but don't use page for now

    const response = await fetchOpenSIDWilayah();

    if (!response.success) {
        return NextResponse.json(
            {
                error: "Failed to fetch wilayah data",
                message: response.message,
                data: [],
            },
            { status: 500 }
        );
    }

    return NextResponse.json(response.data);
}
