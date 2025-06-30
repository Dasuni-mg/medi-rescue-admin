import { Service } from './service';

class CountryService extends Service {
  constructor() {
    super('country');
  }

  async getCountry() {
    const params = new URLSearchParams();
    try {
      const response = await this.api.get('', {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export const countryService = new CountryService();
