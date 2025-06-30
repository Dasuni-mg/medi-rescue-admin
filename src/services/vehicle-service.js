import { Service } from './service';

class VehicleService extends Service {
  /**
   * @class VehicleService
   * @extends Service
   * @description Service class responsible for making API calls to the /vehicles endpoint
   * @param {Object} api - The axios instance with the base URL and timeout configured
   */
  constructor() {
    /**
     * Call the parent class constructor with the endpoint URL
     * @param {String} endpoint - The endpoint URL
     */
    super('vehicle');
  }

  /**
   * Creates a new vehicle
   * @param {Object} request - The request object that is sent to the API
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async createVehicle(request) {
    try {
      const response = await this.api.post('', request);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Updates a vehicle by its ID
   * @param {Object} request - The request object that is sent to the API
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async updateVehicle(request) {
    try {
      const response = await this.api.put(`/${request.id}`, request);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Fetches a vehicle by its ID
   * @param {string} id - The ID of the vehicle to fetch
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async getVehicleById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Enables or disables a vehicle by its ID
   * @param {boolean} status - The status to set the vehicle to (true = enabled, false = disabled)
   * @param {string} id - The ID of the vehicle to enable or disable
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async putVehiclEnableAndDisableById(status, id) {
    try {
      // Create a URLSearchParams object to hold the status parameter
      const params = new URLSearchParams();
      params.append('status', status);

      // Make the PUT request to the API
      const response = await this.api.put(`/status/${id}`, null, {
        params: { status: status }
      });

      // Return the response from the API
      return response.data;
    } catch (error) {
      // Throw the error if the API throws one
      throw error.response.data;
    }
  }

  /**
   * Unassigns a vehicle from an organization
   * @param {string} vehicleId - The ID of the vehicle to unassign
   * @param {string} organizationId - The ID of the organization to unassign the vehicle from
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async unassignVehicleById(vehicleId, organizationId) {
    try {
      // Make the DELETE request to the API
      const response = await this.api.delete(`/${vehicleId}/unassign/${organizationId}`);

      // Return the response from the API
      return response.data;
    } catch (error) {
      // Throw the error if the API throws one
      throw error.response.data;
    }
  }

  /**
   * Searches for vehicles using the API
   * @param {string} textOrganization - The text to filter the search results by organization
   * @param {string} textNumber - The text to filter the search results by vehicle number
   * @param {string} textGroup - The text to filter the search results by group
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async searchVehicles(textOrganization, textNumber, textGroup, newPageIndex = 0, pageSize = 10000, name = 'createdAt', orderBy = 'desc') {
    try {
      // Create a URLSearchParams object to hold the parameters
      const params = new URLSearchParams();

      // Set the parameters for the API call
      params.append('name', name);
      params.append('offset', newPageIndex);
      params.append('limit', pageSize);
      params.append('sort', orderBy);
      params.append('textOrganization', textOrganization);
      params.append('textNumber', textNumber);
      params.append('textGroup', textGroup);

      // Make the GET request to the API
      const response = await this.api.get('/list/search', {
        params: params
      });
      // Return the response from the API
      return response.data;
    } catch (error) {
      // Throw the error if the API throws one
      throw error.response.data;
    }
  }

  /**
   * Deletes a vehicle by ID
   * @param {number} id - The ID of the vehicle to delete
   * @returns {Promise<Object>} - The response from the API
   * @throws {Error} - If the API throws an error
   */
  async deleteVehicleById(id) {
    const params = new URLSearchParams();
    try {
      // Make the DELETE request to the API
      const response = await this.api.delete(`/${id}`, {
        params: params
      });
      // Return the response from the API
      return response.data;
    } catch (error) {
      // Throw the error if the API throws one
      throw error.response.data;
    }
  }
}

export const vehicleService = new VehicleService();
