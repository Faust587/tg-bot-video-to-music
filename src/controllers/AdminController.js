const UserSchema = require("../models/User");
const {ADMIN} = require('../constants/Roles');

const getAdminList = async () => {
  const response = {
    ok: false,
    error: null,
    result: null,
  }

  try {
    response.result = await UserSchema.find({role: ADMIN});
    response.ok = true;
    return response;
  } catch (e) {
    response.error = e;
    return response;
  }
};

module.exports = {
  getAdminList,
};
