const userSchema = require('../models/User');
const UserSchema = require("../models/User");

const userRegistration = async userId => {
  const userExists = await UserSchema.findById(userId);
  if (!userExists) {
    await userSchema.create({ _id: userId });
    return true;
  }
  return false;
}

module.exports = {
  userRegistration,
}
