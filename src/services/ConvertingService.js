const fs = require('fs');
const http = require('https');

const { MIN, MAX } = require('../constants/FileName');
const { VIDEO_FOLDER, MUSIC_FOLDER } = require('../constants/Path');

const getUniqueName = () => {
  const fileNameList = getFileNameList();

  let uniqueName = getRandomInteger().toString();

  for (let i = 0; i < fileNameList.length; i++) {
    if (fileNameList[i] === uniqueName) {
      uniqueName = getRandomInteger().toString();
      i = -1;
    }
  }

  return uniqueName;
}

const getFileNameList = () => {
  return fs.readdirSync(MUSIC_FOLDER).map(fullFileName => {
    return fullFileName.split('.')[0];
  });
}

const getRandomInteger = () => {
  let rand = MIN + Math.random() * (MAX + 1 - MIN);
  return Math.floor(rand);
}

const saveUserVideo = (name, url) => {
  const result = {
    ok: true,
    error: "",
  };

  const videoPath = `${VIDEO_FOLDER}/${name}.mp4`;
  try {
    http.get(url, response => {
      const file = fs.createWriteStream(videoPath);
      response.pipe(file);
    });
  } catch (e) {
    const errorText = JSON.stringify(e, null, 2);
    result.ok = false;
    result.error = errorText;
  }
  return result;
};

module.exports = {
  getUniqueName,
  saveUserVideo,
};
