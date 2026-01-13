/**
 * Validation Utilities
 * 
 * Reusable validation functions for forms and data processing.
 * All functions follow the pattern: validate{Field}(value: string): boolean | string
 * Return true if valid, error message if invalid.
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateEmail(email: string): boolean | string {
  if (!email || email.trim() === '') {
    return 'Email é obrigatório';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  
  return true;
}

/**
 * Validate Brazilian CPF
 * @param {string} cpf - CPF to validate (with or without formatting)
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateCPF(cpf: string): boolean | string {
  if (!cpf || cpf.trim() === '') {
    return 'CPF é obrigatório';
  }
  
  // Remove formatting
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) {
    return 'CPF deve ter 11 dígitos';
  }
  
  // Check for known invalid CPFs (all same digit)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return 'CPF inválido';
  }
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(9))) {
    return 'CPF inválido';
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(10))) {
    return 'CPF inválido';
  }
  
  return true;
}

/**
 * Validate Brazilian CEP (postal code)
 * @param {string} cep - CEP to validate
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateCEP(cep: string): boolean | string {
  if (!cep || cep.trim() === '') {
    return 'CEP é obrigatório';
  }
  
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    return 'CEP deve ter 8 dígitos';
  }
  
  return true;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 6)
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validatePassword(password: string, minLength: number = 6): boolean | string {
  if (!password || password.trim() === '') {
    return 'Senha é obrigatória';
  }
  
  if (password.length < minLength) {
    return `Senha deve ter no mínimo ${minLength} caracteres`;
  }
  
  return true;
}

/**
 * Validate strong password (requires uppercase, lowercase, number, and special char)
 * @param {string} password - Password to validate
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateStrongPassword(password: string): boolean | string {
  const basicValidation = validatePassword(password, 8);
  if (basicValidation !== true) {
    return basicValidation;
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra minúscula';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra maiúscula';
  }
  
  if (!/\d/.test(password)) {
    return 'Senha deve conter pelo menos um número';
  }
  
  if (!/[@$!%*?&#]/.test(password)) {
    return 'Senha deve conter pelo menos um caractere especial (@$!%*?&#)';
  }
  
  return true;
}

/**
 * Validate required field (not empty)
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateRequired(value: string, fieldName: string): boolean | string {
  if (!value || value.trim() === '') {
    return `${fieldName} é obrigatório`;
  }
  
  return true;
}

/**
 * Validate phone number (Brazilian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validatePhone(phone: string): boolean | string {
  if (!phone || phone.trim() === '') {
    return 'Telefone é obrigatório';
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Brazilian phones: 10 digits (landline) or 11 digits (mobile)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return 'Telefone inválido';
  }
  
  return true;
}

/**
 * Validate numeric value within range
 * @param {string} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateNumberRange(value: string, min: number, max: number): boolean | string {
  if (!value || value.trim() === '') {
    return 'Valor é obrigatório';
  }
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return 'Valor deve ser numérico';
  }
  
  if (numValue < min || numValue > max) {
    return `Valor deve estar entre ${min} e ${max}`;
  }
  
  return true;
}

/**
 * Validate matricula (employee ID)
 * @param {string} matricula - Employee ID to validate
 * @returns {boolean | string} True if valid, error message if invalid
 */
export function validateMatricula(matricula: string): boolean | string {
  if (!matricula || matricula.trim() === '') {
    return 'Matrícula é obrigatória';
  }
  
  if (matricula.length < 3) {
    return 'Matrícula deve ter pelo menos 3 caracteres';
  }
  
  return true;
}

/**
 * Format CPF (add formatting)
 * @param {string} cpf - Unformatted CPF
 * @returns {string} Formatted CPF (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format CEP (add formatting)
 * @param {string} cep - Unformatted CEP
 * @returns {string} Formatted CEP (00000-000)
 */
export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Format phone (add formatting)
 * @param {string} phone - Unformatted phone
 * @returns {string} Formatted phone (00) 00000-0000 or (00) 0000-0000
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}
