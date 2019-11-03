const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.GermanVocab_Token);

// Gather vocabulary
const csv = require("csvtojson");
let vocab = [];
let choice = 0;

async function setup() {
	return new Promise(async (resolve, reject) => {
		for (let i = 1; i < 5; ++i){
			vocab = vocab.concat( await csv().fromFile(`./vocabulary/chapter${i}.csv`) )
		}
		return resolve();
	});
}

let ask = (ctx, prepend="") => {
	choice = Math.floor(Math.random() * Math.floor(vocab.length));
	ctx.reply(prepend + "\n\n" + vocab[choice].en);
}

let main = async () => {

	await setup();

	bot.start(ctx => { 
		ctx.reply("Thank you for subscribing to our german vocabulary practice! I hope this bot will help new learners improve their german vocabulary, if you have any issues with the bot or ideas for improvements please let me know, you can reach out by messaging @mrammo.\n\n- Moose\nType /practice to start.")
		ask(ctx);
	});

	bot.hears(/.*/, (ctx) => {
		let recap = "=====\n";
		if (ctx.message.text == vocab[choice].de) recap += "✅";
		else recap += "❌";
		recap += `\n${vocab[choice].de}\n${vocab[choice].en}`;
		recap += "\n====="
		ask(ctx, recap);
	});

	bot.launch()
}

main();
