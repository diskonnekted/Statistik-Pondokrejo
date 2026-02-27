
-- Create table for SDGs scores
CREATE TABLE IF NOT EXISTS sdgs_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goals INT NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    score DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for SDGs summary (like average score)
CREATE TABLE IF NOT EXISTS sdgs_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meta_key VARCHAR(50) NOT NULL UNIQUE,
    meta_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clear existing data to avoid duplicates on re-run
TRUNCATE TABLE sdgs_scores;
TRUNCATE TABLE sdgs_summary;

-- Insert Average Score
INSERT INTO sdgs_summary (meta_key, meta_value) VALUES ('average_score', '23.27');
INSERT INTO sdgs_summary (meta_key, meta_value) VALUES ('total_desa', '1');

-- Insert Scores
INSERT INTO sdgs_scores (goals, title, score, image) VALUES
(1, 'Desa Tanpa Kemiskinan', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-1.jpg'),
(2, 'Desa Tanpa Kelaparan', 34.62, 'https://sid.kemendesa.go.id/website/skor-sdgs-2.jpg'),
(3, 'Desa Sehat dan Sejahtera', 60.53, 'https://sid.kemendesa.go.id/website/skor-sdgs-3.jpg'),
(4, 'Pendidikan Desa Berkualitas', 7.69, 'https://sid.kemendesa.go.id/website/skor-sdgs-4.jpg'),
(5, 'Keterlibatan Perempuan Desa', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-5.jpg'),
(6, 'Desa Layak Air Bersih dan Sanitasi', 58.85, 'https://sid.kemendesa.go.id/website/skor-sdgs-6.jpg'),
(7, 'Desa Berenergi Bersih dan Terbarukan', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-7.jpg'),
(8, 'Pertumbuhan Ekonomi Desa Merata', 50.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-8.jpg'),
(9, 'Infrastruktur dan Inovasi Desa Sesuai Kebutuhan', 59.71, 'https://sid.kemendesa.go.id/website/skor-sdgs-9.jpg'),
(10, 'Desa Tanpa Kesenjangan', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-10.jpg'),
(11, 'Kawasan Pemukiman Desa Aman dan Nyaman', 24.36, 'https://sid.kemendesa.go.id/website/skor-sdgs-11.jpg'),
(12, 'Konsumsi dan Produksi Desa Sadar Lingkungan', 3.85, 'https://sid.kemendesa.go.id/website/skor-sdgs-12.jpg'),
(13, 'Desa Tanggap Perubahan Iklim', 11.54, 'https://sid.kemendesa.go.id/website/skor-sdgs-13.jpg'),
(14, 'Desa Peduli Lingkungan Laut', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-14.jpg'),
(15, 'Desa Peduli Lingkungan Darat', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-15.jpg'),
(16, 'Desa Damai Berkeadilan', 100.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-16.jpg'),
(17, 'Kemitraan untuk Pembangunan Desa', 0.00, 'https://sid.kemendesa.go.id/website/skor-sdgs-17.jpg'),
(18, 'Kelembagaan Desa Dinamis dan Budaya Desa Adaptif', 7.69, 'https://sid.kemendesa.go.id/website/skor-sdgs-18.jpg');
