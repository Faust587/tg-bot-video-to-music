const fs = require('fs');
const http = require('https');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const { MIN, MAX } = require('../constants/FileName');
const { MUSIC_FOLDER } = require('../constants/Path');

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

const saveUserVideo = (url, fileStream) => {
  const result = {
    ok: false,
    error: null,
  };

  return new Promise((resolve) => {
    try {
      http.get(url, response => {
        response.pipe(fileStream).on('finish', () => {
          result.ok = true;
          resolve(result);
        })
      });
    } catch (e) {
      result.error = JSON.stringify(e.response.description, null, 2);
      resolve(result);
    }
  });
}

const convertVideoToMusic = (videoPath, musicPath) => {
  const result = {
    ok: false,
    error: null,
  };

  return new Promise((resolve) => {
    try {
      ffmpeg(videoPath)
        .output(musicPath)
        .on('end', () => {
          result.ok = true;
          resolve(result);
        })
        .run();
    } catch (e) {
      result.error = JSON.stringify(e, null, 2);
      resolve(result);
    }
  });
}

module.exports = {
  getUniqueName,
  saveUserVideo,
  convertVideoToMusic,
};
