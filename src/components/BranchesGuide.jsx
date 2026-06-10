import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ArrowRight, Briefcase, Sparkles, TrendingUp
} from 'lucide-react';
import { branchesGuideData } from '../utils/branchesGuideData';

export const BranchesGuide = ({ selectedBranchId, setSelectedBranchId, onBackToHome, onBackToPrev, branchGuideOrigin }) => {
  const [openIndustry, setOpenIndustry] = useState(0);

  // Auto-open first industry when branch changes
  useEffect(() => {
    setOpenIndustry(0);
  }, [selectedBranchId]);

  const activeBranch = branchesGuideData.find(b => b.id === selectedBranchId);

  // Return to top of page when changing view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedBranchId]);

  if (activeBranch) {
    const theme = activeBranch.theme;
    return (
      <div className="branches-guide-detail-container" style={{ paddingBottom: 60 }}>
        {/* Breadcrumb & Back navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={onBackToPrev || (() => setSelectedBranchId(null))}
            className="back-pill"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ChevronLeft size={16} /> {branchGuideOrigin === 'dept-details' ? 'Back to Department' : 'Back to Branches'}
          </button>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/</span>
          <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{activeBranch.name}</span>
        </div>

        {/* Hero Section of Branch */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(135deg, ${theme.bg}, rgba(255,255,255,0.95))`,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: '32px 28px',
            marginBottom: 28,
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.grad[0]}15, ${theme.grad[1]}05)`,
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${theme.grad[0]}, ${theme.grad[1]})`,
                color: '#fff',
                fontSize: '1.4rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                flexShrink: 0
              }}
            >
              {activeBranch.short}
            </div>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: theme.accentColor,
                  background: theme.bg,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-block',
                  marginBottom: 8
                }}
              >
                Career Profile
              </span>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.2 }}>
                {activeBranch.name}
              </h1>
              <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.6, margin: 0, maxWidth: 800 }}>
                {activeBranch.longDesc}
              </p>

              {/* Tag List */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {activeBranch.sectors.map((sec, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#475569',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Salary Potential Section */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={20} color={theme.accentColor} /> Salary Potential in India
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 32 }}>
          {activeBranch.salaryRanges.map((sal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '20px 22px',
                boxShadow: '0 4px 12px rgba(15,23,42,0.015)'
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                {sal.exp}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: theme.accentColor, marginBottom: 8 }}>
                {sal.range}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#475569',
                fontWeight: 600,
                padding: '6px 12px',
                background: '#fafbfc',
                borderRadius: 8,
                border: '1px solid #f1f5f9',
                display: 'inline-block'
              }}>
                {sal.stats}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hiring Industries Section */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Briefcase size={20} color={theme.accentColor} /> Key Hiring Sectors & Job Matrix
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeBranch.industries.map((ind, iIdx) => {
            const isOpen = openIndustry === iIdx;
            return (
              <div
                key={iIdx}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.01)'
                }}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setOpenIndustry(isOpen ? -1 : iIdx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? '#fafbff' : '#fff',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: isOpen ? theme.bg : '#f1f5f9',
                        color: isOpen ? theme.accentColor : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {ind.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                        {ind.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: theme.accentColor, fontWeight: 700 }}>
                          {ind.growth}
                        </span>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          {ind.market}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: '#94a3b8',
                      display: 'flex'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
                        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                          {ind.desc}
                        </p>

                        {/* Job Roles & Placements Matrix */}
                        <div style={{ marginBottom: 28 }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                            Job Roles & Placement Chances Matrix
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {ind.roles.map((role, rIdx) => (
                              <div
                                key={rIdx}
                                style={{
                                  background: '#fafbff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 12,
                                  padding: '16px 18px'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
                                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                    {role.title}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                                  {role.desc}
                                </p>

                                {/* Placement Tiers Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                                  {role.tiers.map((tInfo, tIdx) => {
                                    const isHigh = tInfo.chance.toLowerCase().includes('high');
                                    const isMed = tInfo.chance.toLowerCase().includes('medium');
                                    const isNA = tInfo.chance.toLowerCase().includes('not available') || tInfo.salary === 'N/A';
                                    const badgeColor = isHigh ? '#16a34a' : isMed ? '#d97706' : '#dc2626';
                                    const badgeBg = isHigh ? '#f0fdf4' : isMed ? '#fffbeb' : '#fef2f2';

                                    return (
                                      <div
                                        key={tIdx}
                                        style={{
                                          background: '#fff',
                                          border: '1px solid #f1f5f9',
                                          borderRadius: 8,
                                          padding: '8px 12px',
                                          textAlign: 'center',
                                          opacity: isNA ? 0.6 : 1
                                        }}
                                      >
                                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                                          {tInfo.tier}
                                        </div>
                                        <span
                                          style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: badgeColor,
                                            background: badgeBg,
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            display: 'inline-block',
                                            marginBottom: 6
                                          }}
                                        >
                                          {tInfo.chance}
                                        </span>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
                                          {tInfo.salary}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Hiring Companies */}
                        <div style={{ marginBottom: 24 }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                            Top Hiring Companies in India
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                            {ind.companies.map((comp, cIdx) => (
                              <div
                                key={cIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 14px',
                                  background: '#fff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 10
                                }}
                              >
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    background: theme.bg,
                                    color: theme.accentColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 900,
                                    fontSize: '0.72rem',
                                    flexShrink: 0
                                  }}
                                >
                                  {comp.shortName}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {comp.name}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {comp.location}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Colleges Examples by Tier */}
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                            Tamil Nadu & India College Tiers
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {ind.colleges.map((cTier, tIdx) => (
                              <div key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.82rem' }}>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: tIdx === 0 ? '#6366f1' : '#475569',
                                    background: tIdx === 0 ? 'rgba(99,102,241,0.08)' : '#f1f5f9',
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                    textTransform: 'uppercase',
                                    flexShrink: 0,
                                    marginTop: 2
                                  }}
                                >
                                  {cTier.tier}
                                </span>
                                <span style={{ color: '#475569', lineHeight: 1.4 }}>
                                  {cTier.examples}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Feedback Section */}
        <div
          style={{
            marginTop: 40,
            padding: '24px',
            border: '1px solid #e2e8f0',
            borderRadius: 18,
            background: '#fafbff',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
            Want to see details for another engineering branch?
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
            We are constantly researching and adding more fields based on student inquiries.
          </p>
          <button
            onClick={() => {
              if (typeof window.openLeadModal === 'function') {
                window.openLeadModal({
                  headline: 'Request a Branch Profile',
                  subtitle: 'Let us know which engineering stream career guide you want next',
                  ctaText: 'Submit Request'
                });
              }
            }}
            className="nav-cta nav-register"
            style={{ padding: '9px 18px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Sparkles size={14} /> Request a Branch
          </button>
        </div>
      </div>
    );
  }

  // Render Branches Listing view
  return (
    <div className="branches-guide-list-container" style={{ paddingBottom: 60 }}>
      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="back-pill"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}
      >
        <ChevronLeft size={16} /> {
          branchGuideOrigin === 'explorer' ? 'Back to Explorer' : 
          branchGuideOrigin === 'dept-details' ? 'Back to Department' : 
          branchGuideOrigin === 'comparison' ? 'Back to Comparison' : 
          branchGuideOrigin === 'college-comparison' ? 'Back to Comparison' : 
          branchGuideOrigin === 'ai-counselor' ? 'Back to AI Counselor' : 
          'Back to Home'
        }
      </button>

      {/* Main Header / Banner */}
      <div style={{ textAlign: 'center', marginBottom: 36, marginTop: 10 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.2 }}>
          Engineering <span style={{ color: '#6366f1' }}>Career Guide</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: 650, margin: '0 auto 24px auto', lineHeight: 1.5 }}>
          Explore job opportunities, starting salaries, top hiring companies, and structural career paths for major engineering branches.
        </p>

        {/* Stats Strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, maxWidth: 460, margin: '0 auto' }}>
          <div style={{ flex: 1, padding: '12px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6366f1' }}>10</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>Branches</div>
          </div>
          <div style={{ flex: 1, padding: '12px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6366f1' }}>100+</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>Companies</div>
          </div>
          <div style={{ flex: 1, padding: '12px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6366f1' }}>Tier Matrix</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>Chance Guides</div>
          </div>
        </div>
      </div>

      {/* Grid of branches */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20
        }}
      >
        {branchesGuideData.map((branch, idx) => {
          const theme = branch.theme;
          return (
            <motion.div
              key={branch.id}
              onClick={() => setSelectedBranchId(branch.id)}
              whileHover={{ y: -6, scale: 1.015, boxShadow: '0 12px 30px rgba(99,102,241,0.08)' }}
              whileTap={{ scale: 0.985 }}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 20,
                padding: '24px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Highlight bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.grad[0]}, ${theme.grad[1]})`
                }}
              />

              <div>
                {/* Header: icon & abbreviation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: theme.bg,
                      color: theme.accentColor,
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {branch.short}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Avg Salary:</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: theme.accentColor, background: theme.bg, padding: '2px 8px', borderRadius: 6 }}>
                      {branch.avgSalary}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {branch.name}
                </h3>

                {/* Short Description */}
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.45, margin: '0 0 16px 0', minHeight: 40 }}>
                  {branch.desc}
                </p>

                {/* Mini tag list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {branch.sectors.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: '#64748b',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {branch.sectors.length > 3 && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: theme.accentColor }}>
                      +{branch.sectors.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                  Jobs: <strong style={{ color: '#475569' }}>{branch.jobs}</strong>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 800, color: theme.accentColor }}>
                  Explore Guide <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
