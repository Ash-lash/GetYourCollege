const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Paths
const EXCEL_PATH = path.join(__dirname, '..', 'College_Branch_Details.xlsx');
const OUTPUT_COURSES_PATH = path.join(__dirname, 'src', 'tnea_courses_data.json');
const DATA_JS_PATH = path.join(__dirname, 'src', 'data.js');

async function syncData() {
    console.log('--- STARTING NODE.JS DATA SYNC ---');

    // 1. Process Excel
    if (!fs.existsSync(EXCEL_PATH)) {
        console.error('Excel file not found at: ' + EXCEL_PATH);
        return;
    }

    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const coursedata = {};
    const excelMapping = {}; // For updating data.js names if needed

    rows.forEach(row => {
        const code = String(row['College Code'] || '').trim();
        const name = String(row['College Name'] || '').trim();
        const branchesStr = String(row['Branch Names'] || '').trim();

        if (!code) return;
        excelMapping[code] = name;

        const branchesList = branchesStr.split(',').map(b => b.trim()).filter(b => b);
        const grouped = [];

        branchesList.forEach(rawBranch => {
            // Regex to pick up DEGREE (B.E./B.Tech/etc) and BRANCH NAME
            // Matches something like "B.E. Computer Science" or "B.Tech IT"
            const match = rawBranch.match(/^(B\.E\.|B\.Tech|M\.E\.|M\.Tech|MBA|MCA)\s*(.*)$/i);
            const deg = match ? match[1].trim() : "B.E."; // Default degree if not specified
            const bName = match ? match[2].trim() : rawBranch;

            let catName = "Engineering";
            if (deg.includes('M.')) catName = "Post Graduate";
            if (deg.startsWith('M.E') || deg.startsWith('M.T')) catName = "PG Engineering";

            let cat = grouped.find(g => g.cat === catName);
            if (!cat) {
                cat = { cat: catName, branches: [] };
                grouped.push(cat);
            }
            cat.branches.push([deg, bName]);
        });
        
        coursedata[code] = grouped;
    });

    // Save JSON
    fs.writeFileSync(OUTPUT_COURSES_PATH, JSON.stringify(coursedata, null, 2));
    console.log(`Updated ${Object.keys(coursedata).length} colleges in ${OUTPUT_COURSES_PATH}`);

    // 2. Update data.js names from Excel for consistency (OPTIONAL but good)
    let dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
    // Simple replacement: TNEA_DATA = [...]
    const tneaMatch = dataJs.match(/export const TNEA_DATA = (\[[\s\S]*?\]);/);
    if (tneaMatch) {
        let tneaArray = JSON.parse(tneaMatch[1]);
        let updatedCount = 0;
        tneaArray.forEach(col => {
            const code = String(col.code).trim();
            if (excelMapping[code]) {
                col.name = excelMapping[code];
                updatedCount++;
            }
        });
        const newTneaStr = JSON.stringify(tneaArray);
        dataJs = dataJs.replace(tneaMatch[1], newTneaStr);
        fs.writeFileSync(DATA_JS_PATH, dataJs);
        console.log(`Updated ${updatedCount} college names in data.js for better matching.`);
    }

    console.log('--- SYNC COMPLETE ---');
}

syncData().catch(console.error);
