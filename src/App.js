import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronDown, ArrowRight,
  ChevronLeft, BookOpen, Stethoscope, Building2,
  Sparkles, Zap, Globe, Eye, GraduationCap, ShieldCheck, PieChart, Info, Mail, Phone, ExternalLink, User, Train, Bus,
  IndianRupee, X, MessageSquare, CheckCircle2, SlidersHorizontal, BarChart3
} from 'lucide-react';
import { TNEA_DATA, DEEMED_DATA, PRIVATE_DATA } from './data';
import TNEA_PDF_INFO from './tnea_pdf_data.json';
import TNEA_COURSES_INFO from './tnea_courses_data.json';
import TNEA_MATRIX_DATA from './branch_matrix_data.json';
import DEPT_ANALYSIS_DATA from './dept_analysis_data.json';
import COMPARISON_DATA from './comparison_data.json';
import StudentRegistration from './components/StudentRegistration';

/* ─────────── PRIORITY COLLEGES (pinned to top in all views) ─────────── */
const PRIORITY_COLLEGE_MATCHERS = [
  (n) => /CEG Campus/i.test(n),
  (n) => /MIT Campus/i.test(n),
  (n) => /PSG College of Technology/i.test(n),
  (n) => /Coimbatore Institute of Technology \(Autonomous\)/i.test(n),
  (n) => /Thiagarajar College of Engineering/i.test(n),
  (n) => /Sri Sivasubramaniya Nadar/i.test(n),
  (n) => /PSG Institute of Technology and Applied Research/i.test(n),
  (n) => /Government College of Technology/i.test(n),
  (n) => /Rajalakshmi Institute of Technology/i.test(n),
  (n) => /Sri Sai Ram Engineering/i.test(n),
  (n) => /Saveetha Engineering College/i.test(n),
  (n) => /^Jeppiaar Engineering College/i.test(n),
  (n) => /KCG college of Technology/i.test(n),
];

const priorityRank = (name) => {
  if (!name) return Infinity;
  for (let i = 0; i < PRIORITY_COLLEGE_MATCHERS.length; i++) {
    if (PRIORITY_COLLEGE_MATCHERS[i](name)) return i;
  }
  return Infinity;
};

/* ─────────────────── NAVBAR ─────────────────── */
const Navbar = ({ onHome, onRegistration }) => (
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
        <span className="nav-sep" />
        <button className="nav-cta nav-register" onClick={onRegistration}>Register</button>
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

/* ── Registration Modal (timed popup) ── */
const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode',
  'Kallakurichi','Kancheepuram','Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai',
  'Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet',
  'Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli',
  'Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram',
  'Virudhunagar'
];

