/**
 * StorageService class for managing data in browser's localStorage.
 */
class StorageService {
  /**
   * Stores data in localStorage.
   * @param {Object} data - Data to be stored.
   */
  storeData = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('token', JSON.stringify(data.token));
  };

  /**
   * Removes data from localStorage.
   */
  removeData = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  };

  /**
   * Retrieves token from localStorage.
   * @returns {string} Token value or empty string if not found.
   */
  getToken = () => {
    const token = window.localStorage.getItem('token');
    return JSON.parse(token) ?? '';
  };
}

/**
 * Singleton instance of StorageService.
 */
export const storageService = new StorageService();
