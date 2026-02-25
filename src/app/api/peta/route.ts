import { NextResponse } from "next/server";
import { fetchOpenSIDPeta } from "@/lib/api-helpers";

export async function GET() {
    const response = await fetchOpenSIDPeta();

    if (!response.success) {
        return NextResponse.json(
            {
                error: "Failed to fetch Peta data",
                message: response.message,
                data: [],
            },
            { status: 500 }
        );
    }

    return NextResponse.json(response.data);
}
