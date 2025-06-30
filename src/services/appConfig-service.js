class AppConfigService {
  /**
   * Initializes the AppConfigService with no values for the authSvcUrl or
   * apiGatewayUrl.
   * @constructor
   */
  constructor() {
    this.authSvcUrl = null;
    this.apiGatewayUrl = null;
    this.s3BucketUrl = null;
  }

  setProdEnv = (config) => {
    this.authSvcUrl = 'https://apigw-smtadm.mediwave.io/api';
    this.apiGatewayUrl = 'https://apigw-smtadm.mediwave.io/api';
    this.s3BucketUrl = 'https://s3.us-east-1.amazonaws.com/gp-dev-public/';
  };

  setDevEnv = () => {
    this.authSvcUrl = 'https://apigw-smtadm.mediwave.io/api';
    this.apiGatewayUrl = 'https://apigw-smtadm.mediwave.io/api';
    this.s3BucketUrl = 'https://s3.us-east-1.amazonaws.com/gp-dev-public/';
  };

  /**
   * Initializes the AppConfigService by fetching the configuration from
   * /config.json in production mode, and setting the environment variables.
   * In development mode, sets the environment variables based on the
   * REACT_APP environment variables.
   * @throws {Error} If the configuration could not be fetched.
   * @returns {Promise<void>}
   */
  async init() {
    // If in production mode, fetch the configuration from /config.json
    if (process.env.NODE_ENV === 'production') {
      const response = await fetch('/config.json');

      // If the response was not successful, throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }

      // Get the configuration from the response JSON
      const config = await response.json();

      // Set the environment variables to the configuration values
      this.setProdEnv(config);
    } else {
      // If in development mode, set the environment variables based on the
      // REACT_APP environment variables
      this.setDevEnv();
    }
  }
}

export default new AppConfigService();
