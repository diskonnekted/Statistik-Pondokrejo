import React from "react";
import { Metadata } from "next";
import EkonomiClient from "./EkonomiClient";

export const metadata: Metadata = {
  title: "Statistik Ekonomi | Kalurahan Pondokrejo",
  description: "Data statistik ekonomi, UMKM, dan potensi pengembangan di Kalurahan Pondokrejo, Kapanewon Tempel, Sleman.",
};

export default function EkonomiPage() {
  return <EkonomiClient />;
}
