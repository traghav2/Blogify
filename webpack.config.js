const path = require('path');

module.exports = {
  // The entry point file described above
  entry: './server.js',
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};