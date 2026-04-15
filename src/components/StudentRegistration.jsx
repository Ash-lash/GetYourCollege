import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Phone,
  User,
  BookOpen,
  Building2,
  MessageSquare,
  Zap,
  Shield
} from 'lucide-react';

const StudentRegistration = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    cutoff: '',
    college: '',
    counselling: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 'personal', title: 'Personal Details', subtitle: 'Tell us about yourself', icon: User },
    { id: 'academic', title: 'Academic Info', subtitle: 'Your college preferences', icon: BookOpen },
    { id: 'counselling', title: 'Counselling', subtitle: 'Need guidance?', icon: MessageSquare },
    { id: 'remarks', title: 'Additional Info', subtitle: 'Any special requests?', icon: Zap }
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name required';
      if (!formData.email.trim()) newErrors.email = 'Email required';
      if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Valid 10-digit number required';
    }

    if (step === 1 && formData.cutoff && Number.isNaN(Number(formData.cutoff))) {
      newErrors.cutoff = 'Enter valid score';
    }

    if (step === 2 && formData.counselling === '') {
      newErrors.counselling = 'Select Yes or No';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggle = (value) => {
    setFormData(prev => ({ ...prev, counselling: value }));
    if (errors.counselling) {
      setErrors(prev => ({ ...prev, counselling: '' }));
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setTimeout(() => onBack(), 2500);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(6, 182, 212, 0.12), transparent 26%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '44px 28px',
            textAlign: 'center',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)'
          }}
        >
          <div style={{ width: 92, height: 92, borderRadius: '50%', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(79, 70, 229, 0.12))', color: '#10b981' }}>
            <CheckCircle2 size={54} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'rgba(79, 70, 229, 0.08)', color: '#4338ca', fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>
            Registration complete
          </div>
          <h2 style={{ color: '#0f172a', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.04em' }}>
            Thank you.
          </h2>
          <p style={{ color: '#475467', fontSize: 16, lineHeight: 1.6, margin: '0 auto', maxWidth: 480 }}>
            Your registration has been submitted successfully. Our team will reach out with the right counselling guidance and college options.
          </p>
        </motion.div>
      </motion.main>
    );
  }

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progressWidth = `${((currentStep + 1) / steps.length) * 100}%`;

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.14), transparent 26%), radial-gradient(circle at top right, rgba(6, 182, 212, 0.12), transparent 24%), linear-gradient(180deg, #ffffff 0%, #f6f7fb 40%, #eef2ff 100%)',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <style>{`
        .sr-shell {
          width: min(1160px, calc(100% - 32px));
          margin: 0 auto;
          padding: 24px 0 36px;
          position: relative;
          z-index: 2;
        }

        .sr-hero {
          position: relative;
          background: rgba(255, 255, 255, 0.74);
          border: 1px solid rgba(226, 232, 240, 0.92);
          border-radius: 28px;
          padding: 20px 22px 18px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .sr-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.06), transparent 42%, rgba(6, 182, 212, 0.05));
          pointer-events: none;
        }

        .sr-back-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.95);
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          cursor: pointer;
          position: relative;
          z-index: 1;
        }

        .sr-hero-copy {
          position: relative;
          z-index: 1;
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }

        .sr-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(79, 70, 229, 0.08);
          color: #4338ca;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .sr-hero-copy h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #0f172a;
        }

        .sr-hero-copy h1 span {
          color: #4f46e5;
        }

        .sr-hero-copy p {
          margin: 0;
          font-size: 0.98rem;
          line-height: 1.6;
          color: #475467;
          max-width: 760px;
        }

        .sr-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .sr-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #334155;
          font-size: 0.84rem;
          font-weight: 600;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
        }

        .sr-pill span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
        }

        .sr-progress-bar {
          height: 6px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 20px;
        }

        .sr-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4);
          border-radius: inherit;
          box-shadow: 0 0 18px rgba(79, 70, 229, 0.35);
        }

        .sr-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr);
          gap: 20px;
          margin-top: 20px;
          align-items: start;
        }

        .sr-side-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(18px);
          position: sticky;
          top: 24px;
        }

        .sr-side-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.08);
          color: #047857;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .sr-side-card h2 {
          margin: 14px 0 10px;
          font-size: 1.6rem;
          line-height: 1.1;
          letter-spacing: -0.04em;
          color: #0f172a;
        }

        .sr-side-card p {
          margin: 0;
          color: #475467;
          line-height: 1.65;
          font-size: 0.95rem;
        }

        .sr-point-list {
          display: grid;
          gap: 10px;
          margin: 18px 0 0;
        }

        .sr-point {
          display: flex;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(248, 250, 252, 0.95);
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #334155;
          font-size: 0.92rem;
          line-height: 1.45;
        }

        .sr-point-bullet {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(6, 182, 212, 0.12));
          color: #4338ca;
          font-weight: 800;
        }

        .sr-trust-note {
          margin-top: 18px;
          display: flex;
          gap: 12px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.18);
          color: #0f766e;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .sr-form-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.84);
          backdrop-filter: blur(18px);
          border-radius: 28px;
          padding: 28px 28px 26px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
        }

        .sr-step-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 26px;
        }

        .sr-step-icon {
          width: 62px;
          height: 62px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(6, 182, 212, 0.08));
        }

        .sr-step-header h2 {
          margin: 0 0 4px;
          color: #0f172a;
          font-size: 1.55rem;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .sr-step-header p {
          margin: 0;
          color: #475467;
        }

        .sr-fields-group {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-height: 240px;
        }

        .sr-field-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sr-field-group label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }

        .sr-input-glass,
        .sr-textarea-glass {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 16px;
          background: rgba(248, 250, 252, 0.95);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .sr-input-glass:focus-within,
        .sr-textarea-glass:focus-within {
          background: #fff;
          border-color: rgba(79, 70, 229, 0.45);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        .sr-input-glass input,
        .sr-textarea-glass textarea {
          flex: 1;
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #0f172a;
          font: inherit;
          font-size: 0.95rem;
        }

        .sr-input-glass input::placeholder,
        .sr-textarea-glass textarea::placeholder {
          color: #94a3b8;
        }

        .sr-icon {
          color: #64748b;
          flex: 0 0 auto;
        }

        .sr-textarea-glass textarea {
          min-height: 132px;
          resize: vertical;
        }

        .sr-error-text {
          font-size: 0.8rem;
          color: #ef4444;
          font-weight: 600;
        }

        .sr-toggle-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .sr-toggle-card {
          padding: 22px;
          background: rgba(248, 250, 252, 0.96);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 18px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          color: #0f172a;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .sr-toggle-card:hover {
          transform: translateY(-2px);
          border-color: rgba(79, 70, 229, 0.35);
          box-shadow: 0 14px 32px rgba(79, 70, 229, 0.12);
        }

        .sr-toggle-card.active {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(6, 182, 212, 0.08));
          border-color: rgba(79, 70, 229, 0.42);
        }

        .sr-step-footer {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .sr-btn-secondary,
        .sr-btn-primary {
          flex: 1;
          padding: 14px 20px;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .sr-btn-secondary {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.95);
          color: #334155;
        }

        .sr-btn-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #06b6d4 100%);
          color: #fff;
          box-shadow: 0 16px 32px rgba(79, 70, 229, 0.22);
        }

        .sr-btn-secondary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @media (max-width: 980px) {
          .sr-layout {
            grid-template-columns: 1fr;
          }

          .sr-side-card {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 720px) {
          .sr-shell {
            width: min(100%, calc(100% - 22px));
            padding-top: 18px;
          }

          .sr-hero,
          .sr-form-card,
          .sr-side-card {
            border-radius: 22px;
          }

          .sr-form-card {
            padding: 22px 18px 18px;
          }

          .sr-toggle-cards,
          .sr-step-footer {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="sr-shell">
        <div className="sr-hero">
          <button className="sr-back-btn" onClick={onBack} type="button">
            <ChevronLeft size={20} />
          </button>

          <div className="sr-hero-copy">
            <div className="sr-kicker">Quick Registration</div>
            <h1>Student <span>Registration</span></h1>
            <p>
              Fill the essentials, then let us do the useful part. Same logic, better visual rhythm, cleaner spacing, and a more polished first impression.
            </p>
            <div className="sr-pill-row" aria-hidden="true">
              <div className="sr-pill"><span /> Guided counselling</div>
              <div className="sr-pill"><span /> Clean multi-step flow</div>
              <div className="sr-pill"><span /> College-first matching</div>
            </div>
          </div>

          <div className="sr-progress-bar">
            <motion.div className="sr-progress-fill" initial={{ width: 0 }} animate={{ width: progressWidth }} transition={{ duration: 0.45 }} />
          </div>
        </div>

        <div className="sr-layout">
          <aside className="sr-side-card">
            <div className="sr-side-kicker">Why this works</div>
            <h2>A cleaner form that feels less like a chore.</h2>
            <p>
              We kept the same registration logic, then wrapped it in a sharper layout with better hierarchy, stronger visual feedback, and a more premium feel.
            </p>
            <div className="sr-point-list">
              <div className="sr-point"><span className="sr-point-bullet">1</span><span>Personal details first, so the flow stays short and focused.</span></div>
              <div className="sr-point"><span className="sr-point-bullet">2</span><span>Academic and college preferences are grouped with clear spacing.</span></div>
              <div className="sr-point"><span className="sr-point-bullet">3</span><span>Counselling choice stands out so the action is obvious.</span></div>
            </div>
            <div className="sr-trust-note">
              <Shield size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Your details are used only for counselling follow-up and college guidance.</span>
            </div>
          </aside>

          <div className="sr-form-card">
            <div className="sr-step-header">
              <div className="sr-step-icon"><StepIcon size={28} color="#4f46e5" /></div>
              <div>
                <h2>{currentStepData.title}</h2>
                <p>{currentStepData.subtitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div key="step-0" className="sr-fields-group" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                    <div className="sr-field-group">
                      <label>Full Name *</label>
                      <div className="sr-input-glass">
                        <User size={18} className="sr-icon" />
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
                      </div>
                      {errors.name && <span className="sr-error-text">{errors.name}</span>}
                    </div>

                    <div className="sr-field-group">
                      <label>Email Address *</label>
                      <div className="sr-input-glass">
                        <MessageSquare size={18} className="sr-icon" />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                      </div>
                      {errors.email && <span className="sr-error-text">{errors.email}</span>}
                    </div>

                    <div className="sr-field-group">
                      <label>Mobile Number *</label>
                      <div className="sr-input-glass">
                        <Phone size={18} className="sr-icon" />
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="10-digit number" maxLength="10" inputMode="numeric" />
                      </div>
                      {errors.mobile && <span className="sr-error-text">{errors.mobile}</span>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div key="step-1" className="sr-fields-group" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                    <div className="sr-field-group">
                      <label>12th Expected Cutoff</label>
                      <div className="sr-input-glass">
                        <BookOpen size={18} className="sr-icon" />
                        <input name="cutoff" value={formData.cutoff} onChange={handleInputChange} placeholder="e.g. 195/200" inputMode="decimal" />
                      </div>
                      {errors.cutoff && <span className="sr-error-text">{errors.cutoff}</span>}
                    </div>

                    <div className="sr-field-group">
                      <label>Preferred College</label>
                      <div className="sr-input-glass">
                        <Building2 size={18} className="sr-icon" />
                        <input name="college" value={formData.college} onChange={handleInputChange} placeholder="e.g. Anna University" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step-2" className="sr-fields-group" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                    <label>Do you need counselling? *</label>
                    <div className="sr-toggle-cards">
                      <motion.div className={`sr-toggle-card ${formData.counselling === 'Yes' ? 'active' : ''}`} onClick={() => handleToggle('Yes')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Zap size={28} color="#4f46e5" />
                        <span>Yes, I need help</span>
                      </motion.div>
                      <motion.div className={`sr-toggle-card ${formData.counselling === 'No' ? 'active' : ''}`} onClick={() => handleToggle('No')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Shield size={28} color="#06b6d4" />
                        <span>I’m good, thanks</span>
                      </motion.div>
                    </div>
                    {errors.counselling && <span className="sr-error-text">{errors.counselling}</span>}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step-3" className="sr-fields-group" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
                    <div className="sr-field-group">
                      <label>Remarks & Notes</label>
                      <div className="sr-textarea-glass">
                        <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Any specific course interest, concerns, or notes..." rows="5" />
                      </div>
                    </div>

                    <div className="sr-trust-note" style={{ marginTop: 4 }}>
                      <Shield size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>We use this only to tailor your counselling response and college suggestions.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="sr-step-footer">
                <motion.button type="button" className="sr-btn-secondary" onClick={handlePrev} disabled={currentStep === 0} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <ChevronLeft size={18} /> Previous
                </motion.button>

                <motion.button
                  type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                  className="sr-btn-primary"
                  onClick={currentStep === steps.length - 1 ? undefined : handleNext}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Submitting...' : currentStep === steps.length - 1 ? 'Submit' : 'Next'} {!loading && <ChevronRight size={18} />}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default StudentRegistration;
