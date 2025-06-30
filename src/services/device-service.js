import { Service } from './service';

class DeviceService extends Service {
  /**
   * Constructor for the DeviceService class.
   *
   * @constructor
   * @param {string} [resource='device'] - The resource name for the API endpoint.
   * @throws {Error} If the resource name is not specified.
   */
  constructor() {
    super('device');
  }

  /**
   * Fetches all devices from the API.
   *
   * @returns {Promise<Array<Object>>} A promise that resolves with a list of device objects.
   * @throws {Error} If the API call fails, an error is thrown with the response data.
   */
  async getDevices() {
    try {
      const response = await this.api.get('');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Searches for devices using the API
   * @param {{sortBy: string, notAssigned: string, vehicleNumber: string, serialNumber: string, offset: number, limit: number, tenantId: string}} options - The options to search for devices
   * @returns {Promise<Array<Object>>} A promise that resolves with a list of device objects
   * @throws {Error} If the API call fails, an error is thrown with the response data
   */
  async searchDevices(sort, notAssigned, offset, limit, vehicleNumber, serialNumber, tenantId) {
    try {
      const params = new URLSearchParams();
      if (tenantId) {
        params.append('tenantId', tenantId);
      }
      params.append('page', offset);
      params.append('size', limit);
      params.append('sortBy', sort);
      params.append('notAssigned', notAssigned);
      params.append('vehicleNumber', vehicleNumber);
      params.append('serialNumber', serialNumber);

      const response = await this.api.get('', {
        params: params
      });
      return response.status === 200 ? response.data || [] : [];
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Creates a new device using the API
   * @param {Object} deviceData - The device data to create the device with
   * @returns {Promise<Object>} A promise that resolves with the created device object
   * @throws {Error} If the API call fails, an error is thrown with the response data
   */
  async createDevice(deviceData) {
    try {
      const response = await this.api.post('', deviceData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Unassigns a device from a vehicle using the API
   * @param {string} deviceId - The ID of the device to unassign
   * @param {string} vehicleId - The ID of the vehicle to unassign the device from
   * @returns {Promise<Object>} A promise that resolves with the unassigned device object
   * @throws {Error} If the API call fails, an error is thrown with the response data
   */
  async unassignDevice(deviceId, vehicleId) {
    try {
      const response = await this.api.put(`/${deviceId}/unassign/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Deletes a device using the API.
   *
   * @param {string} deviceId - The ID of the device to delete.
   * @returns {Promise<Object>} A promise that resolves with the response data of the deleted device.
   * @throws {Error} If the API call fails, an error is thrown with the response data.
   */
  async deleteDevice(deviceId) {
    try {
      const response = await this.api.delete(`/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Fetches a device by its ID using the API
   * @param {string} deviceId - The ID of the device to fetch
   * @returns {Promise<Object>} A promise that resolves with the fetched device object
   * @throws {Error} If the API call fails, an error is thrown with the response data
   */
  async getDeviceById(deviceId) {
    try {
      const response = await this.api.get(`/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Updates a device by its ID using the API.
   *
   * @param {string} deviceId - The ID of the device to update.
   * @param {Object} deviceData - The data to update the device with.
   * @returns {Promise<Object>} A promise that resolves with the updated device object.
   * @throws {Error} If the API call fails, an error is thrown with the response data.
   */
  async updateDevice(deviceId, deviceData) {
    try {
      const response = await this.api.put(`/${deviceId}`, deviceData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Enables or disables a device by its ID using the API
   * @param {string} deviceId - The ID of the device to enable or disable
   * @param {boolean} enable - Whether to enable or disable the device
   * @returns {Promise<Object>} A promise that resolves with the updated device object
   * @throws {Error} If the API call fails, an error is thrown with the response data
   */
  async enableOrDisableDevice(deviceId, enable) {
    try {
      const status = { status: enable };
      const response = await this.api.put(`/status/${deviceId}`, status);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  /**
   * Unassigns a device from a vehicle using the API.
   * @param {string} deviceId - The ID of the device to unassign.
   * @param {string} vehicleId - The ID of the vehicle to unassign the device from.
   * @returns {Promise<Object>} A promise that resolves with the response data.
   * @throws {Error} If the API call fails, an error is thrown with the response data.
   */
  async unassignDeviceToVehicle(deviceId, vehicleId) {
    try {
      const response = await this.api.put(`/${deviceId}/unassign/${vehicleId}`, '');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export default new DeviceService();
