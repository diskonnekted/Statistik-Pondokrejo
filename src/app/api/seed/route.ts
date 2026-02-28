
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Create Summary Table
    await sql`
      CREATE TABLE IF NOT EXISTS sdgs_summary (
          id SERIAL PRIMARY KEY,
          meta_key VARCHAR(50) NOT NULL UNIQUE,
          meta_value VARCHAR(255) NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create Scores Table
    await sql`
      CREATE TABLE IF NOT EXISTS sdgs_scores (
          id SERIAL PRIMARY KEY,
          goals INT NOT NULL UNIQUE,
          title VARCHAR(255) NOT NULL,
          score DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          image VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Seed Summary Data
    await sql`
      INSERT INTO sdgs_summary (meta_key, meta_value) 
      VALUES ('average_score', '23.27') 
      ON CONFLICT (meta_key) DO NOTHING;
    `;
    await sql`
      INSERT INTO sdgs_summary (meta_key, meta_value) 
      VALUES ('total_desa', '1') 
      ON CONFLICT (meta_key) DO NOTHING;
    `;

    // 4. Seed Scores Data
    // We insert one by one or batch. Here is a batch-like approach but explicit for clarity
    // Since @vercel/postgres doesn't support massive batch insert syntax easily in tagged templates without helpers,
    // we use a loop or individual inserts for simplicity in this seed script.
    
    const scores = [
      { goals: 1, title: 'Desa Tanpa Kemiskinan', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-1.jpg' },
      { goals: 2, title: 'Desa Tanpa Kelaparan', score: 34.62, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-2.jpg' },
      { goals: 3, title: 'Desa Sehat dan Sejahtera', score: 60.53, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-3.jpg' },
      { goals: 4, title: 'Pendidikan Desa Berkualitas', score: 7.69, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-4.jpg' },
      { goals: 5, title: 'Keterlibatan Perempuan Desa', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-5.jpg' },
      { goals: 6, title: 'Desa Layak Air Bersih dan Sanitasi', score: 58.85, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-6.jpg' },
      { goals: 7, title: 'Desa Berenergi Bersih dan Terbarukan', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-7.jpg' },
      { goals: 8, title: 'Pertumbuhan Ekonomi Desa Merata', score: 50.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-8.jpg' },
      { goals: 9, title: 'Infrastruktur dan Inovasi Desa Sesuai Kebutuhan', score: 59.71, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-9.jpg' },
      { goals: 10, title: 'Desa Tanpa Kesenjangan', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-10.jpg' },
      { goals: 11, title: 'Kawasan Pemukiman Desa Aman dan Nyaman', score: 24.36, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-11.jpg' },
      { goals: 12, title: 'Konsumsi dan Produksi Desa Sadar Lingkungan', score: 3.85, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-12.jpg' },
      { goals: 13, title: 'Desa Tanggap Perubahan Iklim', score: 11.54, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-13.jpg' },
      { goals: 14, title: 'Desa Peduli Lingkungan Laut', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-14.jpg' },
      { goals: 15, title: 'Desa Peduli Lingkungan Darat', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-15.jpg' },
      { goals: 16, title: 'Desa Damai Berkeadilan', score: 100.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-16.jpg' },
      { goals: 17, title: 'Kemitraan untuk Pembangunan Desa', score: 0.00, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-17.jpg' },
      { goals: 18, title: 'Kelembagaan Desa Dinamis dan Budaya Desa Adaptif', score: 7.69, image: 'https://sid.kemendesa.go.id/website/skor-sdgs-18.jpg' },
    ];

    for (const item of scores) {
      await sql`
        INSERT INTO sdgs_scores (goals, title, score, image)
        VALUES (${item.goals}, ${item.title}, ${item.score}, ${item.image})
        ON CONFLICT (goals) DO NOTHING;
      `;
    }

    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
