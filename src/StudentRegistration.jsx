import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Phone, Building2, BookOpen, Zap, Shield, CheckCircle2 } from 'lucide-react';

const StudentRegistration = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    cutoff: '',
    preferredCollege: '',
    needsCounselling: null,
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    {
      id: 'personal',
      title: 'Personal Details',
      subtitle: 'Tell us about yourself',
      icon: '👤',
      fields: ['fullName', 'email', 'mobileNumber']
    },
    {
      id: 'academic',
      title: 'Academic Info',
      subtitle: 'Your college preferences',
      icon: '📚',
      fields: ['cutoff', 'preferredCollege']
    },
    {
      id: 'counselling',
      title: 'Counselling',
      subtitle: 'Need guidance?',
      icon: '💬',
      fields: ['needsCounselling']
    },
    {
      id: 'remarks',
      title: 'Additional Info',
      subtitle: 'Any special requests?',
      icon: '📝',
      fields: ['remarks']
    }
  ];

  const validateStep = (stepFields) => {
    const stepErrors = {};
    
    stepFields.forEach(field => {
      const value = formData[field];
      
      if (field === 'fullName' && !value.trim()) {
        stepErrors[field] = 'Name is required';
      }
      if (field === 'email' && value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          stepErrors[field] = 'Invalid email format';
        }
      }
      if (field === 'mobileNumber' && !value.trim()) {
        stepErrors[field] = 'Mobile number is required';
      } else if (field === 'mobileNumber' && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
        stepErrors[field] = '10-digit number required';
      }
      if (field === 'needsCounselling' && value === null) {
        stepErrors[field] = 'Please select';
      }
    });

    return stepErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      needsCounselling: value
    }));
    if (errors.needsCounselling) {
      setErrors(prev => ({
        ...prev,
        needsCounselling: ''
      }));
    }
  };

  const handleNext = () => {
    const stepFields = steps[currentStep].fields;
    const stepErrors = validateStep(stepFields);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    const stepErrors = validateStep(steps[currentStep].fields);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 2500);
  };

  if (submitted) {
    return (
      <motion.div 
        className="sr-wrapper"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowX: 'hidden',
          zIndex: 100
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="sr-hero-glass">
          <motion.div className="sr-success-container" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="sr-success-icon"
            >
              <CheckCircle2 size={100} />
            </motion.div>
            <h2>Registration Complete!</h2>
            <p>We'll contact you soon with personalized guidance.</p>
            <button className="sr-cta-btn" onClick={onBack}>
              Back to Home
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <motion.div 
      className="sr-wrapper"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        zIndex: 100
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sr-hero-glass">
        <button className="sr-back-btn-hero" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        
        <div className="sr-stepper">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              className={`sr-step-indicator ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="sr-step-circle">{idx + 1}</div>
              <div className="sr-step-label">{step.title}</div>
            </motion.div>
          ))}
        </div>

        <div className="sr-progress-bar">
          <motion.div 
            className="sr-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="sr-container-glass">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="sr-form-step"
          >
            <div className="sr-step-header">
              <div className="sr-step-icon">{currentStepData.icon}</div>
              <div>
                <h2>{currentStepData.title}</h2>
                <p>{currentStepData.subtitle}</p>
              </div>
            </div>

            <div className="sr-step-content">
              {/* Personal Details Step */}
              {currentStep === 0 && (
                <motion.div className="sr-fields-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div className="sr-field-group">
                    <label>Full Name *</label>
                    <div className="sr-input-glass">
                      <User size={18} className="sr-icon" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={errors.fullName ? 'error' : ''}
                      />
                    </div>
                    {errors.fullName && <span className="sr-error-text">{errors.fullName}</span>}
                  </div>

                  <div className="sr-field-group">
                    <label>Email Address</label>
                    <div className="sr-input-glass">
                      <span className="sr-icon">✉️</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="sr-error-text">{errors.email}</span>}
                  </div>

                  <div className="sr-field-group">
                    <label>Mobile Number *</label>
                    <div className="sr-input-glass">
                      <Phone size={18} className="sr-icon" />
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        className={errors.mobileNumber ? 'error' : ''}
                      />
                    </div>
                    {errors.mobileNumber && <span className="sr-error-text">{errors.mobileNumber}</span>}
                  </div>
                </motion.div>
              )}

              {/* Academic Info Step */}
              {currentStep === 1 && (
                <motion.div className="sr-fields-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div className="sr-field-group">
                    <label>12th Expected Cutoff</label>
                    <div className="sr-input-glass">
                      <span className="sr-icon">📊</span>
                      <input
                        type="text"
                        name="cutoff"
                        value={formData.cutoff}
                        onChange={handleInputChange}
                        placeholder="e.g. 195/200"
                      />
                    </div>
                  </div>

                  <div className="sr-field-group">
                    <label>Preferred College</label>
                    <div className="sr-input-glass">
                      <Building2 size={18} className="sr-icon" />
                      <input
                        type="text"
                        name="preferredCollege"
                        value={formData.preferredCollege}
                        onChange={handleInputChange}
                        placeholder="e.g. Anna University"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Counselling Step */}
              {currentStep === 2 && (
                <motion.div className="sr-fields-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <label style={{ marginBottom: '16px' }}>Do you need counselling? *</label>
                  <div className="sr-toggle-cards">
                    <motion.div
                      className={`sr-toggle-card ${formData.needsCounselling === true ? 'active' : ''}`}
                      onClick={() => handleToggle(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Zap size={28} />
                      <span>Yes, I need help</span>
                    </motion.div>
                    <motion.div
                      className={`sr-toggle-card ${formData.needsCounselling === false ? 'active' : ''}`}
                      onClick={() => handleToggle(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Shield size={28} />
                      <span>I'm good, thanks</span>
                    </motion.div>
                  </div>
                  {errors.needsCounselling && <span className="sr-error-text">{errors.needsCounselling}</span>}
                </motion.div>
              )}

              {/* Remarks Step */}
              {currentStep === 3 && (
                <motion.div className="sr-fields-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div className="sr-field-group">
                    <label>Remarks & Notes</label>
                    <div className="sr-textarea-glass">
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        placeholder="Any specific course interest, concerns, or notes..."
                        rows="5"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="sr-step-footer">
              <motion.button
                className="sr-btn-secondary"
                onClick={handlePrev}
                disabled={currentStep === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={18} /> Previous
              </motion.button>

              <motion.button
                className="sr-btn-primary"
                onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'} <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default StudentRegistration;
