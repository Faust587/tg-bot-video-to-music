const { Telegraf } = require('telegraf');
const connector = require('./src/database/Connector');
const { START, COMMANDS, ABOUT, AUTHOR } = require('./src/constants/Commands');
const languages = require('./src/constants/Text');
const { languageButtons } = require('./src/templates/Buttons');
const AnalyticsService = require('./src/services/AnalyticsService');
const UserService = require('./src/services/UserService');
const { userRegistration } = require('./src/controllers/UserController');
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
  const {id} = ctx.update.message.from;
  const userLang = await UserService.getUserLanguage(id);
  const url = await UserService.getUrlToUserVideo(ctx);
});

connector.connect();
bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
