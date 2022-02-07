const UserModel = require('../models/User');

async function changeUserLang (userId, value) {
  await UserModel.findOneAndUpdate({userId}, {lang: value});
}

async function getUserLanguage (userId) {
  const {lang} = await UserModel.findOne({userId})
  return lang;
}

const getLinkToUserVideo = async ctx => {
  const result = {
    ok: true,
    link: null,
    error: "",
  };

  try {
    result.link = await ctx.tg.getFileLink(ctx.update.message.video.file_id);
  } catch (e) {
    const {ok, description} = e.response;
    result.ok = ok;
    result.error = description;
  }

  return result;
}

module.exports = {
  changeUserLang,
  getUserLanguage,
  getLinkToUserVideo,
}
