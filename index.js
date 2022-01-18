const { Telegraf } = require('telegraf');
const connector = require('./src/database/Connector');
const { START, COMMANDS, ABOUT, AUTHOR } = require('./src/constants/Commands');
const { UA, RU, CN, EN } = require('./src/constants/Text');
const { languageButtons } = require('./src/templates/Buttons');
const AnalyticsService = require('./src/services/AnalyticsService');
const { userRegistration } = require('./src/controllers/UserController');
require('dotenv').config();

const bot = new Telegraf(process.env.bot_token);

bot.command(START, async ctx => {
  const {userId} = ctx.update.message.from;
  const registration = await userRegistration(userId);
  await AnalyticsService(START);

  if (registration) {
    ctx.reply(EN.CHOOSE_LANGUAGE_TEXT, {
      reply_markup: {
        inline_keyboard: [
          languageButtons
        ]
      }
    });
  }
});

bot.command(COMMANDS, ctx => {
  ctx.reply("TAKE YOUR COMMANDS!");
});

bot.command(ABOUT, ctx => {
  ctx.reply("TAKE YOUR ABOUT!");
});

bot.command(AUTHOR, ctx => {
  ctx.reply("TAKE YOUR AUTHOR!");
});

connector.connect();
bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
