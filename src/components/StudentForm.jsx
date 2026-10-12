import { useState, useEffect, useRef } from 'react';

// Custom Dropdown Component - NO SCROLLBAR/SLIDER
const CustomSelect = ({ options, value, onChange, placeholder, error, disabled, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(opt => opt === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 text-left border-2 rounded-xl
          flex justify-between items-center backdrop-blur-sm
          focus:outline-none focus:ring-4 focus:ring-white/10 focus:border-white/40
          transition-all duration-200 cursor-pointer
          ${error ? 'border-red-500 bg-red-950/30 text-red-200' : 'border-white/20 bg-white/10 text-white'}
          ${disabled ? 'bg-white/5 cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        disabled={disabled}
      >
        <span className={`truncate ${!selectedOption ? 'uppercase font-bold text-white/40' : 'text-white'}`}>
          {selectedOption || placeholder}
        </span>
        <svg className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto scrollbar-none">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-4 py-3 hover:bg-white/20 cursor-pointer text-white uppercase font-bold transition-colors truncate"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main StudentForm Component - BALANCED HEIGHT & NO-OVERLAP BUTTONS
function StudentForm({ onSubmit, editingStudent, students, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    department: '',
    year: '',
    email: '',
    phone: '',
    dob: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
      setErrors({});
      setTouched({});
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const genders = ['Male', 'Female'];

  // Validations
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateRollNumber = (roll) => /^[A-Za-z0-9-]+$/.test(roll);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateDOB = (dob) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([0-9]{4})$/;
    if (!dateRegex.test(dob)) return false;
    const [day, month, year] = dob.split('-').map(Number);
    const dobDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
    return age >= 17;
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedRoll = formData.rollNumber.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedDob = formData.dob.trim();

    if (!trimmedName) newErrors.fullName = 'Full name is required';
    else if (trimmedName.length < 3) newErrors.fullName = 'Minimum 3 characters';
    else if (trimmedName.length > 50) newErrors.fullName = 'Maximum 50 characters';

    if (!trimmedRoll) newErrors.rollNumber = 'Roll number is required';
    else if (!validateRollNumber(trimmedRoll)) newErrors.rollNumber = 'Only letters, numbers, hyphens';
    else {
      const isDuplicate = students.some(
        s => s.rollNumber.toLowerCase() === trimmedRoll.toLowerCase() && s.id !== formData.id
      );
      if (isDuplicate) newErrors.rollNumber = 'Roll number already exists';
    }

    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.year) newErrors.year = 'Please select a year';

    if (!trimmedEmail) newErrors.email = 'Email is required';
    else if (!validateEmail(trimmedEmail)) newErrors.email = 'Invalid email format';
    else {
      const isEmailDuplicate = students.some(
        s => s.email.toLowerCase() === trimmedEmail.toLowerCase() && s.id !== formData.id
      );
      if (isEmailDuplicate) newErrors.email = 'Email already registered';
    }

    if (!trimmedPhone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(trimmedPhone)) newErrors.phone = 'Enter 10-digit number';

    if (!trimmedDob) newErrors.dob = 'Date of birth is required';
    else if (!validateDOB(trimmedDob)) newErrors.dob = 'Invalid format (DD-MM-YYYY) or age < 17';

    if (!formData.gender) newErrors.gender = 'Please select gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        resetForm();
        if (editingStudent && onCancel) onCancel();
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '', rollNumber: '', department: '', year: '', email: '', phone: '', dob: '', gender: ''
    });
    setErrors({});
    setTouched({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (['rollNumber', 'email', 'phone', 'dob'].includes(name)) validateForm();
  };

  const showError = (field) => touched[field] && errors[field];

  const inputClass = (field) => `
    w-full px-4 py-3 text-white bg-white/10 border-2 rounded-xl backdrop-blur-sm
    placeholder:uppercase placeholder:font-bold placeholder:text-white/40
    focus:outline-none focus:ring-4 focus:ring-white/10 focus:border-white/40
    transition-all duration-200
    ${showError(field) ? 'border-red-500 bg-red-950/30' : 'border-white/20'}
  `;

  // ERROR COMPONENT: Clear spacing under the input field
  const ErrorMessage = ({ message }) => (
    <div className="absolute left-1 mt-3 text-red-400 text-[12px] font-semibold tracking-wider uppercase flex items-center gap-1.5 animate-slideDown z-10 bg-neutral-900 px-4 py-1.5 rounded-lg shadow-md border border-red-900/50 whitespace-nowrap">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );

  // Checking if bottom fields have errors to dynamic push buttons down
  const hasBottomRowErrors = showError('dob') || showError('gender');

  return (
    <div className="w-full max-w-none h-full text-left border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-md shadow-2xl flex flex-col justify-between">
      
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight drop-shadow-md whitespace-nowrap">
            {editingStudent ? '✏️ EDIT STUDENT' : '➕ ADD STUDENT'}
          </h2>
          {editingStudent && (
            <button onClick={onCancel} className="text-gray-300 hover:text-white text-xl transition ml-4 cursor-pointer">
              ✕
            </button>
          )}
        </div>

        {errors.submit && (
          <div className="w-full mb-5 p-3 bg-red-950/50 border-l-4 border-red-600 text-red-200 rounded-md text-xs font-black tracking-widest uppercase backdrop-blur-sm">
            ⚠️ {errors.submit}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full flex-1 flex flex-col justify-between items-start">
        
        {/* 🔥 INCREASED ROW GAP (gap-y-14) so errors don't stick or overlap with the inputs below them */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-14 items-start justify-items-start w-full transition-all duration-300 ${hasBottomRowErrors ? 'mb-16' : 'mb-8'}`}>
          
          {/* Full Name */}
          <div className="w-full relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('fullName')}
              placeholder="FULL NAME"
              maxLength={50}
              disabled={isSubmitting}
            />
            {showError('fullName') && <ErrorMessage message={errors.fullName} />}
          </div>

          {/* Roll Number */}
          <div className="w-full relative">
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('rollNumber')}
              placeholder="ROLL NUMBER"
              disabled={isSubmitting}
            />
            {showError('rollNumber') && <ErrorMessage message={errors.rollNumber} />}
          </div>

          {/* Department */}
          <div className="w-full relative">
            <CustomSelect
              name="department"
              options={departments}
              value={formData.department}
              onChange={handleChange}
              placeholder="SELECT DEPARTMENT"
              error={showError('department')}
              disabled={isSubmitting}
            />
            {showError('department') && <ErrorMessage message={errors.department} />}
          </div>

          {/* Year */}
          <div className="w-full relative">
            <CustomSelect
              name="year"
              options={years}
              value={formData.year}
              onChange={handleChange}
              placeholder="SELECT YEAR"
              error={showError('year')}
              disabled={isSubmitting}
            />
            {showError('year') && <ErrorMessage message={errors.year} />}
          </div>

          {/* Email */}
          <div className="w-full relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('email')}
              placeholder="EMAIL ADDRESS"
              disabled={isSubmitting}
            />
            {showError('email') && <ErrorMessage message={errors.email} />}
          </div>

          {/* Phone */}
          <div className="w-full relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('phone')}
              placeholder="PHONE NUMBER (10 DIGITS)"
              maxLength="10"
              disabled={isSubmitting}
            />
            {showError('phone') && <ErrorMessage message={errors.phone} />}
          </div>

          {/* DOB */}
          <div className="w-full relative">
            <input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('dob')}
              placeholder="ENTER DOB - DD-MM-YYYY"
              disabled={isSubmitting}
            />
            {showError('dob') && <ErrorMessage message={errors.dob} />}
          </div>

          {/* Gender */}
          <div className="w-full relative">
            <CustomSelect
              name="gender"
              options={genders}
              value={formData.gender}
              onChange={handleChange}
              placeholder="SELECT GENDER"
              error={showError('gender')}
              disabled={isSubmitting}
            />
            {showError('gender') && <ErrorMessage message={errors.gender} />}
          </div>

        </div>

        {/* Action Buttons - LOCKED AT BOTTOM WITH SMART MARGIN */}
        <div className="flex gap-3 w-full sm:w-1/2 min-w-[280px] mt-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-200 border text-white backdrop-blur-sm cursor-pointer ${
              isSubmitting
                ? 'bg-neutral-800 border-neutral-700 text-white/40 cursor-not-allowed'
                : 'bg-white/10 border-white/20 hover:bg-white hover:text-black hover:border-white hover:shadow-lg active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {editingStudent ? 'UPDATING...' : 'ADDING...'}
              </span>
            ) : (
              editingStudent ? 'UPDATE' : 'ADD'
            )}
          </button>
          
          {!editingStudent && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-white hover:text-black hover:border-white transition-all duration-200 backdrop-blur-sm cursor-pointer"
              disabled={isSubmitting}
            >
              CLEAR
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default StudentForm;