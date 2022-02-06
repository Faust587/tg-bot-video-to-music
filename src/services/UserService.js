const UserModel = require('../models/User');

async function changeUserLang (userId, value) {
  await UserModel.findByIdAndUpdate(userId, {lang: value});
}

async function getUserLanguage (userId) {
  const { lang } = await UserModel.findById(userId);
  return lang;
}

const getUrlToUserVideo = async ctx => {
  const result = {
    ok: true,
    link: null,
    error: "",
  };
  try {
    const fileLink = await ctx.tg.getFileLink(ctx.update.message.video.file_id);
    result.link = fileLink;
  } catch (e) {
    const errorText = e.response.description;
    result.ok = false;
    result.error = errorText;
  }

  return result;
}

module.exports = {
  changeUserLang,
  getUserLanguage,
  getUrlToUserVideo,
}
