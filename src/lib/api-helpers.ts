import { NextRequest } from "next/server";
import { opensidApi, sdgsApi } from "./api-service";
import { IDM_2024_DATA } from "./idm-data-static";

/**
 * Common query parameter extraction
 */
export function extractQueryParams(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    return {
        page: parseInt(searchParams.get("halaman") || searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || undefined,
        category: searchParams.get("kategori") || searchParams.get("category") || undefined,
        year: searchParams.get("year") || undefined,
        locationCode: searchParams.get("location_code") || undefined,
        allParams: Object.fromEntries(searchParams.entries()),
    };
}

/**
 * OpenSID statistik API helper
 */
export async function fetchOpenSIDStatistik(endpoint: string, config?: { cacheTags?: string[]; fallbackData?: unknown }) {
    // If endpoint doesn't start with /, ensure it does, but wait, the usage in repo is `/internal_api/statistik/penduduk`
    // My previous code expected just the suffix.
    // The repo passes the full path from the base URL.
    // So if I call it with `/internal_api/statistik/penduduk`, it should work.
    
    const response = await opensidApi.get(endpoint, {
        cache: {
            revalidate: 3600,
            tags: config?.cacheTags,
        },
    });

    // Return fallback data if request fails
    if (!response.success && config?.fallbackData) {
        console.warn(`OpenSID API failed for ${endpoint}, using fallback data`);
        return {
            ...response,
            success: true,
            data: config.fallbackData,
        };
    }

    return response;
}

/**
 * OpenSID statistik by ID helper (for statistik/{id} endpoints)
 */
export async function fetchOpenSIDStatistikById(
    statistikId: string | number,
    dataType: string,
    config?: { fallbackData?: unknown }
) {
    const endpoint = `/internal_api/statistik/${statistikId}`;
    return fetchOpenSIDStatistik(endpoint, {
        cacheTags: [`opensid-data-${dataType}`],
        fallbackData: config?.fallbackData || [],
    });
}

/**
 * OpenSID wilayah API helper
 */
export async function fetchOpenSIDWilayah() {
    return opensidApi.get("/internal_api/wilayah/administratif", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-wilayah"],
        },
    });
}

/**
 * OpenSID peta API helper
 */
export async function fetchOpenSIDPeta() {
    return opensidApi.get("/internal_api/peta", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-peta"],
        },
    });
}

/**
 * SDGS API helper with explicit location codes
 */
export async function fetchSDGSData(
    provinceCode = "34", 
    cityCode = "3404", 
    districtCode = "3404140", 
    villageCode = "3404140004"
) {
    // URL format: /sdgs/searching/score-sdgs?province_code=62&city_code=6201&district_code=6201050&village_code=6201050016
    // Note: We must also include location_code (which is the same as villageCode) to avoid 500 Internal Server Error
    return sdgsApi.get(`/sdgs/searching/score-sdgs?province_code=${provinceCode}&city_code=${cityCode}&district_code=${districtCode}&village_code=${villageCode}&location_code=${villageCode}`, {
        cache: {
            revalidate: 60 * 60 * 24 * 30, // 30 days
            tags: ["sdgs-data"],
        },
    });
}

/**
 * IDM API helper with year parameter
 */
export async function fetchIDMData(year = "2024") {
    // If year is 2024, return static data immediately as requested by user
    if (year === "2024") {
        return {
            success: true,
            data: IDM_2024_DATA,
            message: "Data retrieved from static source",
            status: 200
        };
    }

    // Try requested year with 0 retries to avoid log spam on 404
    let response = await opensidApi.get(`/internal_api/idm/${year}`, {
        cache: {
            revalidate: 60 * 60 * 24 * 30, // 30 days
            tags: ["idm-data"],
        },
        retries: 0, // Don't retry on 404
        silent: true // Suppress console error on 404
    });

    // If failed (likely 404) and year is current year, try previous year automatically
    if (!response.success && year === new Date().getFullYear().toString()) {
         const prevYear = (parseInt(year) - 1).toString();
         console.log(`IDM data for ${year} not found, retrying with ${prevYear}`);
         response = await opensidApi.get(`/internal_api/idm/${prevYear}`, {
            cache: {
                revalidate: 60 * 60 * 24 * 30, // 30 days
                tags: ["idm-data"],
            },
        });
    }
    
    return response;
}

/**
 * OpenSID government API helper
 */
export async function fetchOpenSIDPemerintah() {
    return opensidApi.get("/internal_api/pemerintah", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-pemerintah"],
        },
    });
}

/**
 * OpenSID pembangunan API helper
 */
export async function fetchOpenSIDPembangunan() {
    return opensidApi.get("/internal_api/pembangunan", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-pembangunan"],
        },
    });
}

/**
 * OpenSID PPID API helper
 */
export async function fetchOpenSIDPPID() {
    return opensidApi.get("/internal_api/informasi-publik", {
        cache: {
            revalidate: 3600,
            tags: ["opensid-data-ppid"],
        },
    });
}

/**
 * OpenSID pengaduan API helper
 */
export async function fetchOpenSIDPengaduan() {
    return opensidApi.get("/internal_api/pengaduan", {
        cache: {
            revalidate: 300, // 5 minutes for complaints
            tags: ["opensid-data-pengaduan"],
        },
    });
}
