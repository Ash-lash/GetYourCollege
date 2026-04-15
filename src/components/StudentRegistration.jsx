import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Phone, User, BookOpen, Building2, MessageSquare } from 'lucide-react';

const StudentRegistration = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    cutoff: '',
    college: '',
    counselling: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.mobile.trim() || formData.mobile.length !== 10) newErrors.mobile = 'Enter valid 10-digit number';
    if (!formData.counselling) newErrors.counselling = 'Please select Yes or No';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', mobile: '', cutoff: '', college: '', counselling: '', remarks: '' });
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

  const handleCounsellingChange = (value) => {
    setFormData(prev => ({ ...prev, counselling: value }));
    if (errors.counselling) setErrors(prev => ({ ...prev, counselling: '' }));
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sr-container"
      >
        <motion.div
          initial={{ scale: 0, rotateZ: -10 }}
          animate={{ scale: 1, rotateZ: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="sr-success-card"
        >
          <CheckCircle2 size={64} className="sr-check-icon" />
          <h2 className="sr-success-title">Thank You!</h2>
          <p className="sr-success-text">Your registration has been submitted successfully. Our team will contact you soon.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', mobile: '', cutoff: '', college: '', counselling: '', remarks: '' });
            }}
            className="sr-success-btn"
          >
            Register Another Student
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const formFields = [
    {
      name: 'name',
      label: 'Student Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: User,
      required: true
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: '10-digit mobile number',
      icon: Phone,
      required: true,
      maxLength: 10
    },
    {
      name: 'cutoff',
      label: '12th Expected Cutoff',
      type: 'text',
      placeholder: 'e.g. 180 / 195 / 198.5',
      icon: BookOpen,
      required: false
    },
    {
      name: 'college',
      label: 'Preferred College',
      type: 'text',
      placeholder: 'e.g. Anna University, MMC Chennai',
      icon: Building2,
      required: false
    }
  ];

  return (
    <motion.main
      key="registration"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="sr-main"
    >
      <div className="sr-header">
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="sr-back-btn"
        >
          <ChevronLeft size={18} /> Back
        </motion.button>
        <div className="sr-header-content">
          <h1 className="sr-page-title">Student <span className="sr-accent">Registration</span></h1>
          <p className="sr-page-subtitle">Join millions of students finding their perfect college</p>
        </div>
      </div>

      <div className="sr-container">
        <motion.div
          className="sr-card sr-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="sr-form-header">
            <span className="sr-section-label">📋 Your Details</span>
          </div>

          <form onSubmit={handleSubmit} className="sr-form">
            {/* Grid of form fields with 3D cards */}
            <div className="sr-fields-grid">
              {formFields.map((field, idx) => {
                const IconComp = field.icon;
                return (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="sr-field-wrapper"
                  >
                    <div className={`sr-field ${errors[field.name] ? 'sr-error' : ''}`}>
                      <label className="sr-label">
                        {field.label}
                        {field.required && <span className="sr-required">*</span>}
                      </label>
                      <div className="sr-input-wrapper">
                        <IconComp size={18} className="sr-field-icon" />
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          maxLength={field.maxLength}
                          inputMode={field.type === 'tel' ? 'numeric' : 'text'}
                          className="sr-input"
                        />
                      </div>
                      {errors[field.name] && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="sr-error-msg"
                        >
                          {errors[field.name]}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Counselling Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sr-field"
            >
              <label className="sr-label">
                Need Counselling?
                <span className="sr-required">*</span>
              </label>
              <div className="sr-toggle-group">
                {[
                  { value: 'Yes', label: '✅ Yes', color: 'green' },
                  { value: 'No', label: '❌ No', color: 'red' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleCounsellingChange(option.value)}
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`sr-toggle-btn sr-toggle-${option.color} ${
                      formData.counselling === option.value ? 'sr-toggle-active' : ''
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              {errors.counselling && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sr-error-msg"
                >
                  {errors.counselling}
                </motion.div>
              )}
            </motion.div>

            {/* Remarks Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="sr-field"
            >
              <label className="sr-label">
                <MessageSquare size={16} style={{ marginRight: '6px', display: 'inline' }} />
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Any specific course interest, doubts, or notes..."
                className="sr-textarea"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="sr-submit-btn"
            >
              {loading ? (
                <>
                  <span className="sr-spinner"></span>
                  Submitting...
                </>
              ) : (
                <>Submit Registration →</>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="sr-info-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: '🎯', title: 'Expert Guidance', desc: 'Get personalized counselling' },
            { icon: '⚡', title: 'Fast Process', desc: 'Registration in under 2 minutes' },
            { icon: '🔒', title: 'Secure & Private', desc: 'Your data is completely safe' }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, rotateZ: 2 }}
              className="sr-info-card"
            >
              <div className="sr-info-icon">{card.icon}</div>
              <h3 className="sr-info-title">{card.title}</h3>
              <p className="sr-info-desc">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.main>
  );
};

export default StudentRegistration;
