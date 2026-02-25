
export interface OccupationData {
  id: number;
  label: string;
  total: number;
  male: number;
  female: number;
}

export const DATA_PEKERJAAN: OccupationData[] = [
  { id: 1, label: "BELUM/TIDAK BEKERJA", total: 1321, male: 656, female: 663 },
  { id: 2, label: "MENGURUS RUMAH TANGGA", total: 973, male: 2, female: 970 },
  { id: 3, label: "PELAJAR/MAHASISWA", total: 1195, male: 631, female: 563 },
  { id: 4, label: "PENSIUNAN", total: 64, male: 52, female: 12 },
  { id: 5, label: "PEGAWAI NEGERI SIPIL (PNS)", total: 117, male: 60, female: 57 },
  { id: 6, label: "TENTARA NASIONAL INDONESIA (TNI)", total: 15, male: 15, female: 0 },
  { id: 7, label: "KEPOLISIAN RI (POLRI)", total: 22, male: 21, female: 1 },
  { id: 9, label: "PETANI/PEKEBUN", total: 33, male: 10, female: 23 },
  { id: 10, label: "PETERNAK", total: 3, male: 2, female: 1 },
  { id: 12, label: "INDUSTRI", total: 1, male: 1, female: 0 },
  { id: 13, label: "KONSTRUKSI", total: 1, male: 0, female: 1 },
  { id: 15, label: "KARYAWAN SWASTA", total: 650, male: 393, female: 253 },
  { id: 16, label: "KARYAWAN BUMN", total: 7, male: 5, female: 2 },
  { id: 18, label: "KARYAWAN HONORER", total: 35, male: 17, female: 18 },
  { id: 19, label: "BURUH HARIAN LEPAS", total: 718, male: 579, female: 138 },
  { id: 20, label: "BURUH TANI/PERKEBUNAN", total: 563, male: 302, female: 258 },
  { id: 25, label: "TUKANG LISTRIK", total: 1, male: 1, female: 0 },
  { id: 26, label: "TUKANG BATU", total: 17, male: 17, female: 0 },
  { id: 27, label: "TUKANG KAYU", total: 16, male: 16, female: 0 },
  { id: 28, label: "TUKANG SOL SEPATU", total: 1, male: 1, female: 0 },
  { id: 29, label: "TUKANG LAS/PANDAI BESI", total: 2, male: 2, female: 0 },
  { id: 30, label: "TUKANG JAHIT", total: 9, male: 2, female: 7 },
  { id: 32, label: "PENATA RIAS", total: 1, male: 0, female: 1 },
  { id: 35, label: "MEKANIK", total: 6, male: 5, female: 1 },
  { id: 36, label: "SENIMAN", total: 2, male: 2, female: 0 },
  { id: 64, label: "DOSEN", total: 6, male: 5, female: 1 },
  { id: 65, label: "GURU", total: 50, male: 13, female: 37 },
  { id: 72, label: "DOKTER", total: 2, male: 0, female: 2 },
  { id: 73, label: "BIDAN", total: 9, male: 0, female: 9 },
  { id: 74, label: "PERAWAT", total: 9, male: 2, female: 7 },
  { id: 81, label: "SOPIR", total: 47, male: 47, female: 0 },
  { id: 84, label: "PEDAGANG", total: 109, male: 35, female: 74 },
  { id: 85, label: "PERANGKAT DESA", total: 17, male: 14, female: 3 },
  { id: 86, label: "KEPALA DESA", total: 1, male: 1, female: 0 },
  { id: 88, label: "WIRASWASTA", total: 275, male: 199, female: 76 },
  { id: 89, label: "LAINNYA", total: 23, male: 15, female: 8 },
  { id: 99, label: "BELUM MENGISI", total: 2, male: 0, female: 0 }
];
