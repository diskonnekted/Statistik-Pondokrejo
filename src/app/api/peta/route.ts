import { NextRequest, NextResponse } from "next/server";
import { fetchOpenSIDPeta } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const proxyUrl = searchParams.get('url');

    // If 'url' param is present, act as a proxy for external GeoJSON/WFS data
    if (proxyUrl) {
        try {
            // Decode URL properly
            const decodedUrl = decodeURIComponent(proxyUrl);
            
            // Add headers to mimic browser
            const response = await fetch(decodedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Referer': 'https://geoportal.slemankab.go.id/',
                },
                // Add timeout
                signal: AbortSignal.timeout(15000) 
            });

            if (!response.ok) {
                console.error(`External API Error: ${response.status} ${response.statusText} for ${decodedUrl}`);
                throw new Error(`Failed to fetch external data: ${response.statusText}`);
            }
            
            const data = await response.json();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Proxy error for URL:", proxyUrl, error);
            // Return empty GeoJSON to prevent frontend crash
            return NextResponse.json({ 
                type: "FeatureCollection", 
                features: [] 
            });
        }
    }

    // Default behavior: Fetch OpenSID Peta
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
