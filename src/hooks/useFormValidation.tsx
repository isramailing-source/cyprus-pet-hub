import { useState, useCallback } from 'react';
import { validateAdForm, ValidationResult } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export interface FieldValidation {
  isValid: boolean;
  errors: string[];
  touched: boolean;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
  fieldValidations: Record<string, FieldValidation>;
}

export interface UseFormValidationOptions {
  showErrorsOnChange?: boolean;
  showErrorsOnBlur?: boolean;
  debounceMs?: number;
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationFn: (data: T) => { isValid: boolean; errors: Record<string, string[]>; sanitized: Record<string, string> },
  options: UseFormValidationOptions = {}
) {
  const { toast } = useToast();
  const { 
    showErrorsOnChange = false, 
    showErrorsOnBlur = true, 
    debounceMs = 300 
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sanitizedData, setSanitizedData] = useState<Record<string, string>>({});

  const validateField = useCallback((fieldName: keyof T, value: any) => {
    const tempData = { ...data, [fieldName]: value };
    const validation = validationFn(tempData);
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: validation.errors[fieldName as string] || []
    }));
    
    setSanitizedData(prev => ({
      ...prev,
      [fieldName as string]: validation.sanitized[fieldName as string] || value
    }));
    
    return validation.errors[fieldName as string] || [];
  }, [data, validationFn]);

  const validateAllFields = useCallback(() => {
    const validation = validationFn(data);
    setFieldErrors(validation.errors);
    setSanitizedData(validation.sanitized);
    return validation;
  }, [data, validationFn]);

  const updateField = useCallback((fieldName: keyof T, value: any) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    if (showErrorsOnChange || touched[fieldName as string]) {
      setTimeout(() => {
        validateField(fieldName, value);
      }, debounceMs);
    }
  }, [validateField, showErrorsOnChange, touched, debounceMs]);

  const handleBlur = useCallback((fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName as string]: true }));
    
    if (showErrorsOnBlur) {
      validateField(fieldName, data[fieldName]);
    }
  }, [data, validateField, showErrorsOnBlur]);

  const getFieldValidation = useCallback((fieldName: keyof T): FieldValidation => {
    const errors = fieldErrors[fieldName as string] || [];
    const isTouched = touched[fieldName as string] || false;
    
    return {
      isValid: errors.length === 0,
      errors: (showErrorsOnChange || isTouched) ? errors : [],
      touched: isTouched
    };
  }, [fieldErrors, touched, showErrorsOnChange]);

  const getFormValidation = useCallback((): FormValidation => {
    const fieldValidations: Record<string, FieldValidation> = {};
    
    Object.keys(data).forEach(key => {
      fieldValidations[key] = getFieldValidation(key);
    });
    
    const hasErrors = Object.values(fieldErrors).some(errors => errors.length > 0);
    
    return {
      isValid: !hasErrors,
      errors: fieldErrors,
      fieldValidations
    };
  }, [data, fieldErrors, getFieldValidation]);

  const handleSubmit = useCallback(async (
    submitFn: (sanitizedData: Record<string, string>) => Promise<void>,
    options: { showSuccessToast?: boolean; successMessage?: string } = {}
  ) => {
    setIsSubmitting(true);
    
    try {
      const validation = validateAllFields();
      
      if (!validation.isValid) {
        // Mark all fields as touched to show errors
        const allTouched: Record<string, boolean> = {};
        Object.keys(data).forEach(key => {
          allTouched[key] = true;
        });
        setTouched(allTouched);
        
        // Show first error in toast
        const firstError = Object.values(validation.errors).flat()[0];
        if (firstError) {
          toast({
            title: "Validation Error",
            description: firstError,
            variant: "destructive",
          });
        }
        return;
      }
      
      await submitFn(validation.sanitized);
      
      if (options.showSuccessToast !== false) {
        toast({
          title: "Success!",
          description: options.successMessage || "Form submitted successfully.",
        });
      }
      
      // Reset form
      setData(initialData);
      setTouched({});
      setFieldErrors({});
      setSanitizedData({});
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [data, initialData, validateAllFields, toast]);

  const reset = useCallback(() => {
    setData(initialData);
    setTouched({});
    setFieldErrors({});
    setSanitizedData({});
    setIsSubmitting(false);
  }, [initialData]);

  const setFieldError = useCallback((fieldName: keyof T, errors: string[]) => {
    setFieldErrors(prev => ({ ...prev, [fieldName as string]: errors }));
  }, []);

  const clearFieldError = useCallback((fieldName: keyof T) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName as string];
      return newErrors;
    });
  }, []);

  return {
    // Form data
    data,
    sanitizedData,
    
    // Field operations
    updateField,
    handleBlur,
    
    // Validation
    getFieldValidation,
    getFormValidation,
    validateField,
    validateAllFields,
    
    // Field error management
    setFieldError,
    clearFieldError,
    
    // Form operations
    handleSubmit,
    reset,
    isSubmitting,
    
    // Utility
    hasErrors: Object.keys(fieldErrors).length > 0
  };
}

// Specialized hook for ad form validation
export function useAdFormValidation(initialData = {
  title: '',
  description: '',
  price: '',
  location: '',
  breed: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
}) {
  return useFormValidation(initialData, validateAdForm, {
    showErrorsOnBlur: true,
    debounceMs: 500
  });
}
