
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'public', 'pondokrejo_a__3404_50kb_ar_idm_2022.xls');

if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    console.log("Sheet Names:", workbook.SheetNames);
    
    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n--- Sheet: ${sheetName} ---`);
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, {header: 1});
        
        if (data.length > 0) {
            console.log("Header (Row 0):", data[0]);
            if (data.length > 1) {
                console.log("Data (Row 1):", data[1]);
            }
        } else {
            console.log("Empty sheet");
        }
    });
} else {
    console.error("File not found");
}
