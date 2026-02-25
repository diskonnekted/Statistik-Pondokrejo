export interface IdmIndicator {
  no: number;
  indikator: string;
  skor: number;
  keterangan: string;
  kegiatan: string;
  nilai: string | number;
  pelaksana: {
    pusat: string;
    provinsi: string;
    kabupaten: string;
    desa: string;
    csr: string;
    lainnya: string;
  };
}
