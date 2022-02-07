const UserModel = require("../models/User");

const userRegistration = async userId => {
  const userExists = await UserModel.findOne({userId});

  if (!userExists) {
    await UserModel.create({ userId: userId });
    return true;
  }
  return false;
}

module.exports = {
  userRegistration,
}
