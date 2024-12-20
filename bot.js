const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const config = require("./config.json");
const filters = require("./filters.json");
const package = require("./package.json");
const request = require("request");
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES
]});

let date = getTime();
let selector = 0;

// Do every hour
setInterval(function GameDealsNew() {
	date = getTime();
	freeGames();
}, 3600000);

function getTime() {
	let dateWhole = new Date();
	let date = dateWhole.getDate() + "." + (dateWhole.getMonth() + 1) + " " + dateWhole.getHours() + ":" + dateWhole.getMinutes();
	return date;
}

function freeGames() {
	const fetch = require("node-fetch");

	fetch("https://api.reddit.com/r/gamedeals/new.json?sort=new&t=day")
	.then(response => response.json())
	.then(response => {
		chooseGame(response)
	});

	/* You can just stack sources like this
	fetch("https://api.reddit.com/r/someothersubreddit/new.json?sort=new&t=day")
	.then(response => response.json())
	.then(response => {
		chooseGame(response)
	});
	*/
}

function chooseGame(list) {
	if (list.data) {
		game = list.data.children[selector].data
		console.log("\n" + date + " Current game: " + game.title);
	}
	else {
		console.log("couldn't get data");
		return;
	}

	//check if the post is older than an hour (And 10sec because otherwise it still can get the same one in some cases)
	let unixTime = (new Date).getTime() / 1000;
	if (game.created_utc > (unixTime - 3610)) {
		filterGame(game);
		selector++;
		chooseGame(list);
	}
	else {
		console.log("Posted over an hour ago. Ignoring");
		selector = 0;
	}
	return;
}

function filterGame(game) {
	let valid = 0;
	let i = 0;
	console.log("Checking for the whitelisted words...");
	filters.whitelist.forEach(function() {
		if (game.title.toLowerCase().includes(filters.whitelist[i].toLowerCase())) {
			console.log("Matched whitelisted word: " + filters.whitelist[i]);
			valid = 1;
		}
		i++;
	});

	if(valid) {
		i = 0;
		console.log("Checking for the blacklisted words...");
		filters.blacklist.forEach(function() {
			if (game.title.toLowerCase().includes(filters.blacklist[i].toLowerCase())) {
				console.log("Matched blacklisted word: " + filters.blacklist[i]);
				valid = 0;
			}
			i++;
		});
	}

	if(valid) {
		// Check the other precentages for 'free' in wrong context
		console.log("Checking for the precentages...");
		let wrongPercentOff = game.title.match(/\d{2,3}%/ig);
		if (wrongPercentOff != null) {
			let wrongPercentNumber;
			i = 0;
			wrongPercentOff.forEach(function() {
				wrongPercentNumber = wrongPercentOff[i].match(/\d{2,3}/ig);
				if(wrongPercentNumber < 100) {
					valid = 0;
					console.log("Wrong precentage: " + wrongPercentNumber);
				}
				i++;
			});
		}
	}

	if(valid) {
		// Check if there's any other values of money than 0
		console.log("Checking for the money signs...");
		let wrongMoneyOff = game.title.match(/^[0-9]+(\.[0-9]{1,})|[0-9]+(\.[0-9]{1,})€|€[0-9]+(\.[0-9]{1,})|[0-9]+(\.[0-9]{1,})\$|\$[0-9]+(\.[0-9]{1,})|£[0-9]+(\.[0-9]{1,})|[0-9]+(\.[0-9]{1,})£?$/ig);
		if (wrongMoneyOff != null) {
			let wrongMoneyNumber;
			i = 0;
			wrongMoneyOff.forEach(function() {
				wrongMoneyNumber = wrongMoneyOff[i].match( /\d+/ig ).join([]);
				if(wrongMoneyNumber > 0) {
					valid = 0;
					console.log("Wrong money value: " + wrongMoneyNumber);
				}
				i++;
			});
		}
	}

	if(valid) {
		sendGame(game.title, game.url, game.thumbnail);
		console.log("free");
		return;
	}

	console.log("not free");
	return;
}

function sendGame(gameTitle, gameUrl, gameThumb) {
	if (gameThumb == "default" || gameThumb == "self") {
		gameThumb = "https://puu.sh/B8rUY.jpg";
	}

	console.log("Free game info:\nName: ", gameTitle, "\nURL: ", gameUrl, "\nThumb URL: ", gameThumb);

	// build an embed message for prettines points
	const embed = {
		color: config.embedColor,
		title: 'Free Game!',
		description: gameTitle + ": " + gameUrl,
		thumbnail: {
			url: 'https://puu.sh/AZxe5.png'
		},
		image: {
			url: gameThumb,
		},
	};

	// Send embed message to all servers
	try {
		client.guilds.cache.map((guild) => {
			guild.channels.cache.map((channel) => {
				// find the proper channel
				if (channel.name === config.channel_name) {
					channel.send({embeds: [embed]});
				}
			});
		});
	}
	catch (err) {
		console.log("Could not send message to all channels!\n" + err);
	}
}


// Discord.js events
client.on("ready", function() {
	client.user.setActivity("for free games!", { type: 3 });
	console.log(date + ": Connected!");
	console.log("Version: " + package.version);
	//freeGames();
});

client.on('uncaughtException', (e) => console.error(date + ": " + e));
client.on('error', (e) => console.error(date + ": " + e));
client.on('warn', (e) => console.error(date + ": " + e));

// The bot logins here and goes to ready state
client.login(config.token);
