import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, BookOpen, Stethoscope, Building2,
  Sparkles, Zap, Globe, Eye, GraduationCap, ShieldCheck, PieChart, Info, Mail, Phone, ExternalLink, User, Train, Bus,
  IndianRupee, X, MessageSquare, CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import { TNEA_DATA, DEEMED_DATA, PRIVATE_DATA } from './data';
import TNEA_PDF_INFO from './tnea_pdf_data.json';
import TNEA_COURSES_INFO from './tnea_courses_data.json';
import TNEA_MATRIX_DATA from './branch_matrix_data.json';
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

/* ─────────────── ROUND DISTRIBUTION (Dashboard) ─────────────────── */
const SeatDistribution = ({ college, seats }) => {
  const r1 = college.r1 || 0;
  const r2 = college.r2 || 0;
  const r3 = college.r3 || 0;
  const filled = college.filled || r1 + r2 + r3 || 0;
  const vacancy = Math.max(0, seats - filled);
  const total = Math.max(seats, filled, 1);

  const rounds = [
    { label: 'Round 1', val: r1, color: '#6366f1', bg: 'rgba(99,102,241,0.08)', glow: 'rgba(99,102,241,0.25)', border: 'rgba(99,102,241,0.3)' },
    { label: 'Round 2', val: r2, color: '#ec4899', bg: 'rgba(236,72,153,0.08)', glow: 'rgba(236,72,153,0.25)', border: 'rgba(236,72,153,0.3)' },
    { label: 'Round 3', val: r3, color: '#14b8a6', bg: 'rgba(20,184,166,0.08)', glow: 'rgba(20,184,166,0.25)', border: 'rgba(20,184,166,0.3)' },
  ];

  const vacancyColor = vacancy > 100 ? '#10b981' : vacancy > 30 ? '#f59e0b' : '#ef4444';
  const vacancyBg = vacancy > 100 ? 'rgba(16,185,129,0.08)' : vacancy > 30 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)';
  const vacancyGlow = vacancy > 100 ? 'rgba(16,185,129,0.25)' : vacancy > 30 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)';
  const vacancyLabel = vacancy > 100 ? 'Seats Available' : vacancy > 30 ? 'Limited Seats' : vacancy > 0 ? 'Almost Full!' : 'Fully Filled';

  const maxRound = Math.max(r1, r2, r3);

  return (
    <div className="sd-section" onClick={e => e.stopPropagation()}>
      <div className="sd-header">
        <span className="sd-header-label">Round-wise Seat Distribution</span>
        <span className="sd-live-badge"><span className="sd-live-dot" />Live 2025</span>
      </div>
      <div className="sd-grid">
        {rounds.map(({ label, val, color, bg, glow, border }) => {
          const pct = Math.round((val / total) * 100);
          const isBiggest = val === maxRound && val > 0;
          return (
            <motion.div
              key={label}
              className="sd-card"
              style={{ '--c': color, '--bg': bg, '--glow': glow, '--border': border }}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {isBiggest && (
                <div className="sd-crown" title="Most seats filled in this round">🏆</div>
              )}
              <div className="sd-label">{label}</div>
              <div className="sd-big-num">{val.toLocaleString()}</div>
              <div className="sd-bar-wrap">
                <motion.div
                  className="sd-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                />
              </div>
              <div className="sd-pct">{pct}% of total</div>
            </motion.div>
          );
        })}

        {/* Balance / Vacancy Card */}
        <motion.div
          className="sd-card sd-vacancy"
          style={{ '--c': vacancyColor, '--bg': vacancyBg, '--glow': vacancyGlow, '--border': vacancyGlow }}
          whileHover={{ y: -4, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="sd-vacancy-icon">{vacancy > 100 ? '✅' : vacancy > 30 ? '⚠️' : '🔴'}</div>
          <div className="sd-label">Balance Seats</div>
          <div className="sd-big-num">{vacancy.toLocaleString()}</div>
          <div className="sd-vacancy-tag" style={{ background: vacancyBg, color: vacancyColor, border: `1px solid ${vacancyGlow}` }}>
            {vacancyLabel}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ──────── PLACEMENT PERCENTAGE (Animated Donut) ──────── */
const PlacementRing = ({ pct }) => {
  const rad = 22;
  const c = 2 * Math.PI * rad;
  const off = c - (pct / 100) * c;
  const color = pct >= 85 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="placement-ring-wrap" title="Placement %">
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle className="pr-bg" cx="27" cy="27" r={rad} />
        <motion.circle 
          className="pr-val" 
          cx="27" cy="27" r={rad} 
          style={{ '--c': color }}
          strokeDasharray={c} 
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
        />
      </svg>
      <div className="pr-inner">{pct}%</div>
    </div>
  );
};

/* ──────── COUNSELING MATRIX (Seat Balance Table) ──────── */
const CounselingMatrix = ({ code }) => {
  const matrix = TNEA_MATRIX_DATA[code] || [];
  if (matrix.length === 0) return <div className="no-matrix">Seat matrix data not available for this institution.</div>;

  return (
    <div className="counseling-matrix-wrap" onClick={e => e.stopPropagation()}>
      <div className="cm-header-premium">
        <div className="cm-h-left">
          <PieChart size={18} />
          <div className="cm-h-titles">
            <span className="cm-h-main">OFFICIAL FULL SEAT MATRIX</span>
            <span className="cm-h-sub">GENERAL ACADEMIC MATRIX • 2025 SESSION</span>
          </div>
        </div>
        <div className="cm-h-right">
          <span className="tag-live-pulse" />
          <span className="cm-h-live">LIVE ANALYTICS</span>
        </div>
      </div>
      <div className="cm-table-scroll">
        <table className="cm-table-premium">
          <thead>
            <tr>
              <th className="th-branch">BRANCH / COURSE NAME</th>
              <th>OC</th>
              <th>BC</th>
              <th>BCM</th>
              <th>MBC</th>
              <th>SC</th>
              <th>SCA</th>
              <th>ST</th>
              <th className="th-total">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => {
              const total = row.seats.reduce((a,b)=>a+b, 0);
              return (
                <tr key={i} className={total === 0 ? 'row-empty' : ''}>
                  <td className="td-branch">
                    <div className="td-b-code">{row.code}</div>
                    <div className="td-b-name">{row.name}</div>
                  </td>
                  {row.seats.map((s, si) => (
                    <td key={si} className={`td-num ${s === 0 ? 'val-zero' : 'val-high'}`}>{s}</td>
                  ))}
                  <td className="td-total-val">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="cm-footer-premium">
        <Info size={12} />
        <span>Data represents the complete seat matrix for the 2025 session.</span>
      </div>
    </div>
  );
};

/* ── QUERY MODAL (Fees / Admission Flow) ───────────── */
const QueryModal = ({ isOpen, onClose, collegeName }) => {
  const [step, setStep] = useState(1); 
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhone('');
      setOtp('');
    }
  }, [isOpen]);

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.95 }}
        className="query-modal"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -15, opacity: 0 }} className="modal-content">
              <div className="modal-icon-wrap"><MessageSquare className="m-icon" /></div>
              <h2 className="modal-h">Interested in {collegeName}?</h2>
              <p className="modal-p">Choose an option for enrollment support & fee structure.</p>
              <div className="query-options">
                <button className="q-opt" onClick={() => setStep(2)}>
                  <div className="q-opt-icon"><IndianRupee size={18} /></div>
                  <div className="q-opt-text">
                    <strong>Fees Structure</strong>
                    <span>Detailed semester-wise fee breakdown</span>
                  </div>
                  <ArrowRight size={16} className="q-arrow" />
                </button>
                <button className="q-opt" onClick={() => setStep(2)}>
                  <div className="q-opt-icon"><Building2 size={18} /></div>
                  <div className="q-opt-text">
                    <strong>Admission Details</strong>
                    <span>Management & Community quota entry</span>
                  </div>
                  <ArrowRight size={16} className="q-arrow" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -15, opacity: 0 }} className="modal-content">
              <h2 className="modal-h">Quick Verification</h2>
              <p className="modal-p">Enter your number to receive information via WhatsApp.</p>
              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input type="tel" placeholder="10 Digit Number" autoFocus value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g,''))} />
              </div>
              {phone.length === 10 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="form-group">
                  <label>OTP SENT (DUMMY: 1234)</label>
                  <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))} />
                </motion.div>
              )}
              <button disabled={otp !== '1234' || loading} className={`send-query-btn ${otp === '1234' ? 'active' : ''}`} onClick={handleSend}>
                {loading ? 'PROCESSING...' : 'SEND QUERY'}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content-success">
              <div className="check-ring"><CheckCircle2 size={54} /></div>
              <h2 className="modal-h">Query Sent Successfully!</h2>
              <p className="modal-p">We have received your interest for <strong>{collegeName}</strong>.</p>
              <div className="success-banner">OUR ADMIN TEAM WILL CONTACT YOU AS SOON AS POSSIBLE</div>
              <button className="finish-btn" onClick={onClose}>BACK TO SEARCH</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const CollegeCard = ({ college, category, isExpanded, onToggle, onOpenQuery }) => {
  const isAnna = category === 'anna';
  const codeKey = String(college.code || '').trim();
  const tneaCourses = (codeKey && TNEA_COURSES_INFO[codeKey]) ? TNEA_COURSES_INFO[codeKey] : null;
  const courses = tneaCourses || (college.courses || []);
  const [showDepts, setShowDepts] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const seats = college.seats || 0;
  const filled = college.filled || 0;
  const fillpct = college.fillpct || 0;

  useEffect(() => {
    if (!isExpanded) {
      setShowDepts(false);
      setShowMore(false);
      setShowMatrix(false);
    }
  }, [isExpanded]);

  const toggleDepts = () => { setShowDepts(!showDepts); setShowMore(false); setShowMatrix(false); };
  const toggleMore = () => { setShowMore(!showMore); setShowDepts(false); setShowMatrix(false); };
  const toggleMatrix = () => { setShowMatrix(!showMatrix); setShowDepts(false); setShowMore(false); };

  const placement = useMemo(() => {
    if (college.placement) return college.placement;
    const cut = college.cutoff || 120;
    const fill = college.fillpct || 50;
    return Math.min(99, Math.max(45, Math.floor((cut/200)*60 + (fill/100)*40)));
  }, [college]);

  return (
    <motion.div layout className={`college-card ${isExpanded ? 'cc-open' : ''}`} transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}>
      <div className="cc-header" onClick={onToggle}>
        <div className="cc-rank">{isAnna ? <span className="rank-num">{college.rank}</span> : <Building2 size={20} />}</div>
        <div className="cc-meta">
          <h3 className="cc-name">{college.name}</h3>
          <div className="cc-loc"><MapPin size={12} /> {college.city || college.Address || college.State || 'Tamil Nadu'}</div>
        </div>
        <div className="cc-badges">
          {isAnna ? (
            <>
              {college.type && <span className={`badge ${({'university_dept':'badge-purple','government':'badge-blue','govt_aided':'badge-emerald','cecri_cipet':'badge-amber','constituent':'badge-cyan','autonomous':'badge-teal'})[college.type] || 'badge-gray'}`}>{({'university_dept':'University Dept','government':'Government','govt_aided':'Govt Aided','cecri_cipet':'CECRI/CIPET','constituent':'Constituent','autonomous':'Autonomous','non_autonomous':'Self-Finance'})[college.type] || college.type}</span>}
              <span className="badge badge-indigo">#{college.rank}</span>
            </>
          ) : <span className="badge badge-gray">{college.Type || 'University'}</span>}
        </div>
        <motion.div className="cc-chevron" animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
          <ChevronDown size={18} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
            <div className="cc-body">
              {isAnna && (
                <div className="cc-featured-stats-wrap">
                  <div className="cc-code-banner">
                    <span className="cb-label">TNEA COLLEGE CODE</span>
                    <span className="cb-val">{college.code}</span>
                  </div>
                  <div className="cc-stats-grid">
                    <div className="cs-box"><div className="cs-val">{seats.toLocaleString()}</div><div className="cs-lbl">TOTAL SEATS</div><div className="cs-sublbl">2025 SESSION</div></div>
                    <div className="cs-box"><div className="cs-val" style={{ color: 'var(--teal)' }}>{(seats - filled).toLocaleString()}</div><div className="cs-lbl">TOTAL VACANT SEATS</div><div className="cs-sublbl">AFTER ROUND 1-3</div></div>
                    <div className="cs-box highlighted"><div className="cs-val" style={{ color: 'var(--indigo)' }}>{fillpct}%</div><div className="cs-lbl">% SEATS FILLED</div><div className="cs-sublbl">OVERALL RATE</div></div>
                  </div>
                </div>
              )}

              {isAnna && (
                <div className="stats-row">
                  <div className="stat-chip" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1.5 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="sc-num">{placement}%</span><span className="sc-label">Placement %</span>
                    </div>
                    <PlacementRing pct={placement} />
                  </div>
                  <div className="stat-chip"><span className="sc-num">{college.cutoff || '—'}</span><span className="sc-label">Min Cutoff</span></div>
                </div>
              )}
              
              {isAnna && seats > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div className="section-divider">ROUND-WISE DISTRIBUTION</div>
                  <SeatDistribution college={college} seats={seats} />
                </div>
              )}

              <div className="dept-section">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {isAnna && <button className="dept-toggle" onClick={toggleMore}><Info size={15} /> {showMore ? 'Hide Campus Info' : 'Campus Info'} <motion.span animate={{ rotate: showMore ? 180 : 0 }}><ChevronDown size={14} /></motion.span></button>}
                  {isAnna && <button className={`dept-toggle ${showMatrix ? 'active' : ''}`} style={showMatrix ? {borderColor: 'var(--indigo)', background: 'rgba(99,102,241,0.05)', color: 'var(--indigo)'} : {}} onClick={toggleMatrix}><PieChart size={15} /> {showMatrix ? 'Hide Seat Matrix' : 'Seat Matrix 2025'} <motion.span animate={{ rotate: showMatrix ? 180 : 0 }}><ChevronDown size={14} /></motion.span></button>}
                  {courses.length > 0 && <button className="dept-toggle" onClick={toggleDepts}><Eye size={15} /> {showDepts ? 'Hide Branches' : `All Branches (${courses.reduce((acc, cat) => acc + (cat.branches ? cat.branches.length : 0), 0)})`} <motion.span animate={{ rotate: showDepts ? 180 : 0 }}><ChevronDown size={14} /></motion.span></button>}
                  <button className="dept-toggle fees-btn-special" onClick={(e) => { e.stopPropagation(); onOpenQuery(college.name); }}><IndianRupee size={15} /> Fees / Query <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowRight size={14} /></motion.span></button>
                </div>

                <AnimatePresence>
                  {showMatrix && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}><CounselingMatrix code={college.code} /></motion.div>}
                  {showMore && TNEA_PDF_INFO[college.code] && (
                    <motion.div className="more-info-grid" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', paddingBottom: 16 }}>
                      <div className="pdf-info-card">
                        <div className="pi-row"><User size={14}/><span><strong>Principal:</strong> {TNEA_PDF_INFO[college.code].principal || 'N/A'}</span></div>
                        <div className="pi-row"><Phone size={14}/><span><strong>Phone:</strong> {TNEA_PDF_INFO[college.code].phone || 'N/A'}</span></div>
                        <div className="pi-row"><Mail size={14}/><span><strong>Email:</strong> {TNEA_PDF_INFO[college.code].email || 'N/A'}</span></div>
                        <div className="pi-row"><ExternalLink size={14}/><span><strong>Website:</strong> {TNEA_PDF_INFO[college.code].website || 'N/A'}</span></div>
                      </div>
                      <div className="pdf-info-card">
                        <div className="pi-row"><Train size={14}/><span><strong>Railway:</strong> {TNEA_PDF_INFO[college.code].nearest_railway || 'N/A'}</span></div>
                        <div className="pi-row"><Bus size={14}/><span><strong>Transport:</strong> {TNEA_PDF_INFO[college.code].transport || 'Yes'}</span></div>
                        <div className="pi-row"><Building2 size={14}/><span><strong>Hostel:</strong> Boys & Girls Available</span></div>
                      </div>
                    </motion.div>
                  )}
                  {showDepts && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}><CourseLevels courses={courses} /></motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Course Levels ── */
