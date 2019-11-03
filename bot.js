const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.GermanVocab_Token);

bot.start(ctx => 
	ctx.reply(`
		Thank you for subscribing to our german vocabulary practice!
		I hope this bot will help new learners improve their german vocabulary,
		if you have any issues with the bot or ideas for improvements please let me know, you can 
		reach out by messaging @mrammo.
		
		- Moose
	`)
)

bot.hears('hey', ctx => ctx.reply('Hello!'))


bot.launch()
