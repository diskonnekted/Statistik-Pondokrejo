import React from "react";
import { fetchIDMData } from "@/lib/api-helpers";
import { getIdmIndicators } from "@/lib/idm-service";
import IDMClient from "./IDMClient";

export const metadata = {
  title: "Indeks Desa Membangun (IDM) | Kalurahan Pondokrejo",
  description: "Data Indeks Desa Membangun Kalurahan Pondokrejo",
};

export default async function IdmPage(props: {
  searchParams: Promise<{ year?: string }>;
}) {
  const searchParams = await props.searchParams;
  const year = searchParams.year || '2024';
  
  // Fetch data in parallel
  const [response, iksData, ikeData, iklData] = await Promise.all([
    fetchIDMData(year),
    getIdmIndicators('IKS'),
    getIdmIndicators('IKE'),
    getIdmIndicators('IKL')
  ]);

  return (
    <IDMClient 
      data={response} 
      year={year} 
      iksData={iksData} 
      ikeData={ikeData} 
      iklData={iklData} 
    />
  );
}