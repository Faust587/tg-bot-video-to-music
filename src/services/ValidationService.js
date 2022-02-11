const validateUserVideoLink = videoLink => {
  const validationResult = {
    ok: true,
    fileIsTooBig: false,
    error: null,
  }
  const {ok, error} = videoLink;

  if (ok) {
    return validationResult;
  }

  if (error === 'Bad Request: file is too big') {
    validationResult.fileIsTooBig = true;
    return validationResult;
  }

  validationResult.ok = false;
  validationResult.error = error;
  return validationResult;
};

const validateUserLink = async msg => {
  const result = {
    ok: true,
    type: null,
    link: null
  }

  if (msg.text === undefined) {
    result.ok = false;
    return result
  }

  const url = msg.text;
  result.link = url;

  const youtubeShortRegex = /https:\/\/youtu.be\//;
  const youtubeLongRegex = /https:\/\/www.youtube.com\//;
  const tiktokShortLinkRegex = /https:\/\/vm.tiktok.com\//;
  const tiktokLongLinkRegex = /https:\/\/www.tiktok.com\//;

  if (url.match(youtubeShortRegex) || url.match(youtubeLongRegex)) {
    result.type = 'youtube';
  } else if (url.match(tiktokShortLinkRegex) || url.match(tiktokLongLinkRegex)) {
    result.type = 'tiktok';
  } else {
    result.ok = false;
  }

  return result;
}

module.exports = {
  validateUserVideoLink,
  validateUserLink,
};
