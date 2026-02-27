import React from "react";
import { fetchSDGSData } from "@/lib/api-helpers";
import SDGSClient from "./SDGSClient";

export const metadata = {
  title: "SDGs Desa | Kalurahan Pondokrejo",
  description: "Pencapaian Sustainable Development Goals (SDGs) Kalurahan Pondokrejo",
};

export default async function SdgsPage() {
  let response;
  try {
    response = await fetchSDGSData();
  } catch (error) {
    console.error("Critical error in SdgsPage:", error);
    // Absolute fallback to prevent 500/crash
    response = {
      success: true,
      data: {
        average: "0.00",
        total_desa: 1,
        data: []
      },
      message: "Data loaded from emergency fallback"
    };
  }
  
  // Extract data array safely
  // API response structure: { average: string, data: Array, total_desa: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sdgsItems = (response.data as any)?.data || [];
  const averageScore = (response.data as any)?.average || 0;

  return (
    <SDGSClient 
      data={sdgsItems} 
      averageScore={averageScore} 
      success={response.success} 
      message={response.message} 
    />
  );
}