const RegistrationModal = ({ isOpen, dismissable, onClose, onComplete }) => {
  const [mode, setMode] = useState('register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regNum, setRegNum] = useState('');
  const [district, setDistrict] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [showDistricts, setShowDistricts] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode('register'); setFirstName(''); setLastName(''); setRegNum('');
      setDistrict(''); setDistrictQuery(''); setShowDistricts(false);
      setPhone(''); setOtpSent(false); setOtp('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDistricts = TN_DISTRICTS.filter(d =>
    d.toLowerCase().includes(districtQuery.toLowerCase())
  );

  const canSendOtp = mode === 'login'
    ? phone.length === 10
    : firstName.trim() && regNum.trim() && district && phone.length === 10;

  const handleSendOtp = () => { if (canSendOtp) setOtpSent(true); };
  const handleVerify = () => { if (otp === '1234') onComplete(); };

  const inputStyle = {
    width:'100%', padding:'12px 14px', border:'1px solid #e2e8f0',
    borderRadius:10, fontSize:'0.9rem', background:'#f8fafc', outline:'none',
    boxSizing:'border-box'
  };
  const labelStyle = { display:'block', fontSize:'0.82rem', fontWeight:600, color:'#334155', marginBottom:6 };

  return (
    <div
      style={{
        position:'fixed', inset:0, background:'rgba(15,23,42,0.55)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:9999, padding:16,
      }}
      onClick={dismissable ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', maxWidth:440, background:'#fff', borderRadius:18,
          padding:'28px 26px', position:'relative', boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
          maxHeight:'92vh', overflowY:'auto'
        }}
      >
        {dismissable && (
          <button
            onClick={onClose}
            style={{
              position:'absolute', top:12, right:12, background:'transparent',
              border:'none', cursor:'pointer', color:'#64748b', padding:6
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        <div style={{ textAlign:'center', marginBottom:18 }}>
          <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a', letterSpacing:'0.02em' }}>
            GET YOUR <span style={{ color:'#10b981' }}>COLLEGE</span>
          </div>
          <div style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.2em', color:'#64748b', marginTop:4 }}>
            QUANTUM SHIFT TO YOUR CAREER
          </div>
        </div>

        <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#0f172a', marginBottom:16 }}>
          Let's get you started...
        </h2>

        <div style={{ display:'flex', background:'#f1f5f9', borderRadius:10, padding:4, marginBottom:18 }}>
          <button
            onClick={() => setMode('login')}
            style={{
              flex:1, padding:'10px', border:'none', borderRadius:8, cursor:'pointer',
              background: mode==='login' ? '#2563eb' : 'transparent',
              color: mode==='login' ? '#fff' : '#64748b', fontWeight:600, fontSize:'0.9rem',
              transition:'all 0.2s'
            }}
          >Login</button>
          <button
            onClick={() => setMode('register')}
            style={{
              flex:1, padding:'10px', border:'none', borderRadius:8, cursor:'pointer',
              background: mode==='register' ? '#2563eb' : 'transparent',
              color: mode==='register' ? '#fff' : '#64748b', fontWeight:600, fontSize:'0.9rem',
              transition:'all 0.2s'
            }}
          >Register</button>
        </div>

        {mode === 'register' && (
          <>
            <div style={{ marginBottom:12 }}>
              <label style={labelStyle}>First Name <span style={{ color:'#ef4444' }}>*</span></label>
              <input style={inputStyle} placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={labelStyle}>12th Register Number <span style={{ color:'#ef4444' }}>*</span></label>
              <input style={inputStyle} placeholder="XXXXXXXXX" value={regNum} onChange={e => setRegNum(e.target.value)} />
            </div>
            <div style={{ marginBottom:12, position:'relative' }}>
              <label style={labelStyle}>District <span style={{ color:'#ef4444' }}>*</span></label>
              <input
                style={inputStyle}
                placeholder="Search by district"
                value={district || districtQuery}
                onChange={e => { setDistrictQuery(e.target.value); setDistrict(''); setShowDistricts(true); }}
                onFocus={() => setShowDistricts(true)}
              />
              {showDistricts && !district && districtQuery && filteredDistricts.length > 0 && (
                <div style={{
                  position:'absolute', top:'100%', left:0, right:0, background:'#fff',
                  border:'1px solid #e2e8f0', borderRadius:10, marginTop:4, maxHeight:160,
                  overflowY:'auto', zIndex:10, boxShadow:'0 8px 20px rgba(0,0,0,0.08)'
                }}>
                  {filteredDistricts.map(d => (
                    <div key={d}
                      onClick={() => { setDistrict(d); setDistrictQuery(''); setShowDistricts(false); }}
                      style={{ padding:'10px 14px', cursor:'pointer', fontSize:'0.88rem', color:'#334155' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background='#fff'}
                    >{d}</div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ marginBottom:16 }}>
          <label style={labelStyle}>
            {mode === 'login' ? 'Mobile Number' : 'Provide your mobile number to send OTP'}
          </label>
          <input
            style={inputStyle}
            placeholder="+91"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
          />
        </div>

        {!otpSent && (
          <button
            disabled={!canSendOtp}
            onClick={handleSendOtp}
            style={{
              width:'100%', padding:'13px', border:'none', borderRadius:10,
              background: canSendOtp ? '#2563eb' : '#93c5fd',
              color:'#fff', fontWeight:700, fontSize:'0.95rem',
              cursor: canSendOtp ? 'pointer' : 'not-allowed', transition:'all 0.2s'
            }}
          >Get OTP</button>
        )}

        {otpSent && (
          <>
            <div style={{ marginBottom:12 }}>
              <label style={labelStyle}>OTP Sent (demo: 1234)</label>
              <input
                style={inputStyle}
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,4))}
              />
            </div>
            <button
              disabled={otp !== '1234'}
              onClick={handleVerify}
              style={{
                width:'100%', padding:'13px', border:'none', borderRadius:10,
                background: otp === '1234' ? '#10b981' : '#a7f3d0',
                color:'#fff', fontWeight:700, fontSize:'0.95rem',
                cursor: otp === '1234' ? 'pointer' : 'not-allowed', transition:'all 0.2s'
              }}
            >Verify & Continue</button>
          </>
        )}

        {!dismissable && (
          <div style={{ marginTop:14, fontSize:'0.75rem', color:'#94a3b8', textAlign:'center' }}>
            Please complete registration to continue using the site.
          </div>
        )}
      </motion.div>
    </div>
  );
};

const CollegeCard = ({ college, category, isExpanded, onToggle, onOpenQuery, serial }) => {
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

  const isSSN = /Sri Sivasubramaniya Nadar/i.test(college.name || '');

  return (
    <motion.div layout className={`college-card ${isExpanded ? 'cc-open' : ''}`} transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}>
      {isSSN && (
        <div className="ssn-notice">
          <span className="ssn-notice-icon">⚠️</span>
          <span className="ssn-notice-text">
            <strong>Note:</strong> From 2026, this college is considered a University and will not take part in TNEA 2026 counselling.
          </span>
        </div>
      )}
      <div className="cc-header" onClick={onToggle}>
        <div className="cc-rank">{isAnna ? <span className="rank-num">{serial}</span> : <Building2 size={20} />}</div>
        <div className="cc-meta">
          <h3 className="cc-name">{college.name}</h3>
          <div className="cc-loc"><MapPin size={12} /> {college.city || college.Address || college.State || 'Tamil Nadu'}</div>
        </div>
        <div className="cc-badges">
          {isAnna ? (
            <>
              {college.type && <span className={`badge ${({'university_dept':'badge-purple','government':'badge-blue','govt_aided':'badge-emerald','cecri_cipet':'badge-amber','constituent':'badge-cyan','autonomous':'badge-teal'})[college.type] || 'badge-gray'}`}>{({'university_dept':'University Dept','government':'Government','govt_aided':'Govt Aided','cecri_cipet':'CECRI/CIPET','constituent':'Constituent','autonomous':'Autonomous','non_autonomous':'Self-Finance'})[college.type] || college.type}</span>}
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
  const [sortBy, setSortBy] = useState('');
  const [reordering, setReordering] = useState(false);

  const handleSortChange = (next) => {
    setSortBy(prev => (prev === next ? '' : next));
    setReordering(true);
    setTimeout(() => setReordering(false), 550);
  };
  const [regModal, setRegModal] = useState({ open: false, dismissable: true });
  const [registered, setRegistered] = useState(false);

  // Registration popup timers — 60s closeable, then 15s mandatory
  useEffect(() => {
    if (registered) return;
    const firstTimer = setTimeout(() => {
      setRegModal({ open: true, dismissable: true });
    }, 60 * 1000);
    return () => clearTimeout(firstTimer);
  }, [registered]);

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

  const sortedColleges = useMemo(() => {
    const computePlacement = (c) => {
      if (c.placement) return c.placement;
      const cut = c.cutoff || 120;
      const fill = c.fillpct || 50;
      return Math.min(99, Math.max(45, Math.floor((cut / 200) * 60 + (fill / 100) * 40)));
    };

    const priority = [];
    const rest = [];
    filteredColleges.forEach(c => {
      if (priorityRank(c.name) !== Infinity) priority.push(c);
      else rest.push(c);
    });
    priority.sort((a, b) => priorityRank(a.name) - priorityRank(b.name));

    if (sortBy === 'demand') {
      const demandScore = (c) => (c.seats || 0) * (c.fillpct || 0) * (c.cutoff || 0);
      rest.sort((a, b) => demandScore(b) - demandScore(a));
    } else if (sortBy === 'placement') {
      rest.sort((a, b) => computePlacement(b) - computePlacement(a));
    } else if (sortBy === 'fast') {
      rest.sort((a, b) => ((b.r1 || 0) * (b.filled || 0)) - ((a.r1 || 0) * (a.filled || 0)));
    }

    return [...priority, ...rest];
  }, [filteredColleges, sortBy]);

  const goHome = () => { setView('home'); window.scrollTo(0, 0); };
  const openExplorer = (cat) => { setCategory(cat); setView('explorer'); window.scrollTo(0, 0); };
  const openAI = (mode) => { setAiMode(mode); setView('ai-counselor'); window.scrollTo(0,0); };
  const openDeptDetails = (code = TNEA_DATA[0]?.code) => { setView('dept-details'); window.scrollTo(0, 0); };
  const openRegistration = () => { setView('registration'); window.scrollTo(0, 0); };

  return (
    <div className="root">
      <div className="noise-overlay" />
      <Navbar onHome={goHome} onRegistration={openRegistration} />
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main key="home" className="home-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="hero">
              <div className="hero-eyebrow"><Sparkles size={14} /> Tamil Nadu Institution Explorer</div>
              <h1 className="hero-h1">Find Your <span className="h1-accent">Perfect College</span></h1>
              <p className="hero-p">Explore cutoff data, seats, and verified institution details for 2025.</p>
            </div>
            {/* Premium AI Guidance Bottom Bar */}
            <div className="home-bottom-actions">
              <div className="ba-group">
                <span className="ba-label">Mentora AI · Intelligent Guidance</span>
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
                      <span>EXPLORE DEPARTMENTS</span>
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
              {category === 'anna' && (
                <div className={`sort-bar ${reordering ? 'sort-bar-pulsing' : ''}`}>
                  <div className="sort-bar-head">
                    <span className="sort-bar-title">Sort results</span>
                    <AnimatePresence>
                      {reordering && (
                        <motion.span
                          className="sort-status"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="sort-spinner" /> Reordering…
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {sortBy && !reordering && <button className="sort-clear" onClick={() => handleSortChange(sortBy)}>Clear</button>}
                  </div>
                  <div className="sort-options">
                    <motion.button whileTap={{ scale: 0.96 }} className={`sort-opt ${sortBy === 'demand' ? 'sort-on' : ''}`} onClick={() => handleSortChange('demand')}>
                      <span className="sort-icon">🔥</span>
                      <div className="sort-text">
                        <span className="sort-title">Most In-Demand</span>
                        <span className="sort-desc">High total seats, fill % & min cutoff</span>
                      </div>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.96 }} className={`sort-opt ${sortBy === 'placement' ? 'sort-on' : ''}`} onClick={() => handleSortChange('placement')}>
                      <span className="sort-icon">💼</span>
                      <div className="sort-text">
                        <span className="sort-title">Top Placements</span>
                        <span className="sort-desc">Highest placement percentage</span>
                      </div>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.96 }} className={`sort-opt ${sortBy === 'fast' ? 'sort-on' : ''}`} onClick={() => handleSortChange('fast')}>
                      <span className="sort-icon">⚡</span>
                      <div className="sort-text">
                        <span className="sort-title">Fast Fillers</span>
                        <span className="sort-desc">High Round 1 & total filled</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              )}
              <div className="results-info">
                <span className="results-count">{filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''} found</span>
                {activeFilterCount > 0 && <span className="active-filter-pills">{subType && <span className="af-pill">{({'university_dept':'University Department','government':'Government Colleges','govt_aided':'Government Aided','cecri_cipet':'CECRI & CIPET','constituent':'Constituent Colleges','autonomous':'Autonomous Colleges','non_autonomous':'Non-Autonomous'})[subType]}<X size={12} onClick={()=>setSubType('')}/></span>}{cityFilter && <span className="af-pill">{cityFilter}<X size={12} onClick={()=>setCityFilter('')}/></span>}{fillFilter && <span className="af-pill">Fill Rate: {fillFilter}%<X size={12} onClick={()=>setFillFilter('')}/></span>}{cutoffFilter && <span className="af-pill">Min. Cutoff: {cutoffFilter}<X size={12} onClick={()=>setCutoffFilter('')}/></span>}</span>}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`list-${sortBy || 'default'}`}
                  className="card-list"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                >
                  {sortedColleges.map((c, idx) => {
                    const uid = c.code || c.name;
                    return (
                      <motion.div
                        key={uid}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx, 10) * 0.025, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CollegeCard
                          college={c}
                          category={category}
                          serial={idx + 1}
                          isExpanded={expandedCollege === uid}
                          onToggle={() => setExpandedCollege(expandedCollege === uid ? null : uid)}
                          onOpenQuery={(name) => setQueryModal({ open: true, college: name })}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.main>
        )}
        {view === 'dept-details' && (
          <motion.main key="dept-details" className="explorer-main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DepartmentDetailsPage onBack={() => setView('explorer')} onCompare={() => setView('comparison')} onOpenQuery={(name) => setQueryModal({ open: true, college: name })} />
          </motion.main>
        )}
        {view === 'comparison' && (
          <motion.main key="comparison" className="explorer-main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ComparisonPage onBack={() => setView('dept-details')} />
          </motion.main>
        )}
        {view === 'ai-counselor' && (
          <motion.main key="ai-counselor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <AICounselorPage mode={aiMode} onBack={goHome} />
          </motion.main>
        )}
        {view === 'registration' && (
          <motion.main key="registration" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <StudentRegistration onBack={goHome} />
          </motion.main>
        )}
      </AnimatePresence>
      <QueryModal isOpen={queryModal.open} onClose={()=>setQueryModal({open:false, college:''})} collegeName={queryModal.college} />
      <RegistrationModal
        isOpen={regModal.open}
        dismissable={regModal.dismissable}
        onClose={() => {
          setRegModal({ open: false, dismissable: true });
          if (!registered) {
            setTimeout(() => {
              setRegModal({ open: true, dismissable: false });
            }, 15 * 1000);
          }
        }}
        onComplete={() => {
          setRegistered(true);
          setRegModal({ open: false, dismissable: true });
        }}
      />
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
        if (!res.ok) {
          const text = await res.text();
          let errData = {};
          try { errData = JSON.parse(text); } catch(e) {}
          throw new Error(errData.error || (res.status === 504 ? "AI analysis is taking too long to respond. Please try again." : `Server Error (${res.status})`));
        }
        const data = await res.json();
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
      if (!res.ok) {
        const text = await res.text();
        let errData = {};
        try { errData = JSON.parse(text); } catch(e) {}
        throw new Error(errData.error || (res.status === 504 ? "AI analysis is taking too long to respond. Please try again." : `Server Error (${res.status})`));
      }
      const data = await res.json();
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
                    <span>Mentora AI</span>
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
                    placeholder="Ask Mentora AI anything about your analysis..."
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
    let line = lines[i];

    // Table parsing
    if (line.trim().startsWith('|')) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'table', content: tableRows });
      continue;
    }

    // Bold heading or # Heading (up to H6)
    if (/^\*\*(.+)\*\*\s*$/.test(line) || /^#{1,6}\s+(.+)/.test(line)) {
      const content = line.replace(/^\*\*|\*\*$/g, '').replace(/^#{1,6}\s+/, '');
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
    // Horizontal Rule
    else if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
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
              <span dangerouslySetInnerHTML={{ __html: renderInline(block.content) }} />
            </div>
          );
        }
        if (block.type === 'table') {
          return (
            <div key={idx} style={{ overflowX: 'auto', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <tbody>
                  {block.content.map((row, rIdx) => {
                    if (/^[\s|:-]+$/.test(row)) return null; 
                    let cells = row.split('|').map(c => c.trim());
                    if (cells.length > 0 && cells[0] === '') cells.shift();
                    if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
                    
                    return (
                      <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0', background: rIdx === 0 ? '#f8fafc' : 'white' }}>
                        {cells.map((cell, cIdx) => {
                          const Tag = rIdx === 0 ? 'th' : 'td';
                          return <Tag key={cIdx} style={{ padding: '12px 16px', fontWeight: rIdx === 0 ? 600 : 400, color: rIdx === 0 ? '#0f172a' : '#1e293b' }} dangerouslySetInnerHTML={{ __html: renderInline(cell) }} />
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
        if (block.type === 'hr') {
          return <hr key={idx} style={{ border: 'none', borderTop: '2px dashed #cbd5e1', margin: '20px 0' }} />;
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

const ComparisonPage = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonAnalyses, setComparisonAnalyses] = useState({});
  const [comparing, setComparing] = useState(false);

  const normalizeDeg = (raw) => {
    const d = String(raw).trim().toUpperCase().replace(/[.\s]/g, '');
    if (d === 'BE') return 'B.E';
    if (d === 'BTECH') return 'B.Tech';
    if (d === 'ME') return 'M.E';
    if (d === 'MTECH') return 'M.Tech';
    return raw;
  };

  const allUniqueDepartments = useMemo(() => {
    const map = {};
    Object.entries(TNEA_COURSES_INFO).forEach(([code, cats]) => {
      (cats || []).forEach(cat => {
        (cat.branches || []).forEach(b => {
          const deg = normalizeDeg(b[0]);
          const nameUpper = String(b[1]).trim().toUpperCase();
          const key = `${deg}___${nameUpper}`;
          if (!map[key]) {
            map[key] = { id: key, degree: deg, name: nameUpper };
          }
        });
      });
    });
    return Object.values(map).sort((a, b) => (a.degree + a.name).localeCompare(b.degree + b.name));
  }, []);

  const filteredDepts = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return allUniqueDepartments;
    return allUniqueDepartments.filter(d =>
      d.degree.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    );
  }, [searchTerm, allUniqueDepartments]);

  const toggleDept = (dept) => {
    const isSelected = selectedDepts.some(d => d.id === dept.id);
    if (isSelected) {
      setSelectedDepts(selectedDepts.filter(d => d.id !== dept.id));
    } else if (selectedDepts.length < 3) {
      setSelectedDepts([...selectedDepts, dept]);
      setSearchTerm(''); // Clear search after selection
    }
  };

  const generateComparisonAnalyses = async () => {
    setComparing(true);
    const analyses = {};
    
    for (const dept of selectedDepts) {
      const key = `${dept.degree}___${dept.name}`;
      const comparisonKey = key;
      
      // Load pre-generated comparison analysis
      const preGeneratedAnalysis = COMPARISON_DATA[comparisonKey];
      
      if (preGeneratedAnalysis && preGeneratedAnalysis.analysis) {
        analyses[key] = preGeneratedAnalysis.analysis;
      } else {
        // Fallback to department analysis if comparison data not available
        const deptAnalysis = DEPT_ANALYSIS_DATA[key];
        analyses[key] = deptAnalysis?.analysis || '';
      }
    }
    
    setComparisonAnalyses(analyses);
    setShowComparison(true);
    setComparing(false);
  };

  return (
    <div className="root" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <button className="back-pill" onClick={onBack} style={{ marginBottom: 24 }}><ChevronLeft size={16} /> Back</button>
      
      {!showComparison ? (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>Compare Departments</h1>
            <p style={{ color: '#64748b' }}>Select up to 3 departments and compare their characteristics, career paths, and opportunities.</p>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
              padding: '2px',
              boxShadow: searchTerm ? '0 0 0 3px rgba(99,102,241,0.15), 0 8px 32px rgba(99,102,241,0.12)' : '0 4px 20px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.3s ease',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.96)',
                borderRadius: '14px',
                backdropFilter: 'blur(12px)',
                padding: '12px 20px',
                gap: '12px',
                border: '1px solid rgba(99,102,241,0.15)',
              }}>
                <Search size={18} color="#6366f1" />
                <input
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#1e293b',
                    padding: '8px 0',
                    letterSpacing: '0.01em',
                  }}
                  placeholder="Search departments (Computer Science, AI, Mechanical...)..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setSearchTerm('')}
                    style={{
                      width: 28, height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(100,116,139,0.12)',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    whileHover={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchTerm && filteredDepts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 10,
                  }}
                >
                  {filteredDepts.slice(0, 20).map((dept, idx) => {
                    const isSelected = selectedDepts.some(d => d.id === dept.id);
                    return (
                      <motion.button
                        key={dept.id}
                        onClick={() => toggleDept(dept)}
                        whileHover={{ background: 'rgba(99,102,241,0.08)' }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: 'none',
                          background: isSelected ? 'rgba(99,102,241,0.1)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: idx < Math.min(20, filteredDepts.length) - 1 ? '1px solid #f1f5f9' : 'none',
                          transition: 'background 0.2s',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1' }}>{dept.degree}</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{dept.name}</div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 'bold',
                              flexShrink: 0,
                            }}
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                  {filteredDepts.length > 20 && (
                    <div style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      background: '#f8fafc',
                    }}>
                      Showing 20 of {filteredDepts.length} results
                    </div>
                  )}
                </motion.div>
              )}

              {/* No results */}
              {searchTerm && filteredDepts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    textAlign: 'center',
                    zIndex: 10,
                  }}
                >
                  <Search size={24} color="#94a3b8" style={{ marginBottom: 12, marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
                  <p style={{ color: '#94a3b8', margin: 0 }}>No departments found</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Selected Departments Pills & Compare Button */}
          {selectedDepts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: 24,
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.08))',
                borderRadius: '12px',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <div style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6366f1', width: '100%' }}>📌 Selected ({selectedDepts.length}/3):</span>
                {selectedDepts.map((dept, idx) => (
                  <motion.div
                    key={dept.id}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 10 }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '10px 14px',
                      background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#ec4899'][idx % 3]}, ${['#8b5cf6', '#ec4899', '#f59e0b'][idx % 3]})`,
                      color: '#fff',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {dept.degree} - {dept.name.substring(0, 20)}
                    <motion.button
                      onClick={() => toggleDept(dept)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        padding: 0,
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Compare Button at Top */}
              <motion.button
                onClick={generateComparisonAnalyses}
                disabled={comparing}
                whileHover={{ scale: comparing ? 1 : 1.02 }}
                whileTap={{ scale: comparing ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: comparing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: comparing ? 0.7 : 1,
                  boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                  transition: 'all 0.3s',
                }}
              >
                {comparing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      style={{ display: 'flex' }}
                    >
                      <Zap size={16} />
                    </motion.div>
                    Generating Analyses...
                  </>
                ) : (
                  <>
                    <BarChart3 size={16} />
                    Compare {selectedDepts.length} Department{selectedDepts.length !== 1 ? 's' : ''} →
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Empty State */}
          {selectedDepts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: 48,
                padding: '60px 32px',
                textAlign: 'center',
                background: 'rgba(99,102,241,0.08)',
                borderRadius: '20px',
                border: '2px dashed rgba(99,102,241,0.3)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Search for Departments</h3>
              <p style={{ color: '#64748b' }}>Type a department name above to search. Select up to 3 departments, then click Compare to see detailed analysis.</p>
            </motion.div>
          )}

        </>
      ) : (
        // Comparison Results View
        <>
          <motion.button
            onClick={() => { setShowComparison(false); setComparisonAnalyses({}); }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              marginBottom: 24,
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              color: '#6366f1',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: 'fit-content',
            }}
            whileHover={{ background: 'rgba(99,102,241,0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={16} />
            Edit Selection
          </motion.button>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Comparison Results</h2>
          <p style={{ color: '#64748b', marginBottom: 32 }}>Detailed analysis highlighting the unique characteristics and opportunities of each department.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${selectedDepts.length}, 1fr)`,
            gap: 24,
            flex: 1,
          }}>
            {selectedDepts.map((dept, idx) => {
              const analysisKey = `${dept.degree}___${dept.name}`;
              const analysis = comparisonAnalyses[analysisKey] || DEPT_ANALYSIS_DATA[analysisKey]?.analysis;
              
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    padding: '24px',
                    background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#ec4899'][idx % 3]}, ${['#8b5cf6', '#ec4899', '#f59e0b'][idx % 3]})`,
                    color: '#fff',
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.9, marginBottom: 8 }}>{dept.degree}</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{dept.name}</h3>
                  </div>

                  <div style={{ padding: '24px', flex: 1, overflowY: 'auto', maxHeight: '600px' }}>
                    {analysis ? (
                      <ClaudeMessage text={analysis} color={['#8b5cf6', '#ec4899', '#f59e0b'][idx % 3]} />
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                        <p>Analysis not available for this department.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const DepartmentDetailsPage = ({ onBack, onCompare, onOpenQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [expandedCollegeCode, setExpandedCollegeCode] = useState(null);

  const [aiProgress, setAiProgress] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [showAllColleges, setShowAllColleges] = useState(false);

  const normalizeDeg = (raw) => {
    const d = String(raw).trim().toUpperCase().replace(/[.\s]/g, '');
    if (d === 'BE') return 'B.E';
    if (d === 'BTECH') return 'B.Tech';
    if (d === 'ME') return 'M.E';
    if (d === 'MTECH') return 'M.Tech';
    return raw;
  };

  const allUniqueDepartments = useMemo(() => {
    const map = {};
    Object.entries(TNEA_COURSES_INFO).forEach(([code, cats]) => {
      (cats || []).forEach(cat => {
        (cat.branches || []).forEach(b => {
          const deg = normalizeDeg(b[0]);
          // Normalise name to UPPER CASE so case-variants merge into one entry
          const nameUpper = String(b[1]).trim().toUpperCase();
          const key = `${deg} - ${nameUpper}`;
          if (!map[key]) {
            map[key] = { id: key, degree: deg, name: nameUpper, colleges: new Set() };
          }
          map[key].colleges.add(String(code));
        });
      });
    });
    return Object.values(map).map(d => ({ ...d, colleges: Array.from(d.colleges) })).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredDepts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allUniqueDepartments;
    return allUniqueDepartments.filter(d => d.name.toLowerCase().includes(term) || d.degree.toLowerCase().includes(term));
  }, [allUniqueDepartments, searchTerm]);

  useEffect(() => {
    if (!selectedDept) return;
    setAiProgress(0);
    setAiAnalysis(null);
    setAiError(null);
    setShowAllColleges(false);
    setExpandedCollegeCode(null);

    const key = `${selectedDept.degree}___${selectedDept.name}`;
    const deptData = DEPT_ANALYSIS_DATA[key];

    // Smooth 0 → 100 counter so every integer is visible.
    // Step ~80ms × 100 steps ≈ 8s total.
    const STEP_MS = 80;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setAiProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (deptData && deptData.analysis) {
            setAiAnalysis(deptData.analysis);
          } else {
            setAiError(`📊 Department analysis for "${selectedDept.degree} ${selectedDept.name}" is not yet generated. Please run: \n\n\`node generate_dept_analysis.js\`\n\nThis will pre-generate all department analyses at once.`);
          }
        }, 400);
      }
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [selectedDept]);

  const sortedColleges = useMemo(() => {
    if (!selectedDept) return [];
    const cObjects = selectedDept.colleges.map(c => TNEA_DATA.find(t => String(t.code) === c)).filter(Boolean);
    return cObjects.sort((a, b) => {
      const r1a = ['university_dept', 'government', 'govt_aided'].includes(a.type) ? 1 : 0;
      const r1b = ['university_dept', 'government', 'govt_aided'].includes(b.type) ? 1 : 0;
      if (r1a !== r1b) return r1b - r1a;
      
      const isSpecial = (name) => {
        const n = String(name).split(',')[0].toLowerCase().replace(/\s+/g, '');
        return n.includes('saveetha') || n.includes('sairam') || n.includes('rajalashkmi') || n.includes('rajalakshmi') || n.includes('jeppiar') || n.includes('jeppiaar');
      };
      const r2a = isSpecial(a.name) ? 1 : 0;
      const r2b = isSpecial(b.name) ? 1 : 0;
      if (r2a !== r2b) return r2b - r2a;
      
      const cfa = a.cutoff && a.cutoff >= 170 ? 1 : 0;
      const cfb = b.cutoff && b.cutoff >= 170 ? 1 : 0;
      if (cfa !== cfb) return cfb - cfa;
      
      return (b.cutoff || 0) - (a.cutoff || 0);
    });
  }, [selectedDept]);

  if (selectedDept) {
    // ── College tier helpers ───────────────────────────
    // Ordered specials — keywords must not overlap with each other.
    const SPECIAL_ORDER = [
      ['kcg'],
      ['sairam'],
      ['saveetha'],
      ['rajalakshmi', 'rajalashkmi'],
      ['jeppiar', 'jeppiaar'],
    ];
    const specialRank = (name) => {
      const n = String(name).toLowerCase().replace(/\s+/g, '');
      for (let i = 0; i < SPECIAL_ORDER.length; i++) {
        if (SPECIAL_ORDER[i].some(k => n.includes(k))) return i;
      }
      return -1;
    };
    const TIER1_TYPES = ['university_dept', 'govt_aided', 'government'];
    const tier1TypeRank = (t) => {
      const i = TIER1_TYPES.indexOf(t);
      return i === -1 ? 99 : i;
    };

    const tier1 = sortedColleges
      .filter(c => TIER1_TYPES.includes(c.type))
      .sort((a, b) => tier1TypeRank(a.type) - tier1TypeRank(b.type));
    const tier2 = sortedColleges
      .filter(c => !TIER1_TYPES.includes(c.type) && specialRank(c.name) !== -1)
      .sort((a, b) => specialRank(a.name) - specialRank(b.name));
    const tier3_high = sortedColleges.filter(c => !TIER1_TYPES.includes(c.type) && specialRank(c.name) === -1 && c.cutoff >= 170);
    const tier3_low = sortedColleges.filter(c => !TIER1_TYPES.includes(c.type) && specialRank(c.name) === -1 && !(c.cutoff >= 170));
    const tier3_preview = tier3_high.slice(0, 2);
    const tier3_all = [...tier3_high, ...tier3_low];
    const remaining = tier3_all.slice(tier3_preview.length);
    const initialColleges = [...tier1, ...tier2, ...tier3_preview];
    const displayedColleges = showAllColleges ? [...tier1, ...tier2, ...tier3_all] : initialColleges;

    // ── Type badge config ──────────────────────────────
    // ── College type breakdown ───────────────────────────
    const collegesByType = {
      university_dept: sortedColleges.filter(c => c.type === 'university_dept').length,
      government: sortedColleges.filter(c => c.type === 'government').length,
      govt_aided: sortedColleges.filter(c => c.type === 'govt_aided').length,
      autonomous: sortedColleges.filter(c => c.type === 'autonomous').length,
      constituent: sortedColleges.filter(c => c.type === 'constituent').length,
      non_autonomous: sortedColleges.filter(c => c.type === 'non_autonomous').length,
    };

    // ── Type badge config ──────────────────────────────
    const TYPE_CFG = {
      university_dept: { label: 'UNIVERSITY DEPT', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
      government:      { label: 'GOVERNMENT',      color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
      govt_aided:      { label: 'GOVT AIDED',       color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
      autonomous:      { label: 'AUTONOMOUS',       color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.25)' },
      constituent:     { label: 'CONSTITUENT',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
      non_autonomous:  { label: 'SELF-FINANCE',     color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
    };
    const getCfg = (type) => TYPE_CFG[type] || { label: (type||'').replace('_',' ').toUpperCase(), color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)' };

    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc' }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
          padding: '48px 32px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position:'absolute', top:-60, right:-60, width:260, height:260, borderRadius:'50%', background:'rgba(139,92,246,0.15)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-40, left:'30%', width:180, height:180, borderRadius:'50%', background:'rgba(99,102,241,0.12)', pointerEvents:'none' }} />
          
          <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
            <button className="back-pill" onClick={() => { setSelectedDept(null); setShowAllColleges(false); }} style={{ marginBottom:24, background:'rgba(255,255,255,0.12)', color:'#e0e7ff', border:'1px solid rgba(255,255,255,0.2)' }}>
              <ChevronLeft size={16} /> Back to Departments
            </button>

            {/* Degree badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:30, padding:'6px 16px', marginBottom:16 }}>
              <GraduationCap size={15} color="#c4b5fd" />
              <span style={{ color:'#c4b5fd', fontWeight:700, fontSize:'0.85rem', letterSpacing:'0.08em' }}>{selectedDept.degree}</span>
            </div>

            <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#fff', margin:'0 0 20px', letterSpacing:'0.02em', lineHeight:1.1 }}>
              {selectedDept.name}
            </h1>

            {/* Stat chips */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <div style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
                <span style={{ fontSize:'1.5rem', fontWeight:800, color:'#fff' }}>{sortedColleges.length}</span>
                <span style={{ fontSize:'0.72rem', color:'#c4b5fd', fontWeight:600, letterSpacing:'0.06em' }}>TOTAL COLLEGES</span>
              </div>
            </div>

            {/* College Type Breakdown */}
            <div style={{ marginTop:32, padding:'20px', background:'rgba(255,255,255,0.08)', borderRadius:16, border:'1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize:'0.85rem', color:'#c4b5fd', fontWeight:600, letterSpacing:'0.06em', marginBottom:12 }}>COLLEGES BY TYPE</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, max-content))', gap:12, justifyContent:'start' }}>
                {collegesByType.university_dept > 0 && (
                  <div style={{ padding:'10px 14px', background:'rgba(245,158,11,0.15)', borderRadius:8, border:'1px solid rgba(245,158,11,0.3)' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#fbbf24' }}>{collegesByType.university_dept}</div>
                    <div style={{ fontSize:'0.7rem', color:'#fcd34d', fontWeight:600 }}>University Dept</div>
                  </div>
                )}
                {collegesByType.government > 0 && (
                  <div style={{ padding:'10px 14px', background:'rgba(59,130,246,0.15)', borderRadius:8, border:'1px solid rgba(59,130,246,0.3)' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#60a5fa' }}>{collegesByType.government}</div>
                    <div style={{ fontSize:'0.7rem', color:'#93c5fd', fontWeight:600 }}>Government</div>
                  </div>
                )}
                {collegesByType.govt_aided > 0 && (
                  <div style={{ padding:'10px 14px', background:'rgba(16,185,129,0.15)', borderRadius:8, border:'1px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#4ade80' }}>{collegesByType.govt_aided}</div>
                    <div style={{ fontSize:'0.7rem', color:'#86efac', fontWeight:600 }}>Govt Aided</div>
                  </div>
                )}
                {collegesByType.autonomous > 0 && (
                  <div style={{ padding:'10px 14px', background:'rgba(20,184,166,0.15)', borderRadius:8, border:'1px solid rgba(20,184,166,0.3)' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#2dd4bf' }}>{collegesByType.autonomous}</div>
                    <div style={{ fontSize:'0.7rem', color:'#67e8f9', fontWeight:600 }}>Autonomous</div>
                  </div>
                )}
                {collegesByType.constituent > 0 && (
                  <div style={{ padding:'10px 14px', background:'rgba(139,92,246,0.15)', borderRadius:8, border:'1px solid rgba(139,92,246,0.3)' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#a78bfa' }}>{collegesByType.constituent}</div>
                    <div style={{ fontSize:'0.7rem', color:'#c4b5fd', fontWeight:600 }}>Constituent</div>
                  </div>
                )}
                {collegesByType.non_autonomous > 0 && (
                  <div style={{ padding:'10px 14px', background:'rgba(100,116,139,0.15)', borderRadius:8, border:'1px solid rgba(100,116,139,0.3)' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#cbd5e1' }}>{collegesByType.non_autonomous}</div>
                    <div style={{ fontSize:'0.7rem', color:'#e2e8f0', fontWeight:600 }}>Non-Autonomous</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px', display:'flex', flexDirection:'column-reverse', gap:28 }}>

          {/* ── MENTORA AI ANALYSIS (first) ── */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#0f172a', display:'flex', alignItems:'center', gap:8, margin:0 }}>
                <Building2 size={18} color="#6366f1" /> Colleges Offering This Department
              </h2>
              <span style={{ fontSize:'0.8rem', color:'#94a3b8', fontWeight:500 }}>showing {displayedColleges.length} of {sortedColleges.length}</span>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {displayedColleges.map((c, idx) => {
                const cfg = getCfg(c.type);
                return (
                  <div key={c.code || idx} style={{ marginBottom: 8 }}>
                    <motion.div
                      initial={{ opacity:0, y:10 }}
                      animate={{ opacity:1, y:0 }}
                      transition={{ delay: idx < 10 ? idx * 0.04 : 0 }}
                      onClick={() => setExpandedCollegeCode(expandedCollegeCode === c.code ? null : c.code)}
                      whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
                      style={{
                        background:'#fff',
                        border:'1px solid #e2e8f0',
                        borderLeft: `4px solid ${cfg.color}`,
                        borderRadius:'12px',
                        padding:'14px 18px',
                        display:'flex',
                        alignItems:'center',
                        gap:12,
                        boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
                        overflow:'hidden',
                        cursor:'pointer',
                        transition:'all 0.2s ease'
                      }}
                    >
                      <div style={{ width:30, height:30, borderRadius:8, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:700, fontSize:'0.78rem', color:'#64748b' }}>
                        {idx+1}
                      </div>
                      <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
                        <div style={{ fontWeight:600, color:'#1e293b', fontSize:'0.92rem', lineHeight:1.3 }}>{c.name}</div>
                        <div style={{ fontSize:'0.76rem', color:'#94a3b8', marginTop:2 }}>Code {c.code} · {c.city || 'Tamil Nadu'}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                        <span style={{ fontSize:'0.68rem', fontWeight:700, color: cfg.color, background: cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:20, padding:'3px 10px', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>
                          {cfg.label}
                        </span>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {expandedCollegeCode === c.code && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <CollegeCard
                            college={{ ...c, rank: idx + 1 }}
                            category="anna"
                            isExpanded={true}
                            onToggle={() => setExpandedCollegeCode(null)}
                            onOpenQuery={onOpenQuery}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {/* Load More */}
            {!showAllColleges && remaining.length > 0 && (
              <motion.button
                onClick={() => setShowAllColleges(true)}
                whileHover={{ scale:1.02, boxShadow:'0 8px 28px rgba(99,102,241,0.25)' }}
                whileTap={{ scale:0.97 }}
                style={{
                  width:'100%', marginTop:16,
                  background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color:'#fff', border:'none', borderRadius:12,
                  padding:'14px', fontWeight:700, fontSize:'0.95rem',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                }}
              >
                <ChevronDown size={18} /> Load {remaining.length} More Colleges
              </motion.button>
            )}
            {showAllColleges && (
              <motion.button
                onClick={() => setShowAllColleges(false)}
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.97 }}
                style={{
                  width:'100%', marginTop:16,
                  background:'#f1f5f9', color:'#475569',
                  border:'1px solid #e2e8f0', borderRadius:12,
                  padding:'12px', fontWeight:600, fontSize:'0.9rem',
                  cursor:'pointer',
                }}
              >
                Show Less
              </motion.button>
            )}
          </div>

          {/* ── COLLEGE LIST (below AI) ── */}
          <div style={{
            background:'#fff', borderRadius:20,
            boxShadow:'0 4px 24px rgba(0,0,0,0.07)',
            border:'1px solid #e2e8f0', overflow:'hidden',
          }}>
            <div style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', padding:'18px 24px', display:'flex', alignItems:'center', gap:10 }}>
              <Sparkles size={20} color="#fff" />
              <div style={{ flex:1 }}>
                <div style={{ color:'#fff', fontWeight:700, fontSize:'1rem' }}>Mentora AI Analysis</div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.75rem' }}>Intelligent AI Guidance</div>
              </div>
            </div>
            <div style={{ padding:'24px' }}>
              {aiProgress < 100 && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:'32px 0' }}>
                  <div className="claude-thinking">
                    <div className="claude-think-ring" style={{ borderTopColor:'#8b5cf6' }} />
                    <div className="claude-think-ring inner" style={{ borderTopColor:'#8b5cf6', opacity:0.4 }} />
                  </div>
                  <div style={{ fontWeight:600, color:'#475569', fontSize:'0.9rem' }}>LOADING DEPARTMENT ANALYSIS...</div>
                  <div style={{ width:'100%', maxWidth:360, height:'8px', background:'#e2e8f0', borderRadius:'4px', overflow:'hidden' }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${aiProgress}%` }} style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:'4px' }} transition={{ ease:'easeOut', duration:1.5 }} />
                  </div>
                  <div style={{ fontSize:'0.85rem', fontWeight:600, color:'#6366f1' }}>{Math.round(aiProgress)}%</div>
                </div>
              )}
              {aiProgress === 100 && aiError && (
                <div style={{ color:'#dc2626', padding:'20px', background:'#fef2f2', borderRadius:'10px', fontSize:'0.9rem', border:'1px solid #fecaca', whiteSpace:'pre-wrap', fontFamily:'monospace' }}>
                  <div style={{fontWeight:600, marginBottom:8}}>⚠️ Data Not Generated</div>
                  {aiError}
                </div>
              )}
              {aiProgress === 100 && aiAnalysis && (
                <div className="ai-insight-content">
                  <ClaudeMessage text={aiAnalysis} color="#8b5cf6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="root" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <button className="back-pill" onClick={onBack} style={{ marginBottom: 24 }}><ChevronLeft size={16} /> Back</button>
      
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>Explore Departments</h1>
          <p style={{ color: '#64748b' }}>Search globally across all Anna University affiliated campuses to find your desired stream.</p>
        </div>
        <motion.button
          onClick={onCompare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          ⚖️ Compare Departments
        </motion.button>
      </div>

      <div style={{ marginBottom: 32, position: 'relative' }}>
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          padding: '2px',
          boxShadow: searchTerm ? '0 0 0 3px rgba(99,102,241,0.15), 0 8px 32px rgba(99,102,241,0.12)' : '0 4px 20px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.3s ease',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.96)',
            borderRadius: '18px',
            backdropFilter: 'blur(12px)',
            padding: '6px 16px 6px 20px',
            gap: '14px',
            border: '1px solid rgba(99,102,241,0.15)',
          }}>
            {/* Animated icon */}
            <div style={{
              width: 40, height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            }}>
              <Search size={18} color="#fff" />
            </div>

            <input
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '1.05rem',
                fontWeight: 500,
                color: '#1e293b',
                padding: '10px 0',
                letterSpacing: '0.01em',
              }}
              placeholder="Search degree (e.g. B.Tech) or branch (e.g. Artificial Intelligence)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {/* Clear button */}
            {searchTerm && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setSearchTerm('')}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(100,116,139,0.12)',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                whileHover={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            )}

            {/* Results pill */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                }}
              >
                {filteredDepts.length} results
              </motion.div>
            )}
          </div>
        </div>

        {/* Hint text */}
        {!searchTerm && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 10, paddingLeft: 4, display: 'flex', gap: 16 }}>
            <span>🎓 B.Tech · B.E · M.Tech · M.E</span>
            <span>🔬 AI · Robotics · Civil · Biotech…</span>
          </div>
        )}
      </div>

      {filteredDepts.length === 0 ? (
        <div className="dd-empty-state" style={{ background: '#fff', borderRadius: '16px' }}>
          <div className="dd-empty-icon">🔍</div>
          <h3>No matching branches found</h3>
          <p>Try refining your search term.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredDepts.map(branch => (
            <motion.button
              key={branch.id}
              onClick={() => { setSelectedDept(branch); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'left',
                display: 'flex',
                cursor: 'pointer',
                flexDirection: 'column',
                gap: 8,
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                {branch.degree}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                {branch.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 8 }}>
                <Building2 size={14} /> Available in {branch.colleges.length} colleges
              </div>
            </motion.button>
          ))}
        </div>
      )}
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
