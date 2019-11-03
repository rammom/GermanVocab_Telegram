const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.GermanVocab_Token);

// Gather vocabulary
const csv = require("csvtojson");
const max_chapter = 4;
let vocab = [];
let chapter_ends = [0];
let choice = 0;
let chapter = 0;

async function setup() {
	return new Promise(async (resolve, reject) => {
		for (let i = 1; i < 5; ++i){
			let local = await csv().fromFile(`./vocabulary/chapter${i}.csv`)
			chapter_ends.push(chapter_ends[chapter_ends.length-1]+local.length);
			vocab = vocab.concat(local);
		}
		return resolve();
	});
}

let ask = (ctx, prepend="") => {
	let min, max;
	if (chapter == 0) {
		min = 0;
		max = vocab.length;
	}
	else {
		min = chapter_ends[chapter-1];
		max = chapter_ends[chapter];
	}
	choice = min + Math.floor(Math.random() * Math.floor(max-min));
	ctx.reply(prepend + "\n\n" + vocab[choice].en);
}

let main = async () => {

	await setup();

	bot.start(ctx => { 
		ctx.reply("Thank you for subscribing to our german vocabulary practice! I hope this bot will help new learners improve their german vocabulary, if you have any issues with the bot or ideas for improvements please let me know, you can reach out by messaging @mrammo.\n\n- Moose\nType /practice to start.")
		ask(ctx);
	});

	bot.hears(/\/chapter\s[0-9][0-9]*/, (ctx) => {
		new Promise((resolve, reject) => {
			let local = ctx.message.text.split(/\s/)[1];
			if (local > max_chapter) return reject("Invalid Chapter");
			chapter = local;
			if (chapter == 0) return resolve(`Testing vocab in all chapters`);
			else return resolve(`Testing vocab in chapter ${chapter}`)
		})
		.then(txt => {
			ctx.reply(txt);
			ask(ctx);
		})
		.catch(txt => {
			ctx.reply(txt);
			ask(ctx);
		});
	});

	bot.hears(/[^\/].*/, (ctx) => {
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
