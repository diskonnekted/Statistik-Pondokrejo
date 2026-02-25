import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3A3404_50kb_ar_jumlah_penduduk_thn_2015_2019_&outputFormat=application%2Fjson";
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from GeoPortal: ${response.statusText}`);
    }

    const data = await response.json();

    // Find Pondokrejo feature (case insensitive)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pondokrejoFeature = data.features.find((f: any) => 
      f.properties.kalurahan?.toLowerCase() === "pondokrejo" && 
      (f.properties.kapanewon?.toLowerCase() === "tempel" || f.properties.kecamatan?.toLowerCase() === "tempel")
    );

    if (!pondokrejoFeature) {
      return NextResponse.json({ 
        success: false, 
        message: "Data for Pondokrejo (Tempel) not found in GeoPortal response" 
      }, { status: 404 });
    }

    const props = pondokrejoFeature.properties;

    // Extract population data dynamically for years 2015-2025
    const populationHistory = [];
    for (let year = 2015; year <= 2025; year++) {
      const key = `p_${year}`;
      if (props[key] !== undefined && props[key] !== null) {
        populationHistory.push({
          year: year.toString(),
          value: Number(props[key])
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "GeoPortal Sleman",
      location: {
        kalurahan: props.kalurahan,
        kapanewon: props.kapanewon,
        kabupaten: props.kabupaten,
        provinsi: props.provinsi
      },
      data: populationHistory
    });

  } catch (error) {
    console.error("Error fetching external population data:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
