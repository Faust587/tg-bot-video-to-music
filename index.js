const { Telegraf } = require('telegraf');
const connector = require('./src/database/Connector');
const {COMMANDS, ABOUT, AUTHOR} = require('./src/constants/Commands');
require('dotenv').config();

const bot = new Telegraf(process.env.bot_token);

bot.start(ctx => ctx.reply("Hello"));

bot.command(COMMANDS, ctx => {
  ctx.reply("TAKE YOUR FUCKING COMMANDS!");
});

bot.command(ABOUT, ctx => {
  ctx.reply("TAKE YOUR FUCKING ABOUT!");
});

bot.command(AUTHOR, ctx => {
  ctx.reply("TAKE YOUR FUCKING AUTHOR!");
});

connector.connect();
bot.launch().then(r => r ? console.log(r) : console.log('Bot has been started....'));
