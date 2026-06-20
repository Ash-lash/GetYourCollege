import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Search, SlidersHorizontal, Zap,
  GraduationCap, MapPin, Trophy,
  Scale, MessageSquare, Info, Filter, Percent, RefreshCw
} from 'lucide-react';
import { TNEA_DATA } from '../data'; // Import data or we can pass it as props
import LATERAL_CUTOFF_DATA from '../lateral_cutoff_data.json';

const COMMUNITY_LIST = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];

export default function LateralPredictor({ onBack, onCompare, onOpenQuery, tneaData }) {
  const [cutoffVal, setCutoffVal] = useState(85.0);
  const [cutoffInput, setCutoffInput] = useState('85.00');
  const [selectedCommunity, setSelectedCommunity] = useState('OC');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChanceFilter, setSelectedChanceFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'GOOD' | 'BORDERLINE'
  
  // Use props tneaData or fallback to local import
  const collegesList = tneaData || TNEA_DATA;

  // Create college lookup map for O(1) details retrieval
  const collegeMap = useMemo(() => {
    const map = {};
    collegesList.forEach(c => {
      if (c.code) {
        map[String(c.code).trim()] = c;
      }
    });
    return map;
  }, [collegesList]);

  // Extract unique cities available in TNEA colleges
  const cities = useMemo(() => {
    const set = new Set();
    collegesList.forEach(c => {
      if (c.city) set.add(c.city);
    });
    return Array.from(set).sort();
  }, [collegesList]);

  // Handle slide change
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setCutoffVal(val);
    setCutoffInput(val.toFixed(2));
  };

  // Handle text input change
  const handleInputChange = (e) => {
    setCutoffInput(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      setCutoffVal(parsed);
    }
  };

  const handleInputBlur = () => {
    let parsed = parseFloat(cutoffInput);
    if (isNaN(parsed) || parsed < 50) parsed = 50;
    if (parsed > 100) parsed = 100;
    setCutoffVal(parsed);
    setCutoffInput(parsed.toFixed(2));
  };

  // Match algorithm
  const matchedResults = useMemo(() => {
    const results = [];
    
    // LATERAL_CUTOFF_DATA maps collegeCode -> branchCode -> { branch_name, cutoffs }
    Object.entries(LATERAL_CUTOFF_DATA).forEach(([collegeCode, branches]) => {
      const college = collegeMap[String(collegeCode).trim()];
      if (!college) return; // Skip if college details are not in TNEA_DATA

      Object.entries(branches).forEach(([branchCode, brInfo]) => {
        const cut = brInfo.cutoffs[selectedCommunity];
        if (!cut || cut.min === '-' || cut.max === '-') return; // Skip if no cutoff data for this category

        const min = parseFloat(cut.min);
        const max = parseFloat(cut.max);
        
        let chance = 'UNLIKELY';
        let color = '#ef4444';
        let score = 0; // matching score for sorting

        if (cutoffVal >= max) {
          chance = 'HIGH'; // Highly Likely
          color = '#10b981';
          score = 3 + (cutoffVal - max) * 0.1;
        } else if (cutoffVal >= min) {
          chance = 'GOOD'; // Good Chance
          color = '#06b6d4';
          score = 2 + ((cutoffVal - min) / (max - min));
        } else if (cutoffVal >= min - 2.0) {
          chance = 'BORDERLINE'; // Borderline
          color = '#f59e0b';
          score = 1 + (2.0 - (min - cutoffVal)) * 0.5;
        }

        if (chance !== 'UNLIKELY') {
          results.push({
            college,
            branchCode,
            branchName: brInfo.branch_name,
            min,
            max,
            chance,
            chanceColor: color,
            score
          });
        }
      });
    });

    // Apply filters
    return results.filter(item => {
      // City filter
      if (selectedCity && item.college.city !== selectedCity) return false;
      
      // Search term filter (college name, code, city, branch name, or branch code)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const cleanTerm = term.replace(/[^a-z0-9]/g, '');
        const collegeName = item.college.name.toLowerCase();
        const cleanCollegeName = collegeName.replace(/[^a-z0-9]/g, '');
        const collegeCode = String(item.college.code).toLowerCase();
        const city = (item.college.city || '').toLowerCase();
        const branchName = item.branchName.toLowerCase();
        const branchCode = item.branchCode.toLowerCase();
        
        if (!collegeName.includes(term) && 
            !cleanCollegeName.includes(cleanTerm) &&
            !collegeCode.includes(term) && 
            !city.includes(term) && 
            !branchName.includes(term) && 
            !branchCode.includes(term)) {
          return false;
        }
      }

      // Chance filter
      if (selectedChanceFilter !== 'ALL' && item.chance !== selectedChanceFilter) return false;

      return true;
    }).sort((a, b) => {
      // Sort by match score (high chances first), then by TNEA rank
      if (a.chance !== b.chance) {
        const order = { 'HIGH': 3, 'GOOD': 2, 'BORDERLINE': 1 };
        return order[b.chance] - order[a.chance];
      }
      return (a.college.rank || 9999) - (b.college.rank || 9999);
    });

  }, [cutoffVal, selectedCommunity, selectedCity, searchTerm, selectedChanceFilter, collegeMap]);

  // Counts for summary metrics
  const counts = useMemo(() => {
    let high = 0;
    let good = 0;
    let borderline = 0;

    // Loop through unfiltered results to get true counts
    Object.entries(LATERAL_CUTOFF_DATA).forEach(([collegeCode, branches]) => {
      const college = collegeMap[String(collegeCode).trim()];
      if (!college) return;

      Object.entries(branches).forEach(([branchCode, brInfo]) => {
        const cut = brInfo.cutoffs[selectedCommunity];
        if (!cut || cut.min === '-' || cut.max === '-') return;

        const min = parseFloat(cut.min);
        const max = parseFloat(cut.max);

        if (cutoffVal >= max) {
          high++;
        } else if (cutoffVal >= min) {
          good++;
        } else if (cutoffVal >= min - 2.0) {
          borderline++;
        }
      });
    });

    return { high, good, borderline, total: high + good + borderline };
  }, [cutoffVal, selectedCommunity, collegeMap]);

  const resetFilters = () => {
    setSelectedCity('');
    setSearchTerm('');
    setSelectedChanceFilter('ALL');
  };

  return (
    <div className="predictor-container" style={{ padding: '20px 0', minHeight: '80vh' }}>
      {/* Dynamic styles to keep component standalone and premium */}
      <style>{`
        .p-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }
        .p-input-box {
          border: 1px solid #cbd5e1;
          background: #fff;
          border-radius: 10px;
          padding: 8px 14px;
          outline: none;
          font-weight: 700;
          font-size: 1.1rem;
          color: #0f172a;
          width: 90px;
          text-align: center;
          transition: all 0.2s;
        }
        .p-input-box:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .p-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
          outline: none;
        }
        .p-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
          transition: transform 0.1s;
        }
        .p-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .p-badge-chance {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .p-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: p-pulse 1.4s infinite;
        }
        @keyframes p-pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .p-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media(min-width: 992px) {
          .p-grid {
            grid-template-columns: 320px 1fr;
          }
        }
      `}</style>

      {/* BACK NAVIGATION */}
      <button className="back-pill" onClick={onBack} style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center' }}>
        <ChevronLeft size={16} /> Back to Home
      </button>

      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <span className="live-badge" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
            <Zap size={13} /> Live Simulator
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1' }}>2025 CUTOFF ADMISSION MATCHING</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 850, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.25 }}>
          Lateral Entry Cut-off Predictor
        </h1>
        <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0, maxWidth: 700, lineHeight: 1.5 }}>
          Predict your admission chances for Direct 2nd Year (Lateral Entry) Engineering courses in Tamil Nadu. Enter your diploma percentage and category to simulate matches.
        </p>
      </div>

      <div className="p-grid">
        {/* LEFT COLUMN: SIMULATION INPUTS & FILTERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* CONTROL CARD */}
          <div className="p-card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={16} color="#6366f1" /> Simulator Inputs
            </h2>

            {/* CUTOFF INPUT */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Percent size={13} /> DIPLOMA % MARK
                </label>
                <input
                  type="text"
                  className="p-input-box"
                  value={cutoffInput}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="0.01"
                className="p-slider"
                value={cutoffVal}
                onChange={handleSliderChange}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: 6, fontWeight: 600 }}>
                <span>50.00%</span>
                <span>75.00%</span>
                <span>100.00%</span>
              </div>
            </div>

            {/* COMMUNITY SELECTOR */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                COMMUNITY CATEGORY
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {COMMUNITY_LIST.map(cat => {
                  const active = selectedCommunity === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCommunity(cat)}
                      style={{
                        padding: '8px 4px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: 8,
                        border: '1px solid',
                        borderColor: active ? '#6366f1' : '#cbd5e1',
                        background: active ? '#6366f1' : '#fff',
                        color: active ? '#fff' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

            {/* ADVANCED FILTERS HEADER */}
            <h2 style={{ fontSize: '0.90rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={15} color="#64748b" /> Filter Options
            </h2>

            {/* CITY SELECTOR */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                PREFERRED CITY
              </label>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#fff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* TEXT SEARCH */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                COLLEGE OR BRANCH SEARCH
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  placeholder="Name, code, branch..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* CLEAR FILTERS */}
            {(selectedCity || searchTerm || selectedChanceFilter !== 'ALL') && (
              <button
                onClick={resetFilters}
                style={{
                  width: '100%',
                  padding: '9px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 10,
                  color: '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                <RefreshCw size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & MATCHED LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* ANALYTICS SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {/* TOTAL MATCHES */}
            <div className="p-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Matches</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 850, color: '#0f172a', marginTop: 4 }}>{counts.total}</span>
            </div>

            {/* HIGHLY LIKELY */}
            <button
              className="p-card"
              onClick={() => setSelectedChanceFilter(selectedChanceFilter === 'HIGH' ? 'ALL' : 'HIGH')}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                border: selectedChanceFilter === 'HIGH' ? '2px solid #10b981' : '1px solid #e2e8f0',
                background: selectedChanceFilter === 'HIGH' ? 'rgba(16,185,129,0.04)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="p-pulse-dot" style={{ color: '#10b981' }} /> Highly Likely
              </span>
              <span style={{ fontSize: '1.8rem', fontWeight: 850, color: '#0f172a', marginTop: 4 }}>{counts.high}</span>
            </button>

            {/* LIKELY */}
            <button
              className="p-card"
              onClick={() => setSelectedChanceFilter(selectedChanceFilter === 'GOOD' ? 'ALL' : 'GOOD')}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                border: selectedChanceFilter === 'GOOD' ? '2px solid #06b6d4' : '1px solid #e2e8f0',
                background: selectedChanceFilter === 'GOOD' ? 'rgba(6,182,212,0.04)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>Likely</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 850, color: '#0f172a', marginTop: 4 }}>{counts.good}</span>
            </button>

            {/* BORDERLINE */}
            <button
              className="p-card"
              onClick={() => setSelectedChanceFilter(selectedChanceFilter === 'BORDERLINE' ? 'ALL' : 'BORDERLINE')}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                border: selectedChanceFilter === 'BORDERLINE' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                background: selectedChanceFilter === 'BORDERLINE' ? 'rgba(245,158,11,0.04)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Borderline</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 850, color: '#0f172a', marginTop: 4 }}>{counts.borderline}</span>
            </button>
          </div>

          {/* FILTER INFORMATION CHIP */}
          {selectedChanceFilter !== 'ALL' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              fontSize: '0.8rem',
              color: '#475569'
            }}>
              <span>Showing only matches with chance: <strong>{selectedChanceFilter}</strong></span>
              <button
                onClick={() => setSelectedChanceFilter('ALL')}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}
              >
                Show All
              </button>
            </div>
          )}

          {/* RESULTS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence mode="popLayout">
              {matchedResults.length > 0 ? (
                matchedResults.slice(0, 40).map((result, idx) => {
                  const college = result.college;
                  const key = `${college.code}-${result.branchCode}`;

                  return (
                    <motion.div
                      layout
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="p-card"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        position: 'relative'
                      }}
                    >
                      {/* CARD HEADER */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div>
                          {/* COLLEGE NAME */}
                          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                            {college.name}
                          </h3>
                          {/* DETAILS ROW */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              fontSize: '0.74rem', fontWeight: 600, color: '#475569',
                              background: '#f1f5f9', padding: '3px 8px', borderRadius: 12
                            }}>
                              <MapPin size={10} /> {college.city || 'Tamil Nadu'}
                            </span>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              fontSize: '0.72rem', fontWeight: 700, color: '#0f172a',
                              background: '#fef3c7', padding: '3px 8px', borderRadius: 12,
                              border: '1px solid #fcd34d'
                            }}>
                              Code · {college.code}
                            </span>
                            {college.rank && (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: '0.72rem', fontWeight: 700, color: '#6366f1',
                                background: 'rgba(99,102,241,0.08)', padding: '3px 8px', borderRadius: 12
                              }}>
                                <Trophy size={10} /> Rank #{college.rank}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* MATCH CHANCE BADGE */}
                        <div
                          className="p-badge-chance"
                          style={{
                            backgroundColor: `${result.chanceColor}15`,
                            color: result.chanceColor,
                            border: `1px solid ${result.chanceColor}35`,
                            flexShrink: 0
                          }}
                        >
                          {result.chance === 'HIGH' && <span className="p-pulse-dot" />}
                          {result.chance === 'HIGH' ? 'Highly Likely' : result.chance === 'GOOD' ? 'Likely' : 'Borderline'}
                        </div>
                      </div>

                      {/* BRANCH ROW */}
                      <div style={{
                        background: '#fafbff',
                        border: '1px dashed #cbd5e1',
                        borderRadius: 10,
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 16
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <GraduationCap size={16} color="#6366f1" style={{ flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1' }}>{result.branchCode}</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
                              {result.branchName}
                            </div>
                          </div>
                        </div>
                        {/* HISTORICAL RANGE */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>2025 CUTOFF RANGE ({selectedCommunity})</div>
                          <div style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                            {result.min.toFixed(2)}% – {result.max.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* ACTION CTAS */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                        <button
                          onClick={() => onCompare && onCompare(college)}
                          style={{
                            padding: '6px 12px',
                            background: '#fff',
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#475569',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                        >
                          <Scale size={12} /> Compare
                        </button>
                        <button
                          onClick={() => onOpenQuery && onOpenQuery(college.name)}
                          style={{
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 2px 6px rgba(16,185,129,0.15)',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <MessageSquare size={12} /> Enquire
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div style={{
                  padding: '48px 24px',
                  background: '#fff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 16,
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  <Info size={36} style={{ marginBottom: 12, opacity: 0.5, color: '#6366f1' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>No Match Options Found</h3>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 16px 0', color: '#64748b' }}>
                    Try lowering the cutoff percentage or updating search terms to find available colleges.
                  </p>
                  {(selectedCity || searchTerm || selectedChanceFilter !== 'ALL') && (
                    <button
                      onClick={resetFilters}
                      style={{
                        padding: '8px 16px',
                        background: '#6366f1',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </AnimatePresence>

            {matchedResults.length > 40 && (
              <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                Showing first 40 of {matchedResults.length} matches. Narrow your search using filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
