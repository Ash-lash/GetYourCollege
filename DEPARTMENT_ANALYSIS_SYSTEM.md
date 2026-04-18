# Department Analysis Generation System

## Overview

This system pre-generates comprehensive AI-powered analyses for all engineering departments at once, storing them as static data. This eliminates:
- ❌ Repetitive API calls for the same department
- ❌ Token wastage from regenerating the same content
- ❌ Minor content variations between users
- ✅ Instant loading of consistent, high-quality content for all users

## Structure

### New Content Format

Each department analysis now includes:

1. **What is This Department?** - Overview of the field
2. **Unique Features & Scope** - What makes it special
3. **Average Salary** - Entry-level, mid-career, and experienced positions
4. **Job Opportunities by Level** - High, mid, and entry-level opportunities
5. **Available Roles & Specializations** - Specific job titles and roles
6. **Year-wise Curriculum Overview** - What students learn each year
7. **Essential Skillsets for Placement** - Required technical and soft skills
8. **Who Should & Shouldn't Join** - Ideal and non-ideal candidates
9. **Pro Tip** - Key insights for students in this department

## How to Use

### Step 1: Generate All Department Analyses

```bash
node generate_dept_analysis.js
```

This will:
- Extract all unique departments from `tnea_courses_data.json`
- Generate comprehensive analysis for each department using Claude API
- Save everything to `src/dept_analysis_data.json`
- Process ~50-100 departments (takes 20-30 minutes depending on API rate limits)

**Note:** The script adds a 2-second delay between requests to avoid rate limiting. Make sure your `ANTHROPIC_API_KEY` is set in `.env`.

### Step 2: Verify Generation Success

Check that `src/dept_analysis_data.json` contains data for all departments:

```bash
# Count the number of departments generated
node -e "const data = require('./src/dept_analysis_data.json'); console.log(`Generated analyses for ${Object.keys(data).length} departments`)"
```

### Step 3: Application Uses Static Data

The frontend automatically:
- Loads the pre-generated analyses from `src/dept_analysis_data.json`
- Displays them instantly when a department is clicked
- No API calls are made to generate content on each click

## Files Modified

### Backend Files
- **`generate_dept_analysis.js`** (NEW) - Script to pre-generate all department analyses
- **`api/chat.js`** - Unchanged (still used for other features)
- **`server.js`** - Unchanged (still used for other features)

### Frontend Files
- **`src/App.js`** - Updated to import and use `dept_analysis_data.json`
  - Imports `DEPT_ANALYSIS_DATA` from JSON file
  - Modified `DepartmentDetailsPage` useEffect to load static data instead of API calls
  - Better error messages for when data hasn't been generated yet

### Data Files
- **`src/dept_analysis_data.json`** (NEW) - Static pre-generated department analyses
  - Structure: `{ "DEGREE___DEPARTMENT_NAME": { degree, name, analysis, generatedAt } }`
  - Example key: `"B.E___COMPUTER SCIENCE AND ENGINEERING"`

## Benefits

✅ **Cost Savings**: Generate content once, serve to unlimited users  
✅ **Speed**: Instant loading without API latency  
✅ **Consistency**: Same content for all users  
✅ **Token Efficiency**: Minimal token usage after initial generation  
✅ **Scalability**: Handle any number of concurrent users  

## Maintenance

### Regenerating Data

To update all department analyses (if you want to refresh content):

```bash
node generate_dept_analysis.js
```

This will overwrite `src/dept_analysis_data.json` with fresh analyses.

### Adding New Departments

When new departments are added to the university system:
1. Update `src/tnea_courses_data.json` with the new departments
2. Run `node generate_dept_analysis.js` again to generate analyses for new departments

## Technical Details

### API Usage
- **Model**: Claude Sonnet 4.6
- **Max Tokens**: 2048 per request
- **Rate Limit Handling**: 2-second delay between requests
- **Backup**: If generation fails for a department, the error is logged and the script continues

### Frontend Implementation
- **Key Lookup Format**: `${degree}___${name}` (e.g., `"B.E___COMPUTER SCIENCE"`)
- **Fallback**: If data isn't found, displays helpful error message asking to run generation script
- **Progress Simulation**: UI shows loading progress while displaying pre-generated content

## Troubleshooting

### Issue: "Department analysis is not yet generated"

**Solution**: Run the generation script:
```bash
node generate_dept_analysis.js
```

### Issue: Script fails with API errors

**Solutions**:
1. Verify `ANTHROPIC_API_KEY` is set in `.env`
2. Check API rate limits and wait 5 minutes before retrying
3. Run again - the script will regenerate only missing departments

### Issue: Extremely slow generation

**Cause**: Rate limiting from API  
**Solution**: This is normal. The script adds delays to respect API limits. Processing ~80 departments takes 20-30 minutes.

## Next Steps

1. ✅ Run `node generate_dept_analysis.js` to generate all department analyses
2. ✅ Commit the generated `src/dept_analysis_data.json` file to version control
3. ✅ Deploy the updated application
4. ✅ Remove API calls from any other department analysis features if they exist

---

**Version**: 1.0  
**Last Updated**: 2024  
**Author**: GetYourCollege Team
