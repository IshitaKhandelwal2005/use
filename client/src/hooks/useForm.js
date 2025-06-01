import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import config from '../config';

const useForm = (initialState, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Debounced validation
  const validateField = useCallback(
    debounce((fieldName, value) => {
      if (validate) {
        const newErrors = validate({ [fieldName]: value });
        setErrors(prev => ({
          ...prev,
          [fieldName]: newErrors[fieldName]
        }));
      }
    }, config.ui.form.debounce),
    [validate]
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const fieldValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    
    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Only validate if the field has been touched
    if (touched[name]) {
      validateField(name, fieldValue);
    }
  };

  // Handle blur event
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field
    if (validate) {
      const newErrors = validate({ [name]: value });
      setErrors(prev => ({
        ...prev,
        [name]: newErrors[name]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    // Validate all fields
    if (validate) {
      const formErrors = validate(values);
      setErrors(formErrors);
      
      if (Object.keys(formErrors).length > 0) {
        return;
      }
    }

    // Submit form if validation passes
    setIsSubmitting(true);
    Promise.resolve(onSubmit(values))
      .catch(error => {
        // Handle form submission errors
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Form submission error:', error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Reset form
  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set field value manually
  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set field error manually
  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 || 
    Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    setTouched,
  };
};

export default useForm;
