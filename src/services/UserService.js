const UserModel = require('../models/User');

async function changeUserLang (userId, value) {
  await UserModel.findByIdAndUpdate(userId, {lang: value});
}

async function getUserLanguage (userId) {
  const { lang } = await UserModel.findById(userId);
  return lang;
}

const getUrlToUserVideo = async ctx => {
  return await ctx.tg.getFileLink(ctx.update.message.video.file_id);
}

module.exports = {
  changeUserLang,
  getUserLanguage,
  getUrlToUserVideo,
}
