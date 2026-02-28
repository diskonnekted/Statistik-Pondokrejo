
const fs = require('fs');

const rawData = fs.readFileSync('sdgs_data.json', 'utf8');
const data = JSON.parse(rawData);

let sql = `
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
INSERT INTO sdgs_summary (meta_key, meta_value) VALUES ('average_score', '${data.average}');
INSERT INTO sdgs_summary (meta_key, meta_value) VALUES ('total_desa', '${data.total_desa || 1}');

-- Insert Scores
INSERT INTO sdgs_scores (goals, title, score, image) VALUES 
`;

const values = data.data.map(item => {
    // Escape single quotes in title if any
    const title = item.title.replace(/'/g, "\\'");
    const image = item.image.replace(/'/g, "\\'");
    return `(${item.goals}, '${title}', ${item.score}, '${image}')`;
});

sql += values.join(',\n') + ';';

console.log(sql);
