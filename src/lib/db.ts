import { sql } from '@vercel/postgres';

export async function query(queryString: string, params?: any[]) {
  try {
    // Convert MySQL ? placeholders to Postgres $1, $2, etc.
    let paramIndex = 1;
    const pgQuery = queryString.replace(/\?/g, () => `$${paramIndex++}`);
    
    // Execute query using Vercel Postgres
    // Vercel Postgres returns { rows: [], fields: [] }
    const result = await sql.query(pgQuery, params);
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

// Mock pool for backward compatibility if needed, but better to remove usage
export default {
  execute: async (q: string, p?: any[]) => {
    const rows = await query(q, p);
    return [rows, []]; // Mimic mysql2 [rows, fields] return signature
  }
};
