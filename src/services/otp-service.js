import { Service } from './service';

class OtpService extends Service {
  /**
   * Initializes the AuthService with its endpoints.
   * @constructor
   */
  constructor() {
    super('', 'Basic');
    this.endpoints = Object.freeze({
      otpvalidate: '/otp/verify'
    });
  }

  /**
   * Validates the OTP sent to the user.With Basic authentication
   * @param {*} data
   * @returns
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

export const otpService = new OtpService();
