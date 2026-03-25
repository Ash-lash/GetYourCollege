import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, Award, BookOpen, Stethoscope, Building2,
  Sparkles, Zap, Globe, Eye, GraduationCap
} from 'lucide-react';
import { TNEA_DATA, DEEMED_DATA, PRIVATE_DATA } from './data';
import Antigravity from './components/Antigravity';

/* ─────────────────── NAVBAR ─────────────────── */
const Navbar = ({ onHome }) => (
  <nav className="navbar">
    <div className="nav-inner">
      <div className="brand" onClick={onHome} style={{ cursor: 'pointer' }}>
        <div className="brand-glyph">
          <GraduationCap size={20} />
        </div>
        <span>GetYourCollege</span>
      </div>
      <div className="nav-links">
        <button className="nav-link" onClick={onHome}>Home</button>
        <span className="nav-sep" />
        <a className="nav-cta" href="#explore">Explore</a>
      </div>
    </div>
  </nav>
);

/* ─────────────── ROUND SLIDESHOW ─────────────────── */
const SLIDES = [
  { key: 'r1', label: 'Round 1', color: '#6366f1' },
  { key: 'r2', label: 'Round 2', color: '#ec4899' },
  { key: 'r3', label: 'Round 3', color: '#14b8a6' },
  { key: 'total', label: 'Total Filled', color: '#f59e0b' },
];

