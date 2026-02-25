import { NextRequest, NextResponse } from "next/server";
import { fetchOpenSIDStatistikById } from "@/lib/api-helpers";

// Mapping of route parameter ID to OpenSID statistik ID
// These are typical IDs, might need adjustment based on specific OpenSID installation
const STAT_MAPPING: Record<string, number> = {
    "pendidikan-kk": 0,
    "pendidikan-sedang": 1,
    "pekerjaan": 2,
    "agama": 3,
    "jenis-kelamin": 4,
    "umur": 13,
    "golongan-darah": 15,
    "cacat": 17,
};

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    
    // Check if the requested ID is in our mapping or is a direct numeric ID
    const mappingId = STAT_MAPPING[id];
    let statistikId = mappingId;
    
    if (statistikId === undefined) {
        // Try to parse as number if not in mapping
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
            statistikId = numericId;
        } else {
             return NextResponse.json(
                { error: "Invalid statistic ID" },
                { status: 400 }
            );
        }
    }

    const response = await fetchOpenSIDStatistikById(statistikId, id);

    if (!response.success) {
        return NextResponse.json(
            {
                error: `Failed to fetch statistic data for ${id}`,
                message: response.message,
                data: [],
            },
            { status: 500 }
        );
    }

    return NextResponse.json(response.data);
}
