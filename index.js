const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.bot_token);

bot.start(ctx => ctx.reply("Hello"));

bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
