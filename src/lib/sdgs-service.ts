
import { query } from './db';

export interface SdgsScore {
  goals: number;
  title: string;
  score: number;
  image: string;
  description?: string;
}

export interface SdgsData {
  average: number;
  total_desa: number;
  data: SdgsScore[];
}

export async function getSdgsDataFromDb(): Promise<SdgsData | null> {
  try {
    // Fetch summary data
    const summarySql = `SELECT meta_key, meta_value FROM sdgs_summary`;
    const summaryRows = await query(summarySql) as any[];
    
    const summaryMap = new Map();
    summaryRows.forEach(row => {
      summaryMap.set(row.meta_key, row.meta_value);
    });

    const average = parseFloat(summaryMap.get('average_score') || '0');
    const total_desa = parseInt(summaryMap.get('total_desa') || '1');

    // Fetch scores
    const scoresSql = `SELECT goals, title, score, image, description FROM sdgs_scores ORDER BY goals ASC`;
    const scoreRows = await query(scoresSql) as any[];

    const data: SdgsScore[] = scoreRows.map(row => ({
      goals: row.goals,
      title: row.title,
      score: parseFloat(row.score),
      image: row.image,
      description: row.description || undefined
    }));

    // Check if we have data
    if (data.length === 0) {
        return null;
    }

    return {
      average,
      total_desa,
      data
    };
  } catch (error) {
    console.error("Error fetching SDGs data from database:", error);
    return null;
  }
}
