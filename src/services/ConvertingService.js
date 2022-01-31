const fs = require('fs');

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

module.exports = {
  getUniqueName,
};
