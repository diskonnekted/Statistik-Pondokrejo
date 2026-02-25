
const fs = require('fs');
const path = require('path');

async function fetchAndSaveIDM() {
    try {
        console.log("Fetching IDM 2024 data...");
        const response = await fetch('https://pondokrejo.sleman-desa.id/internal_api/idm/2024');
        const json = await response.json();
        
        if (json.data && json.data.length > 0) {
            const content = `// Static IDM data for 2024
// Generated from internal_api/idm/2024 to replace runtime API calls

export const IDM_2024_DATA = ${JSON.stringify(json, null, 2)};
`;
            
            const outputPath = path.join(process.cwd(), 'src', 'lib', 'idm-data-static.ts');
            fs.writeFileSync(outputPath, content);
            console.log(`Successfully saved IDM data to ${outputPath}`);
            
            // Log summary for verification
            const summary = json.data[0].attributes.SUMMARIES;
            console.log("Summary:", summary);
            console.log("Row count:", json.data[0].attributes.ROW.length);
        } else {
            console.error("No data found in response");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

fetchAndSaveIDM();
