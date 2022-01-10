const connect = () => {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.data_base_connection_uri, null);
}

module.exports = {connect};
