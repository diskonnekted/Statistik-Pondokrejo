// Data Kependudukan Kalurahan Pondokrejo per Padukuhan
// Source: User provided valid data (Cross check)

export interface PadukuhanData {
    no: number;
    nama: string;
    ketua: string;
    kk: number;
    total: number;
    laki: number;
    perempuan: number;
}

export const DATA_PADUKUHAN: PadukuhanData[] = [
    { no: 1, nama: "Padukuhan Banjarharjo", ketua: "TAOQID DWI PANAMA", kk: 198, total: 605, laki: 284, perempuan: 321 },
    { no: 2, nama: "Padukuhan Dukuh", ketua: "TOYIB", kk: 225, total: 640, laki: 330, perempuan: 310 },
    { no: 3, nama: "Padukuhan Glagahombo", ketua: "BASYORI", kk: 230, total: 743, laki: 359, perempuan: 384 },
    { no: 4, nama: "Padukuhan Jlapan", ketua: "LILIK SULISTIYO", kk: 288, total: 895, laki: 440, perempuan: 455 },
    { no: 5, nama: "Padukuhan Jlopo", ketua: "FATKHUROHMAN", kk: 170, total: 510, laki: 271, perempuan: 239 },
    { no: 6, nama: "Padukuhan Karanglo", ketua: "LUVI HENDRIYANI", kk: 141, total: 421, laki: 205, perempuan: 216 },
    { no: 7, nama: "Padukuhan Ngentak", ketua: "HASYIM AS'ARI", kk: 227, total: 732, laki: 369, perempuan: 363 },
    { no: 8, nama: "Padukuhan Plotengan", ketua: "M YUSRO", kk: 167, total: 537, laki: 267, perempuan: 270 },
    { no: 9, nama: "Padukuhan Watupecah", ketua: "KURYADI", kk: 111, total: 354, laki: 171, perempuan: 183 },
    { no: 10, nama: "Padukuhan Mlesan Balan", ketua: "KURYADI", kk: 72, total: 225, laki: 116, perempuan: 109 },
    { no: 11, nama: "Padukuhan Badalan", ketua: "M YUSRO", kk: 117, total: 330, laki: 163, perempuan: 167 },
    { no: 12, nama: "Padukuhan Jenengan", ketua: "KURYADI", kk: 104, total: 317, laki: 148, perempuan: 169 },
];

export const TOTAL_PENDUDUK = {
    kk: 2050,
    total: 6309,
    laki: 3123,
    perempuan: 3186
};
