import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Bell, ChevronLeft, ChevronRight, Newspaper, Briefcase, FileText,
  ArrowRight, GraduationCap, Users, Building2, Award, ShieldCheck,
  Sparkles, Quote, MapPin, Phone, Mail, Clock, Star, Facebook,
  Instagram, Twitter, Linkedin, Youtube, Send
} from 'lucide-react';
import gycLogoPng from '../getyourcollege-logo.png';

/* ─────────── COMPANY LOGO (PNG from src) ─────────── */
export const BrandLogo = ({ size = 36 }) => (
  <img
    src={gycLogoPng}
    alt="GetYourCollege"
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
  />
);

/* ─────────── DIGITAL NOTICE BOARD (vertical marquee, pause on hover) ─────────── */
const NOTICES = [
  { date: 'MAY 20', tag: 'ADMISSION', title: 'TNEA 2025 Counselling Round 3 — seat allotment results published', color: '#1a73e8' },
  { date: 'MAY 18', tag: 'DEADLINE', title: 'Last date to confirm Round 2 seats: 22 May 2025, 5:00 PM', color: '#dc2626' },
  { date: 'MAY 15', tag: 'EVENT', title: 'Free Webinar: How to build a smart choice list — Sat 7 PM', color: '#f97316' },
  { date: 'MAY 12', tag: 'UPDATE', title: 'NEET UG 2025 exam postponed — revised dates to be announced', color: '#7c3aed' },
  { date: 'MAY 10', tag: 'SCHOLARSHIP', title: 'Merit scholarships open for 190+ cutoff students — apply now', color: '#059669' },
  { date: 'MAY 08', tag: 'ADMISSION', title: 'Department Explorer launched — compare 150+ branches by placement', color: '#1a73e8' },
  { date: 'MAY 05', tag: 'NEWS', title: 'Anna University releases official 2024 placement data for all affiliated colleges', color: '#0891b2' },
  { date: 'MAY 02', tag: 'GUIDANCE', title: 'One-on-one counselling slots open — book your 30-minute session', color: '#f97316' },
];

export const DigitalNoticeBoard = () => {
  const [paused, setPaused] = useState(false);
  const doubled = [...NOTICES, ...NOTICES];

  return (
    <div className="gyc-notice-board">
      <div className="gyc-nb-head">
        <div className="gyc-nb-title">
          <span className="gyc-nb-icon"><Bell size={18} /></span>
          <div>
            <h3>Digital Notice Board</h3>
            <p>Latest announcements & updates</p>
          </div>
        </div>
        <span className="gyc-nb-live">
          <span className="gyc-nb-dot" /> LIVE
        </span>
      </div>
      <div
        className="gyc-nb-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`gyc-nb-track ${paused ? 'gyc-nb-paused' : ''}`}>
          {doubled.map((n, i) => (
            <div key={i} className="gyc-nb-row">
              <div className="gyc-nb-date" style={{ background: n.color }}>
                <span className="gyc-nb-d-day">{n.date.split(' ')[1]}</span>
                <span className="gyc-nb-d-mon">{n.date.split(' ')[0]}</span>
              </div>
              <div className="gyc-nb-body">
                <span className="gyc-nb-tag" style={{ color: n.color, background: `${n.color}12` }}>{n.tag}</span>
                <p className="gyc-nb-text">{n.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="gyc-nb-fade gyc-nb-fade-top" />
        <div className="gyc-nb-fade gyc-nb-fade-bot" />
      </div>
    </div>
  );
};

/* ─────────── PHOTO SLIDESHOW ─────────── */
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
    title: 'Anna University Convocation 2025',
    sub: 'Celebrating 5000+ graduates across 80 affiliated colleges',
  },
  {
    img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    title: 'Campus Tour — CEG Guindy',
    sub: 'Exclusive virtual walkthrough of top Tamil Nadu campuses',
  },
  {
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    title: 'Mentora AI Launch Event',
    sub: 'AI-powered career guidance now available to every student',
  },
  {
    img: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&q=80',
    title: 'Counselling Workshop — Chennai',
    sub: 'Over 800 students joined our in-person choice filling session',
  },
];

export const PhotoSlideshow = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % total), 4200);
    return () => clearInterval(t);
  }, [paused, total]);

  const go = (delta) => setIdx(i => (i + delta + total) % total);

  return (
    <div
      className="gyc-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="gyc-slide"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundImage: `url(${SLIDES[idx].img})` }}
        >
          <div className="gyc-slide-shade" />
          <motion.div
            className="gyc-slide-caption"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="gyc-slide-tag">FEATURED</span>
            <h3>{SLIDES[idx].title}</h3>
            <p>{SLIDES[idx].sub}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <button className="gyc-slide-nav gyc-sn-prev" onClick={() => go(-1)} aria-label="Previous slide">
        <ChevronLeft size={22} />
      </button>
      <button className="gyc-slide-nav gyc-sn-next" onClick={() => go(1)} aria-label="Next slide">
        <ChevronRight size={22} />
      </button>
      <div className="gyc-slide-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`gyc-sd ${i === idx ? 'gyc-sd-on' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ─────────── ANIMATED COUNTER ─────────── */
const Counter = ({ to, suffix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.floor(v).toLocaleString());
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on('change', v => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, to, duration, mv, rounded]);

  return <span ref={ref}>{display}{suffix}</span>;
};

