import { Service } from './service';

class AuthService extends Service {
  /**
   * Initializes the AuthService with its endpoints.
   * @constructor
   */
  constructor() {
    super('user');
    this.endpoints = Object.freeze({
      authenticate: '/signin',
      changePassword: '/changePassword',
      sendOTP: '/sendOTP',
      otpvalidate: '/otp/verify',
      forgotPassword: '/forgotPassword'
    });
  }

  /**
   * Authenticate user with provided credentials.
   * @param {Object} userData - The user data containing credentials.
   * @returns {Promise<Object>} The response data from the authentication API.
   * @throws Will throw an error if the authentication fails.
   */
  async authenticate(userData) {
    try {
      const response = await this.api.post(this.endpoints.authenticate, userData);
      return response.data;
    } catch (error) {
      // Handle error and throw the response data
      throw error.response.data;
    }
  }

  /**
   * Change the password for the currently logged in user.
   * @param {Object} data - The data containing the current and new passwords.
   * @returns {Promise<Object>} The response data from the change password API.
   * @throws Will throw an error if the change password fails.
   */
  async changePassword(data) {
    try {
      const response = await this.api.post(this.endpoints.changePassword, data);
      return response;
    } catch (error) {
      // Handle error and throw the response data
      throw error.response.data;
    }
  }
  /**
   * Sends an OTP to the user's email for password reset.
   * @param {*} data
   * @returns email
   */
  async forgotPwd(data) {
    try {
      const response = await this.api.post(this.endpoints.sendOTP, data);
      return response.data;
    } catch (error) {
      // Handle error and throw the response data
      throw error.response.data;
    }
  }
  /**
   *  password reset
   * @param {*} data
   * @returns
   */
  async forgotPassword(data) {
    try {
      const response = await this.api.post(this.endpoints.forgotPassword, data);
      return response.data;
    } catch (error) {
      // Handle error and throw the response data
      throw error.response.data;
    }
  }
  /**
   * Validates the OTP sent to the user.
   * @param {*} data
   * @returns tocken
   */
  async otpvalidation(data) {
    try {
      const response = await this.api.put(this.endpoints.otpvalidate, data);
      return response.data;
    } catch (error) {
      // Handle error and throw the response data
      throw error.response.data;
    }
  }
}

export const authService = new AuthService();
