/**
 * Script to re-categorize all TNEA colleges with proper types
 * and output updated data.js
 */
const fs = require('fs');
const path = require('path');

// Read the raw JS file
const dataPath = path.join(__dirname, 'src', 'data.js');
const raw = fs.readFileSync(dataPath, 'utf-8');

// Extract TNEA_DATA array string
const tneaMatch = raw.match(/export const TNEA_DATA = (\[[\s\S]*?\]);/);
if (!tneaMatch) { console.error('Could not find TNEA_DATA'); process.exit(1); }

const tnea = JSON.parse(tneaMatch[1]);
console.log(`Found ${tnea.length} TNEA colleges`);

// ── University Departments (Anna Univ campuses + Regional + Annamalai) ──
const UNIV_DEPT_CODES = ['1','2','3','4','2025','4020','5010','5'];

// ── CECRI & CIPET ──
const CECRI_CIPET_CODES = ['5012','1321'];

// ── Constituent Colleges (University College of Engineering) ──
const CONSTITUENT_CODES = [
  '1013','1014','1015','1026',
  '3011','3016','3018','3019','3021',
  '4023','4024',
  '5017','5022'
];

// ── Government Colleges ──
const GOVERNMENT_NAMES = [
  'government college of technology',
  'government college of engineering',
  'thanthai periyar government',
  'alagappa chettiar government', // might also be govt aided
];

// ── Government Aided Colleges ──  
// These are well-known aided colleges in TN
const GOVT_AIDED_CODES = [
  '2006', // PSG College of Technology
  '2007', // Coimbatore Institute of Technology  
  '5008', // Thiagarajar College of Engineering
  '4960', // Mepco Schlenk Engineering College
  '4962', // National Engineering College
  '2343', // Indian Institute of Handloom Technology
  '3795', // SRM TRP Engineering College (Govt Aided)
];

const GOVT_AIDED_NAMES = [
  'indian institute of handloom',
];

function categorize(college) {
  const code = String(college.code).trim();
  const name = college.name.toLowerCase();

  // 1. University Departments
  if (UNIV_DEPT_CODES.includes(code)) return 'university_dept';

  // 2. CECRI & CIPET
  if (CECRI_CIPET_CODES.includes(code)) return 'cecri_cipet';

  // 3. Constituent Colleges
  if (CONSTITUENT_CODES.includes(code)) return 'constituent';
  if (name.startsWith('university college of engineering') || 
      name.startsWith('university v.o.c.')) return 'constituent';

  // 4. Government Colleges
  for (const gn of GOVERNMENT_NAMES) {
    if (name.includes(gn)) return 'government';
  }

  // 5. Government Aided
  if (GOVT_AIDED_CODES.includes(code)) return 'govt_aided';
  for (const an of GOVT_AIDED_NAMES) {
    if (name.includes(an)) return 'govt_aided';
  }

  // 6. Autonomous (self-financing)
  if (name.includes('(autonomous)') || name.includes('autonomous)')) return 'autonomous';

  // 7. Non-Autonomous (self-financing)
  return 'non_autonomous';
}

// Categorize and count
const counts = {};
tnea.forEach(c => {
  c.type = categorize(c);
  counts[c.type] = (counts[c.type] || 0) + 1;
});

console.log('\n── Category Counts ──');
Object.entries(counts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  console.log(`  ${k}: ${v}`);
});

// Build updated data.js
const updatedTnea = JSON.stringify(tnea);

// Replace TNEA_DATA in the raw file
const updated = raw.replace(
  /export const TNEA_DATA = \[[\s\S]*?\];/,
  `export const TNEA_DATA = ${updatedTnea};`
);

fs.writeFileSync(dataPath, updated, 'utf-8');
console.log('\n✅ data.js updated with new categories!');