/* ─────────── STATS STRIP ─────────── */
export const StatsStrip = () => {
  const items = [
    { icon: <Building2 size={22} />, to: 550, suffix: '+', label: 'Colleges Covered', color: '#1a73e8' },
    { icon: <Users size={22} />, to: 12500, suffix: '+', label: 'Students Guided', color: '#f97316' },
    { icon: <GraduationCap size={22} />, to: 150, suffix: '+', label: 'Branches Mapped', color: '#059669' },
    { icon: <Award size={22} />, to: 98, suffix: '%', label: 'Satisfaction Rate', color: '#7c3aed' },
  ];
  return (
    <div className="gyc-stats">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="gyc-stat"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          <div className="gyc-stat-ic" style={{ color: it.color, background: `${it.color}14` }}>
            {it.icon}
          </div>
          <div className="gyc-stat-val" style={{ color: it.color }}>
            <Counter to={it.to} suffix={it.suffix} />
          </div>
          <div className="gyc-stat-lbl">{it.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

/* ─────────── NEWS / RECRUITMENTS / TENDERS ─────────── */
const NEWS_COLS = [
  {
    title: 'News & Events',
    icon: <Newspaper size={16} />,
    accent: '#dc2626',
    items: [
      { day: '20', mon: 'MAY 2025', title: 'TNEA 2025 — Round 3 seat allotment published on official portal', sub: 'Admissions' },
      { day: '15', mon: 'MAY 2025', title: 'Workshop: Smart Choice List Preparation — Register for free webinar', sub: 'Events' },
      { day: '08', mon: 'MAY 2025', title: 'New Department Explorer released — compare 150+ branches side-by-side', sub: 'Product' },
      { day: '02', mon: 'MAY 2025', title: 'Anna University shares official placement data for 2024 batch', sub: 'Data Release' },
    ],
  },
  {
    title: 'Recruitments',
    icon: <Briefcase size={16} />,
    accent: '#1a73e8',
    items: [
      { day: '25', mon: 'MAY 2025', title: 'Student Counsellor (Remote) — Apply before 30 May', sub: 'Mentora AI Team' },
      { day: '20', mon: 'MAY 2025', title: 'Content Writer — Engineering Branches', sub: 'Content Team' },
      { day: '15', mon: 'MAY 2025', title: 'Frontend React Developer', sub: 'Engineering' },
      { day: '10', mon: 'MAY 2025', title: 'Campus Ambassador 2025 — Colleges across Tamil Nadu', sub: 'Outreach' },
    ],
  },
  {
    title: 'Tenders & Partnerships',
    icon: <FileText size={16} />,
    accent: '#059669',
    items: [
      { day: '28', mon: 'MAY 2025', title: 'RFP: Campus partnership for 2026 TNEA counselling drive', sub: 'Partnerships' },
      { day: '18', mon: 'MAY 2025', title: 'Cloud infrastructure tender — 2025-26', sub: 'IT Infra' },
      { day: '10', mon: 'MAY 2025', title: 'Print & distribution partnership — Choice list guidebook', sub: 'Operations' },
    ],
  },
];

export const NewsGrid = () => (
  <div className="gyc-news-grid">
    {NEWS_COLS.map((col, i) => (
      <motion.div
        key={col.title}
        className="gyc-news-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
      >
        <div className="gyc-news-head" style={{ '--ac': col.accent }}>
          <span className="gyc-news-title">
            <span className="gyc-news-ic" style={{ color: col.accent }}>{col.icon}</span>
            {col.title}
          </span>
          <button className="gyc-news-more" style={{ background: col.accent }}>
            View More <ArrowRight size={12} />
          </button>
        </div>
        <div className="gyc-news-body">
          {col.items.map((it, j) => (
            <div className="gyc-news-row" key={j}>
              <div className="gyc-news-date">
                <span className="gyc-nd-day">{it.day}</span>
                <span className="gyc-nd-mon">{it.mon}</span>
              </div>
              <div className="gyc-news-text">
                <p className="gyc-news-line">{it.title}</p>
                <span className="gyc-news-sub">{it.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

/* ─────────── WHY CHOOSE US ─────────── */
const FEATURES = [
  { ic: <ShieldCheck size={22} />, title: 'Verified Data', desc: 'Official TNEA cutoffs, seat matrix & placement reports — refreshed every round.', color: '#1a73e8' },
  { ic: <Sparkles size={22} />, title: 'Mentora AI', desc: 'Smart guidance engine that turns your rank into a ranked choice list.', color: '#f97316' },
  { ic: <GraduationCap size={22} />, title: 'Branch Explorer', desc: 'Compare 150+ engineering branches by placement, CTC and industry fit.', color: '#059669' },
  { ic: <Users size={22} />, title: '1:1 Counselling', desc: 'Book a session with a real counsellor — no chatbots, no scripts.', color: '#7c3aed' },
];

export const WhyChooseUs = () => (
  <div className="gyc-why">
    <div className="gyc-why-head">
      <span className="gyc-why-eyebrow">WHY GETYOURCOLLEGE</span>
      <h2>Everything you need, in one place.</h2>
      <p>From cutoff research to confirmed seat — guided, transparent, and built for 2025.</p>
    </div>
    <div className="gyc-why-grid">
      {FEATURES.map((f, i) => (
        <motion.div
          key={i}
          className="gyc-why-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          whileHover={{ y: -6 }}
        >
          <div className="gyc-why-ic" style={{ color: f.color, background: `${f.color}14` }}>{f.ic}</div>
          <h4>{f.title}</h4>
          <p>{f.desc}</p>
          <span className="gyc-why-bar" style={{ background: f.color }} />
        </motion.div>
      ))}
    </div>
  </div>
);

/* ─────────── TESTIMONIALS ─────────── */
const QUOTES = [
  { name: 'Aarav S.', role: 'CSE · PSG Tech', text: 'The choice list Mentora AI suggested matched my rank perfectly — got CSE in round 2.', rating: 5 },
  { name: 'Divya R.', role: 'ECE · CEG Guindy', text: 'The branch explorer helped me understand ECE placement trends before picking.', rating: 5 },
  { name: 'Karthik M.', role: 'AI-DS · SSN', text: 'One counselling call saved me from a wrong college. Totally worth it.', rating: 5 },
  { name: 'Meera P.', role: 'Mech · Thiagarajar', text: 'Saw every round-wise cutoff in one place. No guesswork.', rating: 5 },
  { name: 'Rohit N.', role: 'IT · MIT Chromepet', text: 'The TNEA info dashboard is way cleaner than the official site.', rating: 5 },
];

export const Testimonials = () => {
  return (
    <div className="gyc-testi-wrap">
      <div className="gyc-testi-head">
        <span className="gyc-why-eyebrow">STUDENT VOICES</span>
        <h2>Built on real admissions.</h2>
      </div>
      <div className="gyc-testi-viewport">
        <div className="gyc-testi-track">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <div className="gyc-testi-card" key={i}>
              <Quote size={22} className="gyc-testi-q" />
              <div className="gyc-testi-stars">
                {Array.from({ length: q.rating }).map((_, k) => <Star key={k} size={14} fill="#facc15" stroke="#facc15" />)}
              </div>
              <p className="gyc-testi-text">"{q.text}"</p>
              <div className="gyc-testi-foot">
                <div className="gyc-testi-av">{q.name.charAt(0)}</div>
                <div>
                  <strong>{q.name}</strong>
                  <span>{q.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────── FOOTER ─────────── */
export const SiteFooter = () => (
  <footer className="gyc-footer">
    <div className="gyc-foot-top">
      <div className="gyc-foot-brand">
        <div className="gyc-foot-brand-row">
          <BrandLogo size={42} />
          <div>
            <strong>GetYourCollege</strong>
            <span>Quantum shift to your career</span>
          </div>
        </div>
        <p className="gyc-foot-about">
          Independent guidance platform for TNEA, NEET and Tamil Nadu university admissions.
          Built by educators, data engineers and counsellors.
        </p>
        <div className="gyc-foot-social">
          <a aria-label="Facebook" href="#facebook"><Facebook size={16} /></a>
          <a aria-label="Instagram" href="#instagram"><Instagram size={16} /></a>
          <a aria-label="Twitter" href="#twitter"><Twitter size={16} /></a>
          <a aria-label="LinkedIn" href="#linkedin"><Linkedin size={16} /></a>
          <a aria-label="YouTube" href="#youtube"><Youtube size={16} /></a>
        </div>
      </div>
      <div className="gyc-foot-col">
        <h5>Explore</h5>
        <a href="#explore">Anna University</a>
        <a href="#explore">Medical & Dental</a>
        <a href="#explore">Deemed & Private</a>
        <a href="#explore">Department Explorer</a>
      </div>
      <div className="gyc-foot-col">
        <h5>Services</h5>
        <a href="#register">Registration</a>
        <a href="#book">Book a Slot</a>
        <a href="#choicelist">Choice List Prep</a>
        <a href="#mentora">Mentora AI</a>
      </div>
      <div className="gyc-foot-col gyc-foot-contact">
        <h5>Reach Us</h5>
        <span><MapPin size={13} /> Chennai, Tamil Nadu 600119</span>
        <span><Phone size={13} /> +91 98765 43210</span>
        <span><Mail size={13} /> hello@getyourcollege.com</span>
        <span><Clock size={13} /> Mon–Sat · 9:00 AM – 7:00 PM</span>
      </div>
    </div>
    <div className="gyc-foot-sub">
      <form className="gyc-foot-sub-form" onSubmit={(e) => e.preventDefault()}>
        <span>Get admission updates in your inbox</span>
        <div className="gyc-foot-sub-row">
          <input type="email" placeholder="your@email.com" />
          <button type="submit"><Send size={14} /> Subscribe</button>
        </div>
      </form>
    </div>
    <div className="gyc-foot-bot">
      <span>© 2025 GetYourCollege · All rights reserved</span>
      <span className="gyc-foot-dot">·</span>
      <a href="#privacy">Privacy</a>
      <a href="#terms">Terms</a>
      <a href="#refund">Refund Policy</a>
    </div>
  </footer>
);
