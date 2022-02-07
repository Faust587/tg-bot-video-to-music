const UserService = require('../services/UserService');
const ValidationService = require('../services/ValidationService');
const ReportErrorsService = require('../services/ReportErrorsService');
const ConvertingService = require('../services/ConvertingService');
const {VIDEO_FOLDER, MUSIC_FOLDER} = require("../constants/Path");
const fs = require("fs");

const convertUserVideo = async ctx => {
  const result = {
    ok: true,
    filesPath: {},
    fileIsTooBig: false,
  };

  const videoLink = await UserService.getLinkToUserVideo(ctx);
  const validationLinkResult = ValidationService.validateUserVideoLink(videoLink);

  if (!validationLinkResult.ok) {
    await ReportErrorsService.reportError(ctx, validationLinkResult.error);
  }

  if (validationLinkResult.fileIsTooBig) {
    result.fileIsTooBig = true;
    return result;
  }

  const fileName = ConvertingService.getUniqueName();
  const videoPath = `${VIDEO_FOLDER}/${fileName}.mp4`;
  const musicPath = `${MUSIC_FOLDER}/${fileName}.mp3`;
  const fileStream = fs.createWriteStream(videoPath);

  const saveVideoResult = await ConvertingService.saveUserVideo(videoLink.link, fileStream);

  if (!saveVideoResult.ok) {
    result.ok = false;
    await ReportErrorsService.reportError(ctx, saveVideoResult.error);
    return result;
  }

  const convertingResult = await ConvertingService.convertVideoToMusic(videoPath, musicPath);

  if (!convertingResult.ok) {
    result.ok = false;
    await ReportErrorsService.reportError(ctx, saveVideoResult.error);
    return result;
  }

  result.filesPath = {videoPath, musicPath};
  return result;
};

module.exports = {
  convertUserVideo,
};
