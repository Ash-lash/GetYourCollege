import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Phone, User, BookOpen, Building2, MessageSquare, Zap, Shield } from 'lucide-react';

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
    { title: 'Personal Details', icon: User },
    { title: 'Academic Info', icon: BookOpen },
    { title: 'Counselling', icon: MessageSquare },
    { title: 'Additional Info', icon: Zap }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name required';
      if (!formData.email.trim()) newErrors.email = 'Email required';
      if (!formData.mobile.trim() || formData.mobile.length !== 10) newErrors.mobile = 'Valid 10-digit number required';
    } else if (step === 1) {
      if (formData.cutoff && isNaN(parseFloat(formData.cutoff))) newErrors.cutoff = 'Enter valid score';
    } else if (step === 2) {
      if (!formData.counselling) newErrors.counselling = 'Select Yes or No';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Success State
  if (submitted) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          minHeight: '100vh',
          background: '#ffffff',
          paddingTop: '100px',
          paddingBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ scale: 0, rotateZ: -20 }}
          animate={{ scale: 1, rotateZ: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '20px', color: '#10b981' }}
          >
            <CheckCircle2 size={80} />
          </motion.div>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Thank You!</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', marginBottom: '30px' }}>
            Your registration has been submitted successfully. Our team will contact you soon.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0);
              setFormData({ name: '', email: '', mobile: '', cutoff: '', college: '', counselling: '', remarks: '' });
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Register Another Student
          </motion.button>
        </motion.div>
      </motion.main>
    );
  }


  return (
    <motion.main
      key="registration"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        paddingTop: '100px',
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <ChevronLeft size={16} /> Back
        </motion.button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0' }}>
            Student <span style={{ color: '#fbbf24' }}>Registration</span>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '13px', margin: '0' }}>
            Find your perfect college
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
              >
                <motion.div
                  animate={{
                    background: currentStep >= idx
                      ? 'linear-gradient(135deg, #667eea, #f093fb)'
                      : 'rgba(255, 255, 255, 0.1)',
                    scale: currentStep === idx ? 1.1 : 1
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {currentStep > idx ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <IconComp size={20} />
                  )}
                </motion.div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', textAlign: 'center', maxWidth: '70px' }}>
                  {step.title}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              borderRadius: '2px'
            }}
          />
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px 30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        }}
      >
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 0: Personal Details */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
                  📋 Your Personal Details
                </h3>

                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ marginBottom: '16px' }}
                >
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Full Name <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <User size={18} color="rgba(255, 255, 255, 0.6)" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  {errors.name && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ marginBottom: '16px' }}
                >
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Email Address <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <MessageSquare size={18} color="rgba(255, 255, 255, 0.6)" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  {errors.email && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                </motion.div>

                {/* Mobile Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Mobile Number <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <Phone size={18} color="rgba(255, 255, 255, 0.6)" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      inputMode="numeric"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  {errors.mobile && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>{errors.mobile}</p>}
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Academic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
                  📚 Academic Information
                </h3>

                {/* Cutoff Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ marginBottom: '16px' }}
                >
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    12th Expected Cutoff
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <BookOpen size={18} color="rgba(255, 255, 255, 0.6)" />
                    <input
                      type="text"
                      name="cutoff"
                      value={formData.cutoff}
                      onChange={handleInputChange}
                      placeholder="e.g. 180 / 195 / 198.5"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  {errors.cutoff && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>{errors.cutoff}</p>}
                </motion.div>

                {/* College Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Preferred College
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.08)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <Building2 size={18} color="rgba(255, 255, 255, 0.6)" />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g. Anna University, MMC Chennai"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Counselling */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
                  🎯 Do you need counselling?
                </h3>

                <div style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { value: 'Yes', label: '✅ Yes', color: '#10b981' },
                    { value: 'No', label: '❌ No', color: '#ef4444' }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, counselling: option.value }))}
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        background: formData.counselling === option.value
                          ? `rgba(${option.color === '#10b981' ? '16, 185, 129' : '239, 68, 68'}, 0.3)`
                          : 'rgba(255, 255, 255, 0.08)',
                        borderColor: formData.counselling === option.value
                          ? option.color
                          : 'rgba(255, 255, 255, 0.15)'
                      }}
                      style={{
                        flex: 1,
                        padding: '20px',
                        borderRadius: '16px',
                        border: '2px solid',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>

                {errors.counselling && <p style={{ color: '#fca5a5', fontSize: '12px', marginTop: '16px', textAlign: 'center' }}>{errors.counselling}</p>}
              </motion.div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
                  ✨ Additional Information
                </h3>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Any specific course interest, doubts, or notes..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      minHeight: '120px',
                      resize: 'none',
                      outline: 'none'
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', gap: '12px' }}
                >
                  <Shield size={20} color="#10b981" style={{ flexShrink: 0 }} />
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', margin: 0 }}>
                    Your data is completely safe and will only be used for counselling purposes.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <motion.button
              type="button"
              onClick={handlePrev}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={currentStep === 0}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: currentStep === 0 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ChevronLeft size={16} /> Previous
            </motion.button>

            <motion.button
              type={currentStep === steps.length - 1 ? 'submit' : 'button'}
              onClick={currentStep === steps.length - 1 ? undefined : handleNext}
              disabled={loading}
              whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>Submit <ChevronRight size={16} /></>
              ) : (
                <>Next <ChevronRight size={16} /></>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.main>
  );
};

export default StudentRegistration;
