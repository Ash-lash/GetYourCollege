const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TNEA_COURSES_INFO = require('./src/tnea_courses_data.json');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Extract all unique departments
function getAllUniqueDepartments() {
  const map = {};
  const normalizeDeg = (raw) => {
    const d = String(raw).trim().toUpperCase().replace(/[.\s]/g, '');
    if (d === 'BE') return 'B.E';
    if (d === 'BTECH') return 'B.Tech';
    if (d === 'ME') return 'M.E';
    if (d === 'MTECH') return 'M.Tech';
    return raw;
  };

  Object.entries(TNEA_COURSES_INFO).forEach(([code, cats]) => {
    (cats || []).forEach(cat => {
      (cat.branches || []).forEach(b => {
        const deg = normalizeDeg(b[0]);
        const nameUpper = String(b[1]).trim().toUpperCase();
        const key = `${deg} - ${nameUpper}`;
        if (!map[key]) {
          map[key] = { id: key, degree: deg, name: nameUpper };
        }
      });
    });
  });
  
  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
}

async function generateComparisonAnalysis(degree, name, retryCount = 0) {
  const maxRetries = 3;
  const baseDelay = 1000;
  
  const systemPrompt = `You are a department comparison expert. Provide focused, concise analysis for ONE department when being compared with others.`;

  const userMessage = `Provide FOCUSED ANALYSIS for: ${degree} ${name}

Create analysis ONLY about "${degree} ${name}" in this structure:

## ⭐ Unique Strengths
List 3-4 key differentiators and why this dept stands out.

## 📊 Core Competencies
Skills, technologies, and specializations taught.

## 🎯 Career Paths & Industries
Top job roles and industries that hire from this program.

## 💼 Salary & Job Market
Expected salary range and job placement statistics.

## 📚 Learning Style
Practical labs? Research-focused? Industry projects? Team-based?

## 👥 Best Student Fit
What kind of student would thrive here?

Be specific and concise. Focus on THIS department only.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    const analysis = message.content[0]?.text || '';
    return analysis;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delayMs = baseDelay * Math.pow(2, retryCount) + Math.random() * 1000;
      console.log(`   ⏳ Retry ${retryCount + 1}/${maxRetries} - waiting ${Math.round(delayMs)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return generateComparisonAnalysis(degree, name, retryCount + 1);
    } else {
      throw error;
    }
  }
}

async function generateAllComparisons() {
  const departments = getAllUniqueDepartments();
  const outputPath = path.join(__dirname, 'src', 'comparison_data.json');
  
  // Load existing data to resume if interrupted
  let comparisons = {};
  if (fs.existsSync(outputPath)) {
    try {
      comparisons = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`📂 Loaded ${Object.keys(comparisons).length} existing comparison analyses. Will resume from where we left off.\n`);
    } catch (e) {
      console.log(`⚠️  Could not load existing data, starting fresh.\n`);
    }
  }

  console.log(`\n🚀 Starting comparison analysis generation for ${departments.length} departments...`);
  console.log(`⏱️  Currently have ${Object.keys(comparisons).length} completed. Remaining: ${departments.length - Object.keys(comparisons).length}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    const key = `${dept.degree}___${dept.name}`;
    
    // Skip if already generated
    if (comparisons[key]) {
      console.log(`[${i + 1}/${departments.length}] ✓ ${dept.degree} ${dept.name} (cached)`);
      continue;
    }
    
    try {
      console.log(`[${i + 1}/${departments.length}] Generating comparison analysis for ${dept.degree} ${dept.name}...`);
      const analysis = await generateComparisonAnalysis(dept.degree, dept.name);
      comparisons[key] = {
        degree: dept.degree,
        name: dept.name,
        analysis: analysis,
        generatedAt: new Date().toISOString()
      };

      successCount++;
      console.log(`   ✅ Generated successfully`);

      // Save progress every 3 successful generations
      if (successCount % 3 === 0) {
        fs.writeFileSync(outputPath, JSON.stringify(comparisons, null, 2));
        console.log(`   💾 Progress saved (${Object.keys(comparisons).length}/${departments.length})`);
      }
    } catch (error) {
      failureCount++;
      console.log(`   ❌ Error: ${error.message}`);
      comparisons[key] = {
        degree: dept.degree,
        name: dept.name,
        analysis: `⚠️ Failed to generate comparison analysis: ${error.message}`,
        generatedAt: new Date().toISOString(),
        error: true
      };
    }

    // Add a small delay between requests to avoid rate limiting
    if (i < departments.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Save final results
  fs.writeFileSync(outputPath, JSON.stringify(comparisons, null, 2));

  console.log(`\n✅ Generation Complete!`);
  console.log(`📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log(`   📝 Total saved to: src/comparison_data.json`);
  console.log(`   📈 Total entries: ${Object.keys(comparisons).length}`);
}

generateAllComparisons().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
