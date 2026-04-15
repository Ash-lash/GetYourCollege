import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, User, Phone, MessageSquare } from 'lucide-react';

const StudentRegistration = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    stream: 'Science',
    needsCounselling: null,
    counsellingType: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Valid 10-digit mobile number required';
    }
    if (formData.needsCounselling === null) {
      newErrors.needsCounselling = 'Please select if you need counselling';
    }
    if (formData.needsCounselling === true && !formData.counsellingType) {
      newErrors.counsellingType = 'Please select a counselling type';
    }
    return newErrors;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (submitted) {
    return (
      <motion.main 
        className="sr-main"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="sr-success-card">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <CheckCircle2 size={100} color="#10b981" />
          </motion.div>
          <h2>Registration Successful!</h2>
          <p>Thank you for registering with GetYouCollege. We will contact you soon with personalized guidance.</p>
          <motion.button
            className="sr-success-btn"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main 
      className="sr-main"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="sr-container">
        <button className="sr-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back
        </button>

        <div className="sr-header">
          <h1>Join GetYouCollege</h1>
          <p>Register to get personalized college guidance</p>
        </div>

        <motion.form 
          className={`sr-form ${isShaking ? 'shake' : ''}`}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Full Name */}
          <div className="sr-form-group">
            <label className="sr-label">Full Name *</label>
            <div className="sr-input-wrapper">
              <User size={18} className="sr-input-icon" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`sr-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Your full name"
              />
            </div>
            {errors.fullName && <span className="sr-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="sr-form-group">
            <label className="sr-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`sr-input ${errors.email ? 'error' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <span className="sr-error">{errors.email}</span>}
          </div>

          {/* Mobile Number */}
          <div className="sr-form-group">
            <label className="sr-label">Mobile Number *</label>
            <div className="sr-input-wrapper">
              <Phone size={18} className="sr-input-icon" />
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className={`sr-input ${errors.mobileNumber ? 'error' : ''}`}
                placeholder="10-digit mobile number"
              />
            </div>
            {errors.mobileNumber && <span className="sr-error">{errors.mobileNumber}</span>}
          </div>

          {/* Stream Selection */}
          <div className="sr-form-group">
            <label className="sr-label">Stream</label>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleInputChange}
              className="sr-input sr-select"
            >
              <option>Science</option>
              <option>Commerce</option>
              <option>Arts</option>
            </select>
          </div>

          {/* Counselling Toggle */}
          <div className="sr-form-group">
            <label className="sr-label">Do you need counselling assistance? *</label>
            {errors.needsCounselling && <span className="sr-error">{errors.needsCounselling}</span>}
            <div className="sr-toggle-group">
              <motion.button
                type="button"
                className={`sr-toggle-btn ${formData.needsCounselling === true ? 'active yes' : ''}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, needsCounselling: true, counsellingType: '' }));
                  if (errors.needsCounselling) {
                    setErrors(prev => ({ ...prev, needsCounselling: '' }));
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yes
              </motion.button>
              <motion.button
                type="button"
                className={`sr-toggle-btn ${formData.needsCounselling === false ? 'active no' : ''}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, needsCounselling: false, counsellingType: '' }));
                  if (errors.needsCounselling) {
                    setErrors(prev => ({ ...prev, needsCounselling: '' }));
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                No
              </motion.button>
            </div>
          </div>

          {/* Counselling Type */}
          {formData.needsCounselling === true && (
            <motion.div 
              className="sr-form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="sr-label">Counselling Type *</label>
              <div className="sr-input-wrapper">
                <MessageSquare size={18} className="sr-input-icon" />
                <select
                  name="counsellingType"
                  value={formData.counsellingType}
                  onChange={handleInputChange}
                  className={`sr-input sr-select ${errors.counsellingType ? 'error' : ''}`}
                >
                  <option value="">Select counselling type...</option>
                  <option>Career Guidance</option>
                  <option>College Selection</option>
                  <option>Stream Selection</option>
                  <option>JEE/NEET Preparation</option>
                  <option>General Consultation</option>
                </select>
              </div>
              {errors.counsellingType && <span className="sr-error">{errors.counsellingType}</span>}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="sr-submit-btn"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Register Now
          </motion.button>
        </motion.form>

        {/* Benefits Grid */}
        <motion.div 
          className="sr-benefits-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="sr-benefit-card">
            <div className="sr-benefit-icon">🎯</div>
            <h3>Expert Guidance</h3>
            <p>Get personalized advice from experienced counsellors</p>
          </div>
          <div className="sr-benefit-card">
            <div className="sr-benefit-icon">⚡</div>
            <h3>Fast Process</h3>
            <p>Quick registration and faster response times</p>
          </div>
          <div className="sr-benefit-card">
            <div className="sr-benefit-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your information is safe and protected with us</p>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default StudentRegistration;
