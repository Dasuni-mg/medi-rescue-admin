/**
 * Password validator for login pages
 */
import value from 'assets/scss/_themes-vars.module.scss';

/**
 * Checks if the given string contains a number.
 * @param {string} number
 * @returns {boolean} true if the string contains a number
 */
const hasNumber = (number) => new RegExp(/\d/).test(number);

/**
 * Checks if the given string contains a mix of small and capital letters.
 * @param {string} password - password to check
 * @returns {boolean} true if the string contains a mix of small and capital letters
 */
const hasMixed = (password) => new RegExp(/[a-z]/).test(password) && new RegExp(/[A-Z]/).test(password);

/**
 * Checks if the given string contains special characters.
 * @param {string} password - password to check
 * @returns {boolean} true if the string contains special characters
 */

/**
 * Checks if the given string contains special characters.
 * @param {string} password - password to check
 * @returns {boolean} true if the string contains special characters
 */
const hasSpecial = (password) => new RegExp(/[!#@$%^&*)(+=._-]/).test(password);

// set color based on password strength
export const strengthColor = (count) => {
  if (count < 2) return { label: 'Poor', color: value.errorMain };
  if (count < 3) return { label: 'Weak', color: value.warningDark };
  if (count < 4) return { label: 'Normal', color: value.orangeMain };
  if (count < 5) return { label: 'Good', color: value.successMain };
  if (count < 6) return { label: 'Strong', color: value.successDark };
  return { label: 'Poor', color: value.errorMain };
};

// password strength indicator
export const strengthIndicator = (number) => {
  let strengths = 0;
  if (number.length > 5) strengths += 1;
  if (number.length > 7) strengths += 1;
  if (hasNumber(number)) strengths += 1;
  if (hasSpecial(number)) strengths += 1;
  if (hasMixed(number)) strengths += 1;
  return strengths;
};
