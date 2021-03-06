const fs = require('fs');
const https = require('https');
const ffmpeg = require('fluent-ffmpeg');
const youtube = require("ytdl-core");
const request = require("request");
const {getVideoMeta} = require("tiktok-scraper");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
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
};

const getFileNameList = () => {
  return fs.readdirSync(MUSIC_FOLDER).map(fullFileName => {
    return fullFileName.split('.')[0];
  });
};

const getRandomInteger = () => {
  let rand = MIN + Math.random() * (MAX + 1 - MIN);
  return Math.floor(rand);
};

const saveUserVideo = (url, fileStream) => {
  const result = {
    ok: false,
    error: null,
  };

  return new Promise((resolve) => {
    try {
      https.get(url, response => {
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
};


const downloadVideoFromYouTube = (link, fileStream) => {
  const result = {
    ok: false,
    error: null,
  };

  return new Promise(resolve => {
    youtube(link)
      .on('error', e => {
        result.error = e;
        resolve(result);
      })
      .pipe(fileStream)
      .on('error', e => {
        result.error = e;
        resolve(result);
      })
      .on('finish', () => {
        result.ok = true;
        resolve(result);
      });
  });
};

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
};

const getTikTokLocation = async uri => {
  const result = {
    ok: false,
    id: null,
    error: null,
  }

  return new Promise(resolve => {
    request(
      {
        uri: uri,
        followRedirect: false,
      },
      async function(err, httpResponse) {
        if (err) {
          result.error = err;
          resolve(result);
        }
        result.ok = true;
        const location = httpResponse.headers.location;
        if (location.includes('m.tiktok.com')) {
          result.id = location.split('/v/')[1].split('.html')[0];
        } else if (location.includes('www.tiktok.com')) {
          result.id = location.split('/video/')[1].split('?')[0];
        }
        resolve(result);
      }
    );
  })
}

const getDownloadingLinkTikTok = async id => {
  const result = {
    ok: false,
    link: null,
    error: null,
  }

  const videoMeta = await getVideoMeta(`https://www.tiktok.com/@tiktok/video/${id}`).catch((e) => {
    result.error = e;
    return result;
  });
  console.log(videoMeta)
  result.link = videoMeta.collector[0].videoUrl;
  result.ok = true;
  return result;
}

module.exports = {
  getUniqueName,
  saveUserVideo,
  convertVideoToMusic,
  downloadVideoFromYouTube,
  getTikTokLocation,
  getDownloadingLinkTikTok,
};