const RoundBreakdown = ({ college }) => {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);

  const vals = {
    r1: college.r1 ?? 0,
    r2: college.r2 ?? 0,
    r3: college.r3 ?? 0,
    total: college.filled ?? college.seats ?? 0,
  };

  const goTo = (e, idx) => {
    e.stopPropagation();
    setDir(idx > slide ? 1 : -1);
    setSlide(idx);
  };

  const current = SLIDES[slide];

  return (
    <div className="round-slideshow" onClick={e => e.stopPropagation()}>
      {/* dot nav */}
      <div className="rs-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            className={`rs-dot ${i === slide ? 'rs-dot-on' : ''}`}
            style={i === slide ? { background: s.color } : {}}
            onClick={e => goTo(e, i)}
          />
        ))}
      </div>
      {/* slide content */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current.key}
          custom={dir}
          variants={{
            enter: d => ({ x: d * 40, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: d => ({ x: -d * 40, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22 }}
          className="rs-slide"
        >
          <span className="rs-num" style={{ color: current.color }}>{vals[current.key]}</span>
          <span className="rs-lbl">{current.label}</span>
        </motion.div>
      </AnimatePresence>
      {/* prev/next */}
      <div className="rs-nav">
        <button className="rs-arrow" onClick={e => goTo(e, (slide - 1 + 4) % 4)}>‹</button>
        <button className="rs-arrow" onClick={e => goTo(e, (slide + 1) % 4)}>›</button>
      </div>
    </div>
  );
};


/* ──────────── COLLEGE CARD (Accordion) ──────────── */
const CollegeCard = ({ college, category, isExpanded, onToggle }) => {
  const isAnna = category === 'anna';
  const courses = college.courses || [];
  const [showDepts, setShowDepts] = useState(false);
  const seats = college.seats || 0;

  React.useEffect(() => {
    if (!isExpanded) setShowDepts(false);
  }, [isExpanded]);

  return (
    <motion.div
      layout
      className={`college-card ${isExpanded ? 'cc-open' : ''}`}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
    >
      {/* ── Header row ── */}
      <div className="cc-header" onClick={onToggle}>
        <div className="cc-rank">
          {isAnna
            ? <span className="rank-num">{college.rank}</span>
            : <Building2 size={20} />
          }
        </div>
        <div className="cc-meta">
          <h3 className="cc-name">{college.name}</h3>
          <div className="cc-loc">
            <MapPin size={12} />
            {college.city || college.Address || college.State || 'Tamil Nadu'}
          </div>
        </div>
        <div className="cc-badges">
          {isAnna ? (
            <>
              {college.type && <span className={`badge ${college.type === 'autonomous' ? 'badge-teal' : 'badge-gray'}`}>{college.type.replace('_', ' ')}</span>}
              <span className="badge badge-indigo">#{college.rank}</span>
            </>
          ) : (
            <>
              <span className="badge badge-gray">{college.Type || 'University'}</span>
              {college.status && <span className="badge badge-teal">{college.status}</span>}
            </>
          )}
        </div>
        <motion.div
          className="cc-chevron"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>

      {/* ── Expanded body ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="cc-body">
              {/* Stats row */}
              <div className="stats-row">
                {isAnna ? (
                  <>
                    <div className="stat-chip">
                      <span className="sc-num">{college.cutoff || '—'}</span>
                      <span className="sc-label">Min Cutoff</span>
                    </div>
                    <div className="stat-chip">
                      <span className="sc-num" style={{ color: 'var(--teal)' }}>{college.fillpct || 0}%</span>
                      <span className="sc-label">Fill Rate</span>
                    </div>
                    <div className="stat-chip stat-chip-seats">
                      <div>
                        <span className="sc-num">{seats}</span>
                        <span className="sc-label">Total Seats</span>
                      </div>
                      {seats > 0 && <RoundBreakdown college={college} />}
                    </div>
                    <div className="stat-chip">
                      <span className="sc-num" style={{ color: 'var(--muted)' }}>{college.code || '—'}</span>
                      <span className="sc-label">Code</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-chip">
                      <span className="sc-num" style={{ color: 'var(--indigo)' }}>{courses.length}</span>
                      <span className="sc-label">Streams</span>
                    </div>
                    <div className="stat-chip">
                      <span className="sc-num">{college.State || 'TN'}</span>
                      <span className="sc-label">State</span>
                    </div>
                    <div className="stat-chip" style={{ flex: 2 }}>
                      <span className="sc-num" style={{ fontSize: '0.9rem' }}>{college.addr || college.Address || 'Tamil Nadu'}</span>
                      <span className="sc-label">Address</span>
                    </div>
                  </>
                )}
              </div>

              {/* Departments */}
              {courses.length > 0 && (
                <div className="dept-section">
                  <button className="dept-toggle" onClick={() => setShowDepts(!showDepts)}>
                    <Eye size={15} />
                    {showDepts ? 'Hide Departments' : 'View All Departments'}
                    <motion.span animate={{ rotate: showDepts ? 180 : 0 }}><ChevronDown size={14} /></motion.span>
                  </button>
                  <AnimatePresence>
                    {showDepts && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <CourseLevels courses={courses} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Course Level Grouper (Surprise: degree-tier tabs) ─── */
const DEGREE_ORDER = ['B.E', 'B.Tech', 'M.E', 'M.Tech'];
const DEGREE_COLORS = {
  'B.E':    { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)',  txt: '#6366f1' },
  'B.Tech': { bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)',  txt: '#14b8a6' },
  'M.E':    { bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.25)',  txt: '#ec4899' },
  'M.Tech': { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  txt: '#f59e0b' },
};

/* Normalize raw degree strings to canonical forms */
const normalizeDeg = (raw) => {
  const d = raw.trim().toUpperCase().replace(/[\.\s]/g, '');
  if (d === 'BE')    return 'B.E';
  if (d === 'BTECH') return 'B.Tech';
  if (d === 'ME')    return 'M.E';
  if (d === 'MTECH') return 'M.Tech';
  return raw.trim(); // keep original for non-eng degrees
};

const CourseLevels = ({ courses }) => {
  // Flatten all branches with normalized degree names
  const allBranches = courses.flatMap(cat =>
    cat.branches.map(br => ({
      deg: normalizeDeg(br[0]),
      rawDeg: br[0],
      name: br[1],
      cat: cat.cat,
    }))
  );

  const engDegSet = new Set(DEGREE_ORDER); // ['B.E','B.Tech','M.E','M.Tech']
  const engBranches  = allBranches.filter(b => engDegSet.has(b.deg));
  const otherBranches = allBranches.filter(b => !engDegSet.has(b.deg));

  // Sort eng by canonical order
  const sortedEng = [...engBranches].sort(
    (a, b) => DEGREE_ORDER.indexOf(a.deg) - DEGREE_ORDER.indexOf(b.deg)
  );

  // Group non-eng by original category label
  const otherByCat = otherBranches.reduce((acc, b) => {
    if (!acc[b.cat]) acc[b.cat] = [];
    acc[b.cat].push(b);
    return acc;
  }, {});

  return (
    <div className="course-levels">
      {/* ── All engineering: one sorted flat list ── */}
      {sortedEng.length > 0 && (
        <div className="cl-section">
          <div className="cl-header">
            <span className="cl-label">🎓 Engineering Programmes</span>
          </div>
          <div className="cl-chips">
            {sortedEng.map((b, i) => {
              const dc = DEGREE_COLORS[b.deg] || {};
              return (
                <span key={i} className="dept-chip" style={{ borderColor: dc.border }}>
                  <span className="dept-deg" style={{ color: dc.txt }}>{b.deg}</span>{b.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Non-engineering categories (Arts, Science, etc.) ── */}
      {Object.entries(otherByCat).map(([cat, branches]) => (
        <div key={cat} className="cl-section cl-other">
          <div className="cl-header">
            <span className="cl-label">📚 {cat}</span>
          </div>
          <div className="cl-chips">
            {branches.map((b, i) => (
              <span key={i} className="dept-chip">
                <span className="dept-deg">{b.deg}</span>{b.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};



/* ─────────────── MAIN APP ─────────────────────── */
const App = () => {
  const [view, setView] = useState('home');
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCollege, setExpandedCollege] = useState(null);

  const filteredColleges = useMemo(() => {
    const base = category === 'anna'
      ? TNEA_DATA.filter(c => !subType || c.type === subType)
      : category === 'university'
      ? (subType === 'deemed' ? DEEMED_DATA : subType === 'private' ? PRIVATE_DATA : [...DEEMED_DATA, ...PRIVATE_DATA])
      : [];

    if (!searchTerm.trim()) return base;
    const term = searchTerm.trim().toLowerCase();

    // short-form / alias expansion
    const shortForms = {
      cse: 'computer science', ece: 'electronics',
      eee: 'electrical', it: 'information technology',
      mech: 'mechanical', civil: 'civil',
      aero: 'aeronautical', auto: 'automobile',
      'non auto': 'non_autonomous', 'non-auto': 'non_autonomous',
      'non autonomous': 'non_autonomous', autonomous: 'autonomous',
    };
    const mapped = shortForms[term] || term;

    return base.filter(c =>
      c.name.toLowerCase().includes(term) ||
      (c.city && c.city.toLowerCase().includes(term)) ||
      (c.code && String(c.code).includes(term)) ||
      // type match: 'non_autonomous', 'autonomous', 'anna'
      (c.type && c.type.toLowerCase().includes(mapped)) ||
      // department / branch search
      (c.courses && c.courses.some(cat =>
        cat.cat.toLowerCase().includes(mapped) ||
        cat.branches.some(br =>
          br[1].toLowerCase().includes(mapped) ||
          br[0].toLowerCase().includes(mapped)
        )
      ))
    );
  }, [category, subType, searchTerm]);

  const openExplorer = (cat) => {
    setCategory(cat); setSubType(''); setSearchTerm(''); setExpandedCollege(null);
    setView('explorer'); window.scrollTo(0, 0);
  };
  const goHome = () => { setView('home'); setCategory(''); window.scrollTo(0, 0); };

  /* card data */
  const cards = [
    {
      id: 'anna', label: 'Anna University', sub: 'TNEA 2025 Engineering Admissions', icon: BookOpen,
      accent: '#6366f1', accentBg: 'rgba(99,102,241,0.08)', count: TNEA_DATA.length,
    },
    {
      id: 'medical', label: 'Medical & Dental', sub: 'MBBS · BDS · Allied Programs', icon: Stethoscope,
      accent: '#ec4899', accentBg: 'rgba(236,72,153,0.08)', count: '—',
    },
    {
      id: 'university', label: 'Universities', sub: 'Deemed & Private TN Campuses', icon: Globe,
      accent: '#14b8a6', accentBg: 'rgba(20,184,166,0.08)', count: DEEMED_DATA.length + PRIVATE_DATA.length,
    },
  ];

  return (
    <div className="root">
      {/* Interactive particle background */}
      <Antigravity />

      {/* Page noise overlay */}
      <div className="noise-overlay" />

      <Navbar onHome={goHome} />

      <AnimatePresence mode="wait">
        {/* ══════════ HOME ══════════ */}
        {view === 'home' && (
          <motion.main
            key="home"
            className="home-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero */}
            <div className="hero">
              <motion.div
                className="hero-eyebrow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={14} /> Tamil Nadu Institution Explorer
              </motion.div>

              <motion.h1
                className="hero-h1"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                Find Your
                <br />
                <span className="h1-accent">Perfect College</span>
              </motion.h1>

              <motion.p
                className="hero-p"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Explore cutoff data, seat allocations, departments, and admission rounds
                <br />across every engineering, medical and university campus in Tamil Nadu.
              </motion.p>
            </div>

            {/* Cards */}
            <div className="cards-row" id="explore">
              {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    className="hero-card"
                    style={{ '--accent': card.accent, '--accent-bg': card.accentBg }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openExplorer(card.id)}
                  >
                    <div className="hc-top">
                      <div className="hc-icon"><Icon size={26} /></div>
                      <span className="hc-count">{card.count} +</span>
                    </div>
                    <h2 className="hc-title">{card.label}</h2>
                    <p className="hc-sub">{card.sub}</p>
                    <div className="hc-cta">
                      Open Explorer <ArrowRight size={16} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats strip */}
            <motion.div
              className="stats-strip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { n: TNEA_DATA.length, l: 'Engineering Colleges' },
                { n: DEEMED_DATA.length, l: 'Deemed Universities' },
                { n: PRIVATE_DATA.length, l: 'Private Universities' },
                { n: '2025', l: 'Admission Cycle' },
              ].map((s, i) => (
                <div key={i} className="strip-item">
                  <span className="strip-n">{s.n}</span>
                  <span className="strip-l">{s.l}</span>
                </div>
              ))}
            </motion.div>
          </motion.main>
        )}

        {/* ══════════ EXPLORER ══════════ */}
        {view === 'explorer' && (
          <motion.main
            key="explorer"
            className="explorer-main"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
          >
            <div className="explorer-inner">
              {/* Back */}
              <motion.button
                className="back-pill"
                onClick={goHome}
                whileHover={{ x: -4 }}
              >
                <ChevronLeft size={16} /> Back
              </motion.button>

              {/* Header */}
              <div className="exp-header">
                <div>
                  <h1 className="exp-title">
                    {category === 'anna' && 'Anna University'}
                    {category === 'university' && 'Universities'}
                    {category === 'medical' && 'Medical & Dental'}
                  </h1>
                  <p className="exp-sub">Tamil Nadu · All Institutions</p>
                </div>
                {category !== 'medical' && (
                  <span className="live-badge"><Zap size={13} /> Live</span>
                )}
              </div>

              {category !== 'medical' ? (
                <>
                  {/* Filters */}
                  <div className="filter-bar">
                    <div className="search-wrap">
                      <Search size={16} className="si" />
                      <input
                        className="search-inp"
                        placeholder="Search by college, city, branch or code…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="filter-tabs">
                      {category === 'anna' ? (
                        <>
                          {[['', 'All'], ['autonomous', 'Autonomous'], ['non_autonomous', 'Non‑Auto']].map(([v, l]) => (
                            <button key={v} className={`ftab ${subType === v ? 'ftab-on' : ''}`} onClick={() => setSubType(v)}>{l}</button>
                          ))}
                        </>
                      ) : (
                        <>
                          {[['', 'All'], ['deemed', 'Deemed'], ['private', 'Private']].map(([v, l]) => (
                            <button key={v} className={`ftab ${subType === v ? 'ftab-on' : ''}`} onClick={() => setSubType(v)}>{l}</button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <p className="result-count">
                    <span>{filteredColleges.length}</span> institutions found
                  </p>

                  {/* List */}
                  <div className="card-list">
                    {filteredColleges.length > 0 ? filteredColleges.map((c) => {
                      const uid = c.code || c.name;
                      return (
                        <CollegeCard
                          key={uid}
                          college={c}
                          category={category}
                          isExpanded={expandedCollege === uid}
                          onToggle={() => setExpandedCollege(expandedCollege === uid ? null : uid)}
                        />
                      );
                    }) : (
                      <div className="empty-state">
                        <Search size={40} />
                        <h3>No results found</h3>
                        <p>Try a different search term or filter</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="coming-soon">
                  <Stethoscope size={64} />
                  <h2>Medical Data Coming Soon</h2>
                  <p>We're curating verified admission data for MBBS, BDS and allied programmes. Check back soon.</p>
                  <button className="cs-btn" onClick={goHome}>Back to Home</button>
                </div>
              )}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
