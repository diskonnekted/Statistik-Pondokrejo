
const fs = require('fs');

async function fetchSdgsIcons() {
    const jsUrl = "https://dashboard-sdgs.kemendesa.go.id/static/js/main.b42824ee.js";
    try {
        console.log(`Fetching JS: ${jsUrl}`);
        const jsResponse = await fetch(jsUrl);
        const jsContent = await jsResponse.text();
        
        // Find all images
        const regex = /static\/media\/[^"]+\.(webp|png|jpg|jpeg|svg)/g;
        const matches = jsContent.match(regex);
        
        if (matches) {
            const uniqueMatches = [...new Set(matches)];
            console.log(`Found ${uniqueMatches.length} unique matches:`);
            uniqueMatches.forEach(match => {
                console.log(`https://dashboard-sdgs.kemendesa.go.id/${match}`);
            });

            // Check for specific keywords
            const keywords = ["18", "desa", "kelembagaan", "delapanbelas"];
            keywords.forEach(keyword => {
                const found = uniqueMatches.filter(m => m.toLowerCase().includes(keyword));
                if (found.length > 0) {
                    console.log(`Matches for '${keyword}':`, found);
                } else {
                    console.log(`No matches for '${keyword}' in filenames.`);
                }
            });
        }
        
    } catch (error) {
        console.error("Error:", error);
    }
}

fetchSdgsIcons();
