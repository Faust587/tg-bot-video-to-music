const UserSchema = require("../models/User");

const userRegistration = async userId => {
  const userExists = await UserSchema.findById(userId);
  if (!userExists) {
    await UserSchema.create({ _id: userId });
    return true;
  }
  return false;
}

module.exports = {
  userRegistration,
}
