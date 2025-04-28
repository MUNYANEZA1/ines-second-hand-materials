// src/utils/validators.js
export const validateEmail = (email) => {
  // Basic email validation regex
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validateInesEmail = (email) => {
  // Validate that the email is from INES domain (@ines.ac.rw)
  const regex = /^[a-zA-Z0-9._%+-]+@ines\.ac\.rw$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Password should be at least 8 characters with at least one number
  return password.length >= 8 && /\d/.test(password);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Validate Rwandan phone numbers
  // Format: +250xxxxxxxxx or 07xxxxxxxx or 25078xxxxxxx
  const regex = /^(\+?250|0)7[0-9]{8}$/;
  return regex.test(phoneNumber);
};

export const validateItemPrice = (price) => {
  return !isNaN(price) && parseFloat(price) >= 0;
};

export const validateRequiredField = (value) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

export const validateImage = (file) => {
  // Check if file exists
  if (!file) return true;

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return false;
  }

  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
};

