import { query } from './db';
import type { IdmIndicator } from '@/types/idm';

export type { IdmIndicator };

export async function getIdmIndicators(category: 'IKS' | 'IKE' | 'IKL'): Promise<IdmIndicator[]> {
  const sql = `
    SELECT 
      no, 
      indikator, 
      skor, 
      keterangan, 
      kegiatan, 
      nilai, 
      pelaksana_pusat, 
      pelaksana_provinsi, 
      pelaksana_kabupaten, 
      pelaksana_desa, 
      pelaksana_csr, 
      pelaksana_lainnya 
    FROM idm_indicators 
    WHERE category = ? 
    ORDER BY no ASC
  `;
  
  const rows = await query(sql, [category]) as any[];
  
  return rows.map(row => ({
    no: row.no,
    indikator: row.indikator,
    skor: row.skor,
    keterangan: row.keterangan || '-',
    kegiatan: row.kegiatan || '-',
    nilai: row.nilai,
    pelaksana: {
      pusat: row.pelaksana_pusat || '-',
      provinsi: row.pelaksana_provinsi || '-',
      kabupaten: row.pelaksana_kabupaten || '-',
      desa: row.pelaksana_desa || '-',
      csr: row.pelaksana_csr || '-',
      lainnya: row.pelaksana_lainnya || '-'
    }
  }));
}
