const { Telegraf } = require('telegraf');
const connector = require('./src/database/Connector');
require('dotenv').config();

const bot = new Telegraf(process.env.bot_token);

bot.start(ctx => ctx.reply("Hello"));

connector.connect();
bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
