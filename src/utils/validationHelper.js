const validator = require("validator");
const validateSignupData = (data) => {
  const { email, password } = data;
  try {
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Weak password");
    } else {
      return { isValid: true, error: null };
    }
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

module.exports = { validateSignupData };
