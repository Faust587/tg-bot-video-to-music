const UserModel = require('../models/User');

async function changeUserLang (userId, value) {
  await UserModel.findByIdAndUpdate(userId, {lang: value});
}

async function getUserLanguage (userId) {
  const { lang } = await UserModel.findById(userId);
  return lang;
}

module.exports = {
  changeUserLang,
  getUserLanguage,
}
