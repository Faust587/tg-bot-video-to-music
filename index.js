const { Telegraf } = require('telegraf');
const connector = require('./src/database/Connector');
const { START, COMMANDS, ABOUT, AUTHOR } = require('./src/constants/Commands');
const languages = require('./src/constants/Text');
const { languageButtons } = require('./src/markdown/Buttons');
const AnalyticsService = require('./src/services/AnalyticsService');
const UserService = require('./src/services/UserService');
const ValidationService = require('./src/services/ValidationService');
const ConvertingController = require('./src/controllers/ConvertingController');
const { userRegistration } = require('./src/controllers/UserController');
const fs = require("fs");
require('dotenv').config();

const bot = new Telegraf(process.env.bot_token);

bot.command(START, async ctx => {
  const {id} = ctx.update.message.from;
  const registration = await userRegistration(id);

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
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].COMMANDS);
  await AnalyticsService(COMMANDS);
});

bot.command(ABOUT, async ctx => {
  const {id} = ctx.update.message.from;
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].COMMANDS);

  await AnalyticsService(ABOUT);
});

bot.command(AUTHOR, async ctx => {
  const {id} = ctx.update.message.from;
  const userLang = await UserService.getUserLanguage(id);
  ctx.reply(languages[userLang].AUTHOR);

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
      break;
    }
  }
});

bot.on('video', async ctx => {
  const convertUserVideo = await ConvertingController.convertUserVideo(ctx);
  const {videoPath, musicPath} = convertUserVideo.filesPath;

  if (!convertUserVideo.ok) {
    await ctx.reply('Something went wrong, please try again.... Our admins work with that problem');
  } else if (convertUserVideo.fileIsTooBig) {
    await ctx.reply('Sorry, Telegram does not allow me to process file with weight more than 20mb');
  } else {
    await ctx.replyWithAudio({ source: fs.createReadStream(musicPath)});
  }
  fs.unlinkSync(musicPath);
  fs.unlinkSync(videoPath);
});

bot.on('message', async ctx => {
  const validationResult = await ValidationService.validateUserLink(ctx.message.text);
  if (validationResult.ok) {
    switch (validationResult.type) {
      case 'youtube': {
        const convertingResult = await ConvertingController.convertYouTubeLinkToVideo(ctx, validationResult.link);
        const {videoPath, musicPath} = convertingResult.filesPath;
        if (!convertingResult.ok) {
          await ctx.reply('Something went wrong, please try again.... Our admins work with that problem');
        } else {
          await ctx.replyWithAudio({ source: fs.createReadStream(musicPath)});
          fs.unlinkSync(musicPath);
          fs.unlinkSync(videoPath);
        }
        break;
      }
      case 'tiktok': {
        const convertingResult = await ConvertingController.convertingTikTokVideo(ctx, validationResult.link);
        const {videoPath, musicPath} = convertingResult.filesPath;
        if (!convertingResult.ok) {
          await ctx.reply('Something went wrong, please try again.... Our admins work with that problem');
        } else {
          await ctx.replyWithAudio({ source: fs.createReadStream(musicPath)});
          fs.unlinkSync(musicPath);
          fs.unlinkSync(videoPath);
        }
        break;
      }
    }
  } else {
    ctx.reply("SHIT");
  }
})

connector.connect();
bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
