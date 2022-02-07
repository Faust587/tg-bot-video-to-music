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

module.exports = {
  validateUserVideoLink,
}
