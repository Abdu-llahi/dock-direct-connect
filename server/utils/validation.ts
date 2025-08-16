import validator from 'validator';

// Enterprise-grade validation utilities
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z\s\-']+$/.test(name.trim());
};

export const validatePhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

export const sanitizeInput = (input: string): string => {
  return validator.escape(input.trim());
};

export const validateLoadData = (loadData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!loadData.originAddress || loadData.originAddress.trim().length < 5) {
    errors.push('Origin address is required and must be at least 5 characters');
  }
  
  if (!loadData.destinationAddress || loadData.destinationAddress.trim().length < 5) {
    errors.push('Destination address is required and must be at least 5 characters');
  }
  
  if (!loadData.palletCount || loadData.palletCount < 1 || loadData.palletCount > 26) {
    errors.push('Pallet count must be between 1 and 26');
  }
  
  if (!loadData.weight || loadData.weight.trim().length === 0) {
    errors.push('Weight is required');
  }
  
  if (!loadData.rate || loadData.rate < 0 || loadData.rate > 50000) {
    errors.push('Rate must be between $0 and $50,000');
  }
  
  if (!loadData.loadType || !['dry', 'refrigerated', 'hazmat', 'flatbed', 'step_deck'].includes(loadData.loadType)) {
    errors.push('Valid load type is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBidData = (bidData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!bidData.bidAmount || bidData.bidAmount < 0 || bidData.bidAmount > 50000) {
    errors.push('Bid amount must be between $0 and $50,000');
  }
  
  if (bidData.message && bidData.message.length > 500) {
    errors.push('Bid message must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};