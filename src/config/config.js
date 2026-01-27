const environment = process.env.REACT_APP_ENV || 'development';

const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/admin',
    imageBaseUrl: process.env.REACT_APP_IMAGE_URL || 'http://localhost:4000/api/public',
    fileDownloadUrl: process.env.REACT_APP_FILES_URL || 'http://localhost:4000',

    debug: true
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.nalsuvai.com/api/admin',
    imageBaseUrl: process.env.REACT_APP_IMAGE_URL || 'https://api.nalsuvai.com/api/public',
    fileDownloadUrl: process.env.REACT_APP_FILES_URL || 'https://api.nalsuvai.com/api',
    debug: false
  }
};

export default config[environment];

// Log config for debugging
if (config[environment].debug) {
  console.log('Environment:', environment);
  console.log('Config:', config[environment]);
}
