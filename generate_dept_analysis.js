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

async function generateDepartmentAnalysis(degree, name, retryCount = 0) {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second base delay
  
  const systemPrompt = `You are an expert academic and career counselor analyzing an engineering department.
Provide a comprehensive, well-formatted analysis in markdown format.

IMPORTANT: Follow this EXACT structure for your response:

## 1. What is This Department?
(2-3 sentences explaining what this department is about)

## 2. Unique Features & Scope
(3-4 bullet points about what makes this department special)

## 3. Average Salary
(Provide salary ranges for entry-level, mid-career, and experienced positions)

## 4. Job Opportunities by Level
- **High Salary Opportunities**: (3-4 high-paying roles/sectors)
- **Mid-Level Opportunities**: (3-4 mid-paying roles/sectors)
- **Entry-Level Opportunities**: (3-4 entry-level roles/sectors)

## 5. Available Roles & Specializations
(List 5-7 specific job roles/designations available for graduates in this field)

## 6. Year-wise Curriculum Overview
(Brief overview of what is typically taught in each year)

## 7. Essential Skillsets for Placement
(List 6-8 key skills and technical knowledge needed to get placed)

## 8. Who Should & Shouldn't Join
- **Ideal For**: (3-4 types of students who would excel)
- **Not Ideal For**: (3-4 types of students who might struggle)

## 9. Pro Tip
(One powerful insight or advice for students in this department)

Keep the entire response concise but informative (around 500-600 words). Use clear formatting with bullet points.`;

  const userMessage = `Please provide comprehensive analysis for the ${degree} ${name} department. Follow the exact structure specified in your instructions.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    const analysis = message.content[0]?.text || '';
    return analysis;
  } catch (error) {
    // Retry with exponential backoff
    if (retryCount < maxRetries) {
      const delayMs = baseDelay * Math.pow(2, retryCount) + Math.random() * 1000;
      console.log(`   ⏳ Retry ${retryCount + 1}/${maxRetries} - waiting ${Math.round(delayMs)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return generateDepartmentAnalysis(degree, name, retryCount + 1);
    } else {
      throw error;
    }
  }
}

async function generateAllAnalyses() {
  const departments = getAllUniqueDepartments();
  const outputPath = path.join(__dirname, 'src', 'dept_analysis_data.json');
  
  // Load existing data to resume if interrupted
  let analyses = {};
  if (fs.existsSync(outputPath)) {
    try {
      analyses = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`📂 Loaded ${Object.keys(analyses).length} existing analyses. Will resume from where we left off.\n`);
    } catch (e) {
      console.log(`⚠️  Could not load existing data, starting fresh.\n`);
    }
  }

  console.log(`\n🚀 Starting generation for ${departments.length} departments...`);
  console.log(`⏱️  Currently have ${Object.keys(analyses).length} completed. Remaining: ${departments.length - Object.keys(analyses).length}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    const key = `${dept.degree}___${dept.name}`;
    
    // Skip if already generated
    if (analyses[key]) {
      console.log(`[${i + 1}/${departments.length}] ✓ ${dept.degree} ${dept.name} (cached)`);
      continue;
    }
    
    try {
      console.log(`[${i + 1}/${departments.length}] Generating ${dept.degree} ${dept.name}...`);
      const analysis = await generateDepartmentAnalysis(dept.degree, dept.name);
      analyses[key] = {
        degree: dept.degree,
        name: dept.name,
        analysis: analysis,
        generatedAt: new Date().toISOString()
      };

      successCount++;
      console.log(`   ✅ Generated successfully`);

      // Save progress periodically (every 5 successful generations)
      if (successCount % 5 === 0) {
        fs.writeFileSync(outputPath, JSON.stringify(analyses, null, 2));
        console.log(`   💾 Progress saved (${Object.keys(analyses).length} total)`);
      }

      // Intelligent delay between requests
      // Longer delays to avoid rate limiting
      const baseDelay = 3000; // 3 seconds minimum
      const randomDelay = Math.random() * 2000; // 0-2 seconds random
      const totalDelay = baseDelay + randomDelay;
      
      if (i < departments.length - 1) {
        // Show countdown on same line
        const delaySeconds = (totalDelay / 1000).toFixed(1);
        process.stdout.write(`   ⏳ Next request in ${delaySeconds}s\r`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
        process.stdout.write(`                              \r`); // Clear the line
      }
    } catch (error) {
      failureCount++;
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  // Final save
  fs.writeFileSync(outputPath, JSON.stringify(analyses, null, 2));
  
  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`✅ GENERATION COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📊 Total Departments: ${departments.length}`);
  console.log(`✓ Successfully Generated: ${successCount}`);
  console.log(`✗ Failed: ${failureCount}`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (failureCount > 0) {
    console.log(`⚠️  Some departments failed due to API rate limits or connection issues.`);
    console.log(`💡 Run this script again to retry failed departments - they will resume automatically!\n`);
  }
}

// Run the generation
generateAllAnalyses().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
