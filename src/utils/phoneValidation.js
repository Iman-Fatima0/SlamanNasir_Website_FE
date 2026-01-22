/**
 * Phone Number Validation Utility
 * Validates phone numbers with 11-15 digits (accepts formatted input)
 */

/**
 * Validates a phone number
 * Accepts formatted phone numbers (with spaces, dashes, plus signs, etc.)
 * Validates that the phone number contains 11-15 digits when stripped of non-digits
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string, normalized: string }
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required',
      normalized: '',
    };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if we have 11-15 digits
  if (digitsOnly.length < 11 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Phone number must contain 11 to 15 digits',
      normalized: digitsOnly,
    };
  }

  return {
    isValid: true,
    error: '',
    normalized: digitsOnly,
  };
};

/**
 * Formats a phone number for display
 * @param {string} phone - Phone number (digits only or formatted)
 * @returns {string} - Formatted phone number
 */
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  // If it's already formatted, return as is
  // If it's digits only, format it
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length === 0) return '';
  
  // Format based on length
  if (digitsOnly.length === 11) {
    // Format: +1 (234) 567-8901
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length === 12) {
    // Format: +12 345 678 9012
    return `+${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 5)} ${digitsOnly.slice(5, 8)} ${digitsOnly.slice(8)}`;
  } else {
    // For other lengths, just add spaces every 3-4 digits
    return digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly;
  }
};

/**
 * Normalizes phone number (removes all non-digits)
 * @param {string} phone - Phone number to normalize
 * @returns {string} - Digits only
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};
