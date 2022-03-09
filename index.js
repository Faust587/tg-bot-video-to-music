const { Telegraf } = require('telegraf');
const connector = require('./src/database/Connector');
const { START, COMMANDS, ABOUT, AUTHOR, TIKTOK, VIDEO, YOUTUBE, LANGUAGE} = require('./src/constants/Commands');
const languages = require('./src/constants/Text');
const { languageButtons } = require('./src/markdown/Buttons');
const AnalyticsService = require('./src/services/AnalyticsService');
const UserService = require('./src/services/UserService');
const ValidationService = require('./src/services/ValidationService');
const ConvertingController = require('./src/controllers/ConvertingController');
const { userRegistration } = require('./src/controllers/UserController');
const fs = require("fs");
require('dotenv').config();

const bot = new Telegraf(process.env.bot_token, {handlerTimeout: 9_000_000});

bot.command(START, async ctx => {
  const {id} = ctx.update.message.from;
  const registration = await userRegistration(id);

  await ctx.replyWithSticker('CAACAgIAAxkBAAPcYEkH4jKzuHeKC5ZI7SbTq985VjgAAtMAA1advQr1Mo-X1RL5PR4E');

  if (registration) {
    ctx.reply(languages['en'].CHOOSE_LANGUAGE_TEXT, {
      reply_markup: {
        inline_keyboard: [
          languageButtons
        ]
      }
    });
  }

  await AnalyticsService(START);
});

bot.command(COMMANDS, async ctx => {
  const {id} = ctx.update.message.from;
  await userRegistration(id);
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].COMMANDS);
  await AnalyticsService(COMMANDS);
});

bot.command(ABOUT, async ctx => {
  const {id} = ctx.update.message.from;
  await userRegistration(id);
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].ABOUT);

  await AnalyticsService(ABOUT);
});

bot.command(AUTHOR, async ctx => {
  const {id} = ctx.update.message.from;
  await userRegistration(id);
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].AUTHOR);

  await AnalyticsService(AUTHOR);
});

bot.command(LANGUAGE, async ctx => {
  const {id} = ctx.update.message.from;
  await userRegistration(id);
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].CHOOSE_LANGUAGE_TEXT, {
    reply_markup: {
      inline_keyboard: [
        languageButtons
      ]
    }
  });

  await AnalyticsService(AUTHOR);
});

bot.on('callback_query', async ctx => {
  const [type, value] = ctx.update.callback_query.data.split(' ');
  const { id } = ctx.update.callback_query.from;
  switch (type) {
    case 'changeLang': {
      await UserService.changeUserLang(id, value);
      const userLang = await UserService.getUserLanguage(id);
      await ctx.telegram.sendMessage(id, languages[userLang].LANGUAGE_IS_CHOSEN);
      await ctx.telegram.sendMessage(id, languages[userLang].ABOUT);
      break;
    }
  }
});

bot.on('video', async ctx => {
  const {id} = ctx.update.message.from;
  const userLang = await UserService.getUserLanguage(id);
  await userRegistration(id);

  const convertUserVideo = await ConvertingController.convertUserVideo(ctx, userLang);
  const {videoPath, musicPath} = convertUserVideo.filesPath;

  if (!convertUserVideo.ok) {
    await ctx.reply(languages[userLang].UNKNOWN_ERROR);
  } else if (convertUserVideo.fileIsTooBig) {
    await ctx.reply(languages[userLang].FILE_IS_TOO_BIG);
  } else {
    await ctx.reply(languages[userLang].SENDING_AUDIO);
    await ctx.replyWithAudio({ source: fs.createReadStream(musicPath)});
    fs.unlinkSync(musicPath);
    fs.unlinkSync(videoPath);
  }
  await AnalyticsService(VIDEO);
});

bot.on('message', async ctx => {
  const {id} = ctx.update.message.from;
  await userRegistration(id);
  const userLang = await UserService.getUserLanguage(id);

  const validationResult = await ValidationService.validateUserLink(ctx.message);

  if (validationResult.ok) {
    switch (validationResult.type) {
      case 'youtube': {
        const convertingResult = await ConvertingController.convertYouTubeLinkToVideo(ctx, validationResult.link, userLang);
        const {videoPath, musicPath} = convertingResult.filesPath;
        if (!convertingResult.ok) {
          await ctx.reply(languages[userLang].UNKNOWN_ERROR);
        } else {
          await ctx.reply(languages[userLang].SENDING_AUDIO);
          await ctx.replyWithAudio({ source: fs.createReadStream(musicPath)});
          fs.unlinkSync(musicPath);
          fs.unlinkSync(videoPath);
          await AnalyticsService(YOUTUBE);
        }
        break;
      }
      case 'tiktok': {
        const convertingResult = await ConvertingController.convertingTikTokVideo(ctx, validationResult.link, userLang);
        const {videoPath, musicPath} = convertingResult.filesPath;
        if (!convertingResult.ok) {
          await ctx.reply(languages[userLang].UNKNOWN_ERROR);
        } else {
          await ctx.reply(languages[userLang].SENDING_AUDIO);
          await ctx.replyWithAudio({ source: fs.createReadStream(musicPath)});
          fs.unlinkSync(musicPath);
          fs.unlinkSync(videoPath);
          await AnalyticsService(TIKTOK);
        }
        break;
      }
    }
  } else {
    ctx.reply(languages[userLang].IS_NOT_URL);
  }
})

connector.connect();
bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
