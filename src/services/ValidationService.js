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

const validateUserLink = url => {
  const result = {
    ok: true,
    type: null,
    url: url
  }
  const YouTubeRegexp = /https:\/\/www.youtube.com\/watch?/;
  const TikTokRegexp = /https:\/\/www.tiktok.com\//;
  if (url.match(YouTubeRegexp)) {
    result.type = 'youtube';
  } else if (url.match(TikTokRegexp)) {
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