const CourseLevels = ({ courses }) => {
  const normalizeDeg = (raw) => {
    const d = String(raw).trim().toUpperCase().replace(/[.\s]/g, '');
    if (d === 'BE') return 'B.E';
    if (d === 'BTECH') return 'B.Tech';
    if (d === 'ME') return 'M.E';
    if (d === 'MTECH') return 'M.Tech';
    return raw;
  };

  // eslint-disable-next-line no-unused-vars
  const DEG_COLORS = { 
    'B.E': { bg: 'rgba(99,102,241,0.08)', txt: '#6366f1' }, 
    'B.Tech': { bg: 'rgba(20,184,166,0.08)', txt: '#14b8a6' }, 
    'M.E': { bg: 'rgba(236,72,153,0.08)', txt: '#ec4899' }, 
    'M.Tech': { bg: 'rgba(245,158,11,0.08)', txt: '#f59e0b' } 
  };

  return (
    <div className="course-levels-premium">
      <div className="clp-section">
        <div className="clp-head"><GraduationCap size={18} /><span>Offered Engineering Courses</span></div>
        <div className="clp-grid">
          {courses.map((cat, ci) => (
            cat.branches.map((br, bi) => {
              const deg = normalizeDeg(br[0]);
              const dc = DEG_COLORS[deg] || { bg: '#f8fafc', txt: '#64748b' };
              return (
                <div key={`${ci}-${bi}`} className="branch-card-modern" style={{'--accent': dc.txt, '--bg': dc.bg}}>
                  <div className="bc-deg">{deg}</div>
                  <div className="bc-name" style={{ textTransform: 'uppercase' }}>{br[1]}</div>
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────── MAIN APP ─────────────────────── */
const App = () => {
  const [view, setView] = useState('home');
  const [aiMode, setAiMode] = useState('opportunities');
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCollege, setExpandedCollege] = useState(null);
  const [queryModal, setQueryModal] = useState({ open: false, college: '' });
  const [cityFilter, setCityFilter] = useState('');
  const [fillFilter, setFillFilter] = useState('');
  const [cutoffFilter, setCutoffFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique cities for the dropdown
  const cityOptions = useMemo(() => {
    const cities = new Set();
    TNEA_DATA.forEach(c => { if (c.city) cities.add(c.city); });
    return ['', ...Array.from(cities).sort()];
  }, []);

  // Build department lookup for search
  const deptLookup = useMemo(() => {
    const map = {};
    Object.entries(TNEA_COURSES_INFO).forEach(([code, cats]) => {
      const depts = [];
      (Array.isArray(cats) ? cats : []).forEach(cat => {
        if (cat.branches) cat.branches.forEach(b => {
          if (Array.isArray(b) && b[1]) depts.push(b[1].toLowerCase());
        });
      });
      map[code] = depts;
    });
    return map;
  }, []);

  const activeFilterCount = [subType, cityFilter, fillFilter, cutoffFilter].filter(Boolean).length;

  const filteredColleges = useMemo(() => {
    let base = category === 'anna'
      ? TNEA_DATA
      : (subType === 'deemed' ? DEEMED_DATA : subType === 'private' ? PRIVATE_DATA : [...DEEMED_DATA, ...PRIVATE_DATA]);

    // Category/type filter (for anna)
    if (category === 'anna' && subType) {
      base = base.filter(c => c.type === subType);
    }

    // City filter
    if (cityFilter) {
      base = base.filter(c => c.city === cityFilter);
    }

    // Fill % filter
    if (fillFilter) {
      base = base.filter(c => {
        const fp = c.fillpct || 0;
        if (fillFilter === '90') return fp >= 90;
        if (fillFilter === '70') return fp >= 70 && fp < 90;
        if (fillFilter === '50') return fp >= 50 && fp < 70;
        if (fillFilter === 'below50') return fp < 50;
        return true;
      });
    }

    // Cutoff filter
    if (cutoffFilter) {
      base = base.filter(c => {
        const co = c.cutoff || 0;
        if (cutoffFilter === '190') return co >= 190;
        if (cutoffFilter === '180') return co >= 180 && co < 190;
        if (cutoffFilter === '170') return co >= 170 && co < 180;
        if (cutoffFilter === '160') return co >= 160 && co < 170;
        if (cutoffFilter === 'below160') return co < 160;
        return true;
      });
    }

    // Search (name, code, city, AND department)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      base = base.filter(c => {
        if (c.name.toLowerCase().includes(term)) return true;
        if (String(c.code).includes(term)) return true;
        if (c.city && c.city.toLowerCase().includes(term)) return true;
        // Department search
        const code = String(c.code).trim();
        const depts = deptLookup[code];
        if (depts && depts.some(d => d.includes(term))) return true;
        return false;
      });
    }

    return base;
  }, [category, subType, searchTerm, cityFilter, fillFilter, cutoffFilter, deptLookup]);

  const [deptDetailsCollege, setDeptDetailsCollege] = useState(TNEA_DATA[0]?.code || '');
  const [deptSearchTerm, setDeptSearchTerm] = useState('');

  const goHome = () => { setView('home'); window.scrollTo(0, 0); };
  const openExplorer = (cat) => { setCategory(cat); setView('explorer'); window.scrollTo(0, 0); };
  const openAI = (mode) => { setAiMode(mode); setView('ai-counselor'); window.scrollTo(0,0); };
  const openDeptDetails = (code = TNEA_DATA[0]?.code) => { setDeptDetailsCollege(code); setDeptSearchTerm(''); setView('dept-details'); window.scrollTo(0, 0); };

  return (
    <div className="root">
      <Antigravity />
      <div className="noise-overlay" />
      <Navbar onHome={goHome} />
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main key="home" className="home-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="hero">
              <div className="hero-eyebrow"><Sparkles size={14} /> Tamil Nadu Institution Explorer</div>
              <h1 className="hero-h1">Find Your <span className="h1-accent">Perfect College</span></h1>
              <p className="hero-p">Explore cutoff data, seats, and verified institution details for 2025.</p>
            </div>
            <div className="cards-row" id="explore">
              <motion.div className="hero-card hc-anna" onClick={() => openExplorer('anna')} whileHover={{ y: -10, scale: 1.02 }}>
                <div className="hc-top"><div className="hc-icon"><BookOpen size={26} /></div><span className="hc-count">{TNEA_DATA.length}+</span></div>
                <h2 className="hc-title">Anna University</h2><p className="hc-sub">TNEA 2025 Engineering · Cutoffs · Seats</p>
                <div className="hc-cta">Explore Admissions <ArrowRight size={16} /></div>
              </motion.div>

              <motion.div className="hero-card hc-med" onClick={() => openExplorer('medical')} whileHover={{ y: -10, scale: 1.02 }}>
                <div className="hc-top"><div className="hc-icon"><Stethoscope size={26} /></div><span className="hc-count">Soon</span></div>
                <h2 className="hc-title">Medical & Dental</h2><p className="hc-sub">NEET · MBBS · BDS · Allied Health</p>
                <div className="hc-badge-soon">COMING SOON</div>
                <div className="hc-cta">Curating Data <ArrowRight size={16} /></div>
              </motion.div>

              <motion.div className="hero-card hc-univ" onClick={() => openExplorer('university')} whileHover={{ y: -10, scale: 1.02 }}>
                <div className="hc-top"><div className="hc-icon"><Globe size={26} /></div><span className="hc-count">{DEEMED_DATA.length + PRIVATE_DATA.length}+</span></div>
                <h2 className="hc-title">Universities</h2><p className="hc-sub">Deemed & Private TN Campuses · Merit</p>
                <div className="hc-cta">Explore Universities <ArrowRight size={16} /></div>
              </motion.div>
            </div>

            {/* Premium AI Guidance Bottom Bar */}
            <div className="home-bottom-actions">
              <div className="ba-group">
                <span className="ba-label">AI Career Counselor · Powered by Claude 4.6</span>
                <div className="ba-btns">
                  <motion.button className="ba-btn" onClick={() => openAI('opportunities')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Zap size={16} />
                    <span>Department Opportunities</span>
                  </motion.button>
                  <motion.button className="ba-btn" onClick={() => openAI('streams')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Sparkles size={16} />
                    <span>Which stream to choose?</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.main>
        )}
        {view === 'explorer' && (
          <motion.main key="explorer" className="explorer-main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="explorer-inner">
              <button className="back-pill" onClick={goHome}><ChevronLeft size={16} /> Back</button>
              <div className="exp-header">
                <div>
                  <h1 className="exp-title">{category === 'anna' ? 'Anna University (TNEA)' : 'Universities'}</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span className="live-badge"><Zap size={13} /> Live 2025</span>
                  {category === 'anna' && (
                    <button className="dept-details-btn-header" onClick={() => openDeptDetails()}>
                      <BookOpen size={16} />
                      <span>DEPARTMENT DETAILS</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="filter-bar">
                <div className="search-wrap"><Search size={16} className="si" /><input className="search-inp" placeholder="Search college, city, code or department..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="filter-tabs-row">
                  <div className="filter-tabs">
                    <button className={`ftab ${subType===''?'ftab-on':''}`} onClick={()=>setSubType('')}>All ({category === 'anna' ? TNEA_DATA.length : DEEMED_DATA.length + PRIVATE_DATA.length})</button>
                    {category === 'anna' 
                      ? [
                          ['university_dept','🏛️ University Department'],
                          ['government','🏢 Government Colleges'],
                          ['govt_aided','🤝 Government Aided'],
                          ['cecri_cipet','🔬 CECRI & CIPET'],
                          ['constituent','🎓 Constituent Colleges'],
                          ['autonomous','⭐ Autonomous Colleges'],
                          ['non_autonomous','📋 Non-Autonomous']
                        ].map(([v,l])=><button key={v} className={`ftab ${subType===v?'ftab-on':''}`} onClick={()=>setSubType(v)}>{l}</button>)
                      : [['deemed','Deemed University'],['private','Private University']].map(([v,l])=><button key={v} className={`ftab ${subType===v?'ftab-on':''}`} onClick={()=>setSubType(v)}>{l}</button>)
                    }
                  </div>
                  {category === 'anna' && (
                    <button className={`filter-toggle-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                      <SlidersHorizontal size={15} /> Filters {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
                    </button>
                  )}
                </div>
                {/* Advanced Filters Panel */}
                {showFilters && category === 'anna' && (
                  <motion.div className="adv-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="af-group">
                      <label className="af-label">🏙️ City</label>
                      <select className="af-select" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                        <option value="">All Cities</option>
                        {cityOptions.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="af-group">
                      <label className="af-label">📊 Fill %</label>
                      <select className="af-select" value={fillFilter} onChange={e => setFillFilter(e.target.value)}>
                        <option value="">Any</option>
                        <option value="90">90-100% (High Demand)</option>
                        <option value="70">70-89%</option>
                        <option value="50">50-69%</option>
                        <option value="below50">Below 50%</option>
                      </select>
                    </div>
                    <div className="af-group">
                      <label className="af-label">🎯 Cutoff</label>
                      <select className="af-select" value={cutoffFilter} onChange={e => setCutoffFilter(e.target.value)}>
                        <option value="">Any</option>
                        <option value="190">190+ (Elite)</option>
                        <option value="180">180-190</option>
                        <option value="170">170-180</option>
                        <option value="160">160-170</option>
                        <option value="below160">Below 160</option>
                      </select>
                    </div>
                    {activeFilterCount > 0 && (
                      <button className="af-clear" onClick={() => { setCityFilter(''); setFillFilter(''); setCutoffFilter(''); setSubType(''); }}>✕ Clear All</button>
                    )}
                  </motion.div>
                )}
              </div>
              <div className="results-info">
                <span className="results-count">{filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''} found</span>
                {activeFilterCount > 0 && <span className="active-filter-pills">{subType && <span className="af-pill">{({'university_dept':'University Department','government':'Government Colleges','govt_aided':'Government Aided','cecri_cipet':'CECRI & CIPET','constituent':'Constituent Colleges','autonomous':'Autonomous Colleges','non_autonomous':'Non-Autonomous'})[subType]}<X size={12} onClick={()=>setSubType('')}/></span>}{cityFilter && <span className="af-pill">{cityFilter}<X size={12} onClick={()=>setCityFilter('')}/></span>}{fillFilter && <span className="af-pill">Fill Rate: {fillFilter}%<X size={12} onClick={()=>setFillFilter('')}/></span>}{cutoffFilter && <span className="af-pill">Min. Cutoff: {cutoffFilter}<X size={12} onClick={()=>setCutoffFilter('')}/></span>}</span>}
              </div>
              <div className="card-list">
                {filteredColleges.map(c => {
                  const uid = c.code || c.name;
                  return (
                    <CollegeCard 
                      key={uid} 
                      college={c} 
                      category={category} 
                      isExpanded={expandedCollege === uid} 
                      onToggle={() => setExpandedCollege(expandedCollege === uid ? null : uid)} 
                      onOpenQuery={(name) => setQueryModal({ open: true, college: name })} 
                    />
                  );
                })}
              </div>
            </div>
          </motion.main>
        )}
        {view === 'dept-details' && (
          <motion.main key="dept-details" className="explorer-main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DepartmentDetailsPage
              collegeCode={deptDetailsCollege}
              searchTerm={deptSearchTerm}
              onSearchChange={setDeptSearchTerm}
              onSelectCollege={setDeptDetailsCollege}
              onBack={() => setView('explorer')}
            />
          </motion.main>
        )}
        {view === 'ai-counselor' && (
          <motion.main key="ai-counselor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <AICounselorPage mode={aiMode} onBack={goHome} />
          </motion.main>
        )}
      </AnimatePresence>
      <QueryModal isOpen={queryModal.open} onClose={()=>setQueryModal({open:false, college:''})} collegeName={queryModal.college} />
    </div>
  );
};

/* ─── DEPT OPPORTUNITIES — 8 Deep Questions ─── */
const DEPT_QUESTIONS = [
  {
    id: 'field_interest',
    q: 'Which broad area excites you the most?',
    hint: 'This helps us figure out Engineering vs Medical vs Arts & Science.',
    options: ['Technology & Computers', 'Machines, Vehicles & Manufacturing', 'Human Body & Healthcare', 'Circuits, Power & Electronics', 'Buildings, Roads & Infrastructure', 'Chemistry, Environment & Materials', 'Biology, Genetics & Research', 'Fine Arts, Literature or Social Science']
  },
  {
    id: 'subject_strength',
    q: 'Which school subject do you genuinely find easy?',
    hint: 'Not just what you scored high — what felt natural?',
    options: ['Maths & Physics', 'Biology & Chemistry', 'Computer Science', 'Economics & Accountancy', 'English & Languages', 'History & Social Studies', 'Chemistry alone', 'All equally']
  },
  {
    id: 'work_type',
    q: 'What kind of work do you imagine doing daily?',
    hint: 'Think about your ideal weekday.',
    options: ['Writing code and building software', 'Treating patients or running tests', 'Designing structures or blueprints', 'Operating or maintaining machines', 'Teaching or counseling people', 'Conducting experiments in a lab', 'Drawing, designing or creating visuals', 'Analysing data and generating reports']
  },
  {
    id: 'work_env',
    q: 'Where would you prefer to work?',
    hint: 'Your ideal daily environment matters a lot.',
    options: ['Office/IT park (indoors, desk)', 'Hospital, clinic or lab', 'Construction site or field', 'Factory or workshop floor', 'Courtroom or government office', 'University or research centre', 'From home or remote', 'Anywhere — I like variety']
  },
  {
    id: 'strength',
    q: 'What is your biggest natural strength?',
    hint: 'What others already say you are good at.',
    options: ['Quick logical thinking', 'Memory and attention to detail', 'Creativity and imagination', 'Empathy and people skills', 'Leadership and decision-making', 'Communication and expression', 'Hands-on building and fixing', 'Research and reading']
  },
  {
    id: 'career_goal',
    q: 'What matters most to you in your future career?',
    hint: 'Be honest — there is no wrong answer!',
    options: ['Very high salary (₹20L+)', 'Helping and serving others', 'Fame and social recognition', 'Job security and stability', 'Independence / own business', 'Constant innovation & challenges', 'Work-life balance', 'Contributing to national development']
  },
  {
    id: 'role_model',
    q: 'Which type of professional do you admire most?',
    hint: 'Who would you like to become in 15 years?',
    options: ['A software engineer at Google', 'A doctor or surgeon', 'An IAS / IPS officer', 'An entrepreneur / startup founder', 'A scientist or researcher', 'A civil or structural engineer', 'A lawyer or judge', 'An artist, writer, or professor']
  },
  {
    id: 'neet_jee',
    q: 'Are you preparing for JEE, NEET, or neither?',
    hint: 'This tells us which competitive stream you are targeting.',
    options: ['JEE (Engineering entrance)', 'NEET (Medical entrance)', 'Both — still deciding', 'Neither — I prefer arts/law/commerce', 'CLAT (Law)', 'TNEA / State-level engineering', 'I have not decided yet']
  }
];

/* ─── STREAM GUIDE — 8 Broad Life-Goal Questions ─── */
const STREAM_QUESTIONS = [
  {
    id: 'life_goal',
    q: 'What is your biggest life goal?',
    hint: 'Forget marks or pressure — what truly matters to you?',
    options: ['Make a lot of money', 'Help and heal people', 'Change society or make a law', 'Create something new (art, tech, product)', 'Serve the nation (army, IAS, etc.)', 'Teach and inspire others', 'Discover new things through research', 'Build my own company']
  },
  {
    id: 'passion',
    q: 'What topic can you talk about for hours without getting bored?',
    hint: 'Think about what you read or watch even without anyone asking.',
    options: ['Science and technology', 'Human body, medicine, or health', 'Justice, law, and rights', 'History, literature, or culture', 'Business, markets, or economics', 'Computers and coding', 'Nature, animals, or environment', 'Politics and society']
  },
  {
    id: 'school_bg',
    q: 'What is your current school stream (Class 12)?',
    hint: 'This helps us understand what doors are open for you.',
    options: ['PCM — Physics, Chemistry, Maths (No Biology)', 'PCB — Physics, Chemistry, Biology (No Maths)', 'PCMB — All four subjects', 'Commerce with / without Maths', 'Arts / Humanities', 'Not yet in 12th — still Class 10', 'Completed 12th — exploring options']
  },
  {
    id: 'social_skills',
    q: 'How would you describe yourself socially?',
    hint: 'Your personality type shapes your ideal career.',
    options: ['I love debating and arguing logically', 'I prefer working alone with deep focus', 'I love being in a team and leading', 'I like helping and listening to people', 'I am creative and think out of the box', 'I love numbers and patterns', 'I am good at performing or presenting', 'I am quiet but very observant']
  },
  {
    id: 'role_preference',
    q: 'What role would you enjoy the most?',
    hint: 'Think 5 years into the future.',
    options: ['Doctor treating patients', 'Engineer building systems', 'Lawyer arguing in court', 'Professor or teacher', 'Government officer (IAS/IPS)', 'Scientist in a lab', 'Businessman or entrepreneur', 'Writer, journalist, or artist']
  },
  {
    id: 'dislike',
    q: 'What would you NEVER want to do in your career?',
    hint: 'Ruling out things helps narrow down what suits you.',
    options: ['Dealing with blood or illness', 'Sitting at a desk all day', 'Working in physical/field conditions', 'Arguing or fighting cases in law', 'Doing lots of maths and calculation', 'Memorizing huge amounts of content', 'Managing people and teams', 'Working alone without human interaction']
  },
  {
    id: 'duration',
    q: 'How many years of study are you willing to commit to?',
    hint: 'Some streams like MBBS or Law take many years.',
    options: ['3–4 years (fast career start)', '5–6 years (focused professional degree)', '7–9 years (MBBS, long-term goal)', 'As long as needed — I am committed', 'I prefer short professional courses first', 'Not sure yet']
  },
  {
    id: 'tam_culture',
    q: 'What does your family prefer for your future?',
    hint: 'Family expectation is a real factor in Tamil Nadu — be honest.',
    options: ['Engineering at good college', 'MBBS or medical field', 'Government job (IAS / IPS / PSU)', 'Law or civil services', 'Arts, sports, or creative field', 'Business or entrepreneurship', 'They support whatever I choose', 'I have not discussed it with them']
  }
];

const AICounselorPage = ({ mode, onBack }) => {
  const [phase, setPhase] = useState('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = React.useRef(null);

  // Pick the right question set
  const questions = mode === 'opportunities' ? DEPT_QUESTIONS : STREAM_QUESTIONS;

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleVerify = () => { if (otp === '1234') setPhase('quiz'); };

  const handleAnswer = async (option) => {
    const q = questions[qIndex];
    const newAns = { ...answers, [q.id]: option };
    setAnswers(newAns);

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setMessages([]);
      setIsTyping(true);
      setPhase('chat');

      const profileLines = questions.map(q => `${q.q}\n→ ${newAns[q.id]}`).join('\n\n');

      const systemPrompt = mode === 'opportunities'
        ? `You are an expert Career Counselor. Analyze the 8 profiling questions and recommend the TOP 3 most suitable departments.
BE EXTREMELY CONCISE AND PRECISE. Use short sentences. Use this exact structure for each:
1. **[DEPARTMENT NAME]** (as a bold heading)
2. **Why You?**: 1-2 short sentences on why it fits.
3. **Career Stats**: Short bullet points for Jobs & Salaries.
4. **Top Sectors**: 3-4 keywords only.
Keep the total output short and sharp.`
        : `You are an expert Stream Selection Advisor. Analyze the 8 profiling questions and recommend the TOP 2-3 most suitable streams.
BE EXTREMELY CONCISE. Use quick-read bullets. Use this structure for each:
1. **[STREAM NAME]** (as a bold heading)
2. **The Match**: 1-2 sentence peak value proposition.
3. **Quick Path**: Bullets for (Duration, Entrance Exams, Key Colleges in TN).
4. **Future Role**: 3-4 career path keywords.
Keep it snappy and very easy to scan.`;

      const userMessage = `Here is my complete profile:\n\n${profileLines}\n\nPlease analyze this carefully and give me personalized recommendations.`;

      const payload = {
        system_prompt: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      };

      const apiBase = process.env.REACT_APP_API_URL || "";
      
      try {
        const res = await fetch(`${apiBase}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Connection failed");
        setMessages([{ role: 'ai', text: data.reply }]);
      } catch (err) {
        setMessages([{ role: 'ai', text: `⚠️ ${err.message}` }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    // Map internal {role, text} to Claude's {role, content}
    const apiMessages = newMessages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text
    }));

    const systemPrompt = mode === 'opportunities'
      ? "You are a personalized Department Career Counselor for Tamil Nadu students. You already provided initial recommendations. Now answer follow-up questions about departments, colleges in Tamil Nadu, salaries, and career paths. Keep answers concise and helpful."
      : "You are a personalized Stream Selection Advisor for Tamil Nadu students. You already provided recommendations. Now answer follow-on questions about streams, colleges, exams (JEE/NEET/CLAT), and career paths. Be specific to the student's profile.";

    const apiBase = process.env.REACT_APP_API_URL || "";

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_prompt: systemPrompt, messages: apiMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Service busy");
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: `❌ ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const modeConfig = {
    opportunities: { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', label: 'Department Finder', icon: <Zap size={22} /> },
    streams: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Stream Guide', icon: <Sparkles size={22} /> }
  };
  const cfg = modeConfig[mode];
  const progress = ((qIndex) / questions.length) * 100;

  return (
    <div className="counselor-page">
      {/* Left Panel — Navigation / Context */}
      <div className="cp-sidebar" style={{ '--mc': cfg.color, '--mb': cfg.bg }}>
        <button className="back-pill" onClick={onBack} style={{ marginBottom: 32 }}><ChevronLeft size={16} /> Back to Home</button>
        <div className="cp-mode-badge">
          <div className="cp-mode-icon">{cfg.icon}</div>
          <div>
            <div className="cp-mode-label">{cfg.label}</div>
            <div className="cp-mode-sub">AI Career Counselor</div>
          </div>
        </div>
        {/* Only show step tracker AFTER login */}
        {phase !== 'otp' && (
          <div className="cp-steps">
            {['Verify', ...questions.map((_, i) => `Q${i+1}`), 'Analysis'].map((s, i) => {
              const done = (phase === 'quiz' && i < qIndex + 1) || (phase === 'analyzing' || phase === 'chat');
              const active = (phase === 'quiz' && i === qIndex + 1);
              return (
                <div key={i} className={`cp-step ${done ? 'done' : ''} ${active ? 'active' : ''}`} style={{ '--c': cfg.color }}>
                  <div className="cp-step-dot">{done ? <CheckCircle2 size={14} /> : i + 1}</div>
                  <span>{s}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* During OTP phase — show a clean privacy note instead */}
        {phase === 'otp' && (
          <div className="cp-login-hint">
            <div className="cp-hint-icon" style={{ color: cfg.color }}>🔒</div>
            <p>Your number is only used to verify access. We don't store any personal data.</p>
          </div>
        )}

        <div className="cp-sidebar-footer">
          <div className="cp-ai-brand"><span className="ai-live-dot" style={{ background: cfg.color }} /> Claude 4.6 · Anthropic</div>
        </div>
      </div>

      {/* Right Panel — Main Content */}
      <div className="cp-main">
        <AnimatePresence mode="wait">

          {/* OTP Step */}
          {phase === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="cp-content-center">
              <div className="cp-otp-icon" style={{ background: cfg.bg, color: cfg.color }}><ShieldCheck size={36} /></div>
              <h1 className="cp-h1">Let's Find Your Perfect Path</h1>
              <p className="cp-p">We'll ask you 6 simple questions about your interests and personality. Our AI will then suggest the most suitable engineering departments or streams — personalized just for you.</p>
              <div className="cp-form">
                <div className="ai-form-field">
                  <label>MOBILE NUMBER</label>
                  <input type="tel" maxLength={10} placeholder="Enter your 10-digit number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
                </div>
                {phone.length === 10 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ai-form-field">
                    <label>OTP <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Demo: 1234)</span></label>
                    <input type="text" maxLength={4} placeholder="• • • •" autoFocus value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
                  </motion.div>
                )}
                <motion.button
                  className="cp-start-btn"
                  style={{ '--vc': cfg.color, opacity: otp === '1234' ? 1 : 0.4 }}
                  onClick={handleVerify}
                  disabled={otp !== '1234'}
                  whileHover={otp === '1234' ? { scale: 1.02 } : {}}
                  whileTap={otp === '1234' ? { scale: 0.98 } : {}}
                >
                  Start My AI Assessment →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Quiz Step */}
          {phase === 'quiz' && (
            <motion.div key={`q-${qIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="cp-content-quiz">
              <div className="cp-progress-bar">
                <div className="cp-progress-fill" style={{ width: `${progress}%`, background: cfg.color }} />
              </div>
              <div className="cp-q-meta">
                <span style={{ color: cfg.color, fontWeight: 800 }}>Question {qIndex + 1}</span>
                <span className="cp-q-total">of {questions.length}</span>
              </div>
              <h2 className="cp-q-text">{questions[qIndex].q}</h2>
              <p className="cp-q-hint">💡 {questions[qIndex].hint}</p>
              <div className="cp-options-grid">
                {questions[qIndex].options.map(opt => (
                  <motion.button
                    key={opt}
                    className="cp-option-btn"
                    style={{ '--c': cfg.color }}
                    onClick={() => handleAnswer(opt)}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="cp-opt-arrow">→</span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat / Results */}
          {(phase === 'chat' || phase === 'analyzing') && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cp-chat-wrap">
              {/* Chat Header */}
              <div className="cp-chat-top">
                <div className="cp-chat-top-left">
                  <div className="claude-badge">
                    <span className="claude-dot" />
                    <span>Claude AI</span>
                  </div>
                  <h2 className="cp-chat-title">Your Personalized Analysis</h2>
                </div>
                <div className="cp-profile-tags">
                  {Object.values(answers).map((v, i) => <span key={i} className="ai-recap-tag" style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>{v}</span>)}
                </div>
              </div>

              {/* Messages */}
              <div className="cp-messages" ref={chatRef}>
                {isTyping && messages.length === 0 && (
                  <div className="cp-analyzing-state">
                    <div className="claude-thinking">
                      <div className="claude-think-ring" style={{ borderTopColor: cfg.color }} />
                      <div className="claude-think-ring inner" style={{ borderTopColor: cfg.color, opacity: 0.4 }} />
                    </div>
                    <p className="cp-analyzing-text">Claude is analyzing your profile...</p>
                    <span className="cp-analyzing-sub">Generating personalized recommendations</span>
                  </div>
                )}
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`cp-msg-row ${m.role}`}
                  >
                    {m.role === 'ai' && (
                      <div className="cp-avatar claude-avatar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                        </svg>
                      </div>
                    )}
                    <div className={`cp-bubble ${m.role === 'ai' ? 'ai-bubble' : 'user-bubble'}`}
                      style={m.role === 'user' ? { background: `linear-gradient(135deg, ${cfg.color}, #8b5cf6)` } : {}}>
                      {m.role === 'ai' ? <ClaudeMessage text={m.text} color={cfg.color} /> : m.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && messages.length > 0 && (
                  <div className="cp-msg-row ai">
                    <div className="cp-avatar claude-avatar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                      </svg>
                    </div>
                    <div className="cp-bubble ai-bubble ai-typing-indicator"><span /><span /><span /></div>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="cp-input-bar">
                <div className="cp-input-wrap">
                  <input
                    placeholder="Ask Claude anything about your analysis..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                </div>
                <motion.button
                  className="cp-send-btn"
                  onClick={handleSend}
                  style={{ background: `linear-gradient(135deg, ${cfg.color}, #8b5cf6)` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isTyping}
                >
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── CLAUDE MESSAGE FORMATTER ─────────────────────────── */
const ClaudeMessage = ({ text, color }) => {
  if (!text) return null;

  // Parse the text into blocks
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bold heading like **Department Name** or ## Heading
    if (/^\*\*(.+)\*\*\s*$/.test(line) || /^#{1,3}\s+(.+)/.test(line)) {
      const content = line.replace(/^\*\*|\*\*$/g, '').replace(/^#{1,3}\s+/, '');
      blocks.push({ type: 'heading', content });
    }
    // Numbered list item
    else if (/^\d+\.\s+/.test(line)) {
      const content = line.replace(/^\d+\.\s+/, '');
      blocks.push({ type: 'numbered', content: renderInline(content) });
    }
    // Bullet
    else if (/^[-•*]\s+/.test(line)) {
      const content = line.replace(/^[-•*]\s+/, '');
      blocks.push({ type: 'bullet', content: renderInline(content) });
    }
    // Empty line
    else if (line.trim() === '') {
      blocks.push({ type: 'spacer' });
    }
    // Normal paragraph
    else {
      blocks.push({ type: 'para', content: renderInline(line) });
    }
    i++;
  }

  // Remove leading/trailing spacers
  while (blocks.length && blocks[0].type === 'spacer') blocks.shift();
  while (blocks.length && blocks[blocks.length - 1].type === 'spacer') blocks.pop();

  return (
    <div className="claude-msg-body">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <div key={idx} className="cm-heading" style={{ borderLeftColor: color }}>
              {block.content}
            </div>
          );
        }
        if (block.type === 'bullet') {
          return (
            <div key={idx} className="cm-bullet">
              <span className="cm-dot" style={{ background: color }} />
              <span dangerouslySetInnerHTML={{ __html: block.content }} />
            </div>
          );
        }
        if (block.type === 'numbered') {
          return (
            <div key={idx} className="cm-numbered">
              <span dangerouslySetInnerHTML={{ __html: block.content }} />
            </div>
          );
        }
        if (block.type === 'spacer') {
          return <div key={idx} className="cm-spacer" />;
        }
        return (
          <p key={idx} className="cm-para" dangerouslySetInnerHTML={{ __html: block.content }} />
        );
      })}
    </div>
  );
};

const DepartmentDetailsPage = ({ collegeCode, searchTerm, onSearchChange, onSelectCollege, onBack }) => {
  const college = useMemo(() => TNEA_DATA.find(c => String(c.code) === String(collegeCode)) || TNEA_DATA[0] || {}, [collegeCode]);
  const courses = useMemo(() => TNEA_COURSES_INFO[String(college.code)] || [], [college.code]);

  const normalizeDeg = (raw) => {
    const d = String(raw).trim().toUpperCase().replace(/[.\s]/g, '');
    if (d === 'BE') return 'B.E';
    if (d === 'BTECH') return 'B.Tech';
    if (d === 'ME') return 'M.E';
    if (d === 'MTECH') return 'M.Tech';
    return raw;
  };

  const branches = useMemo(() => {
    return courses.flatMap(cat => (cat.branches || []).map((branch, idx) => ({
      id: `${String(college.code)}-${idx}`,
      category: cat.cat || 'Engineering',
      degree: normalizeDeg(branch[0]),
      name: branch[1] || branch[0] || 'Unknown',
    })));
  }, [courses, college.code]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return branches;
    return branches.filter(branch =>
      branch.name.toLowerCase().includes(term) ||
      branch.degree.toLowerCase().includes(term) ||
      branch.category.toLowerCase().includes(term)
    );
  }, [branches, searchTerm]);

  const collegeOptions = useMemo(() => TNEA_DATA.filter(c => TNEA_COURSES_INFO[String(c.code)]), []);

  return (
    <div className="centered-view">
      <div className="dd-container">
        <button className="back-pill" onClick={onBack}><ChevronLeft size={16} /> Back</button>
        <div className="dd-header-full">
          <div className="dd-title-center">
            <span className="offered-by-pill">Anna University (TNEA)</span>
            <h1>Department Details</h1>
            <p>Browse branch offerings across Anna University campuses and affiliated colleges.</p>
          </div>
          <div className="dd-search-box">
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search branch, course or degree..."
            />
          </div>
        </div>

        <div className="dd-colleges-strip">
          <div className="cs-label">Select campus</div>
          <div className="cs-list">
            {collegeOptions.slice(0, 14).map(c => (
              <button
                key={c.code}
                className={`cs-item ${String(c.code) === String(college.code) ? 'active' : ''}`}
                onClick={() => onSelectCollege(c.code)}
                style={{ cursor: 'pointer' }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="dd-content">
          <div className="dd-college-info">
            <span className="dd-code-tag">Code {college.code}</span>
            <div className="dd-college-name">{college.name}</div>
            <div className="dd-college-loc"><MapPin size={14} /> {college.city || college.State || 'Tamil Nadu'}</div>
          </div>

          {filtered.length === 0 ? (
            <div className="dd-empty-state">
              <div className="dd-empty-icon">🔍</div>
              <h3>No matching branches found</h3>
              <p>Try a different search term or select another campus.</p>
            </div>
          ) : (
            <div className="dd-grid-container">
              {filtered.map(branch => (
                <div key={branch.id} className="dd-grid-card">
                  <div className="grid-br-deg">{branch.degree}</div>
                  <div className="grid-br-name">{branch.name}</div>
                  <div className="grid-card-footer">Category: {branch.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Render inline bold/italic
function renderInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

export default App;
