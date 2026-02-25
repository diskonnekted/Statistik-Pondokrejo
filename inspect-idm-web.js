
const axios = require('axios');
const cheerio = require('cheerio');

async function inspectPage() {
    try {
        console.log("Fetching https://pondokrejo.clasnet.co.id/idm...");
        const response = await axios.get('https://pondokrejo.clasnet.co.id/idm', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        const title = $('title').text();
        console.log("Page Title:", title);
        
        const tables = $('table');
        console.log(`Found ${tables.length} tables.`);
        
        tables.each((i, table) => {
            console.log(`\nTable ${i+1}:`);
            const headers = [];
            $(table).find('th').each((j, th) => {
                headers.push($(th).text().trim());
            });
            console.log("Headers:", headers.join(' | '));
            
            // Print first few rows
            $(table).find('tr').slice(0, 5).each((j, tr) => {
                const cells = [];
                $(tr).find('td').each((k, td) => {
                    cells.push($(td).text().trim());
                });
                if (cells.length > 0) console.log(`Row ${j}:`, cells.join(' | '));
            });
        });

        // Check for specific keywords
        const text = $('body').text();
        console.log("\nKeywords check:");
        console.log("Has 'IKS':", text.includes('IKS'));
        console.log("Has 'IKE':", text.includes('IKE'));
        console.log("Has 'IKL':", text.includes('IKL'));
        console.log("Has 'Indeks Desa Membangun':", text.includes('Indeks Desa Membangun'));
        
        // Dump some HTML to inspect structure
        console.log("\nHTML Content (first 2000 chars):");
        console.log(response.data.substring(0, 2000));
        
        // Look for script tags that might contain JSON data
        $('script').each((i, el) => {
            const content = $(el).html();
            if (content && (content.includes('IKS') || content.includes('IKE'))) {
                console.log("\nFound potential data in script tag:");
                console.log(content.substring(0, 500) + "...");
            }
        });

    } catch (error) {
        console.error("Error fetching page:", error.message);
    }
}

inspectPage();
