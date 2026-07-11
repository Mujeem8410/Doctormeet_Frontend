export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

export const isValidPassword = (password = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

export const sanitizeOtp = (value = "") => value.replace(/\D/g, "").slice(0, 6);
