const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const filters = require("./filters.json");
const request = require("request");

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
	request( {
  		url: 'https://www.reddit.com/r/gamedeals/new.json',
 		json: true
	}, function(error, response, list) {
		let selector = 0;
		chooseGame(list);
	});
}

function chooseGame(list) {
	try {
		if (list.data){
			game = list.data.children[selector].data
			console.log("\n" + date + " Current game: " + game.title);
		}
		else {
			slector++;
			chooseGame(list);
		}
	}
	catch (error) {
		console.log("couldn't get data");
	}

	//check if the post is older than an hour (And 10sec because otherwise it still can get the same one)
	let unixTime = (new Date).getTime() / 1000;
	if (game.created_utc > (unixTime - 3810)){
		filterGame(game);
		selector++;
		chooseGame(list);
	}
	else {
		console.log("Posted over an hour ago. Ignoring");
		selector = 0;
	}
}

function filterGame(game) {
	let valid = 0;
	let i = 0;
	console.log("Checking for the whitelisted words...");
	filters.whitelist.forEach(function(){
		if (game.title.toLowerCase().includes(filters.whitelist[i])) {
			console.log("Matched whitelisted word: " + filters.whitelist[i]);
			valid = 1;
		}
		i++;
	});

	if(valid) {
		i = 0;
		console.log("Checking for the blacklisted words...");
		filters.blacklist.forEach(function() {
			if (game.title.toLowerCase().includes(filters.blacklist[i])) {
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
	if (gameThumb == "default") {
		gameThumb = "https://puu.sh/B8rUY.jpg";
	}
	embed = {
		"title": "Free Game!",
		"description": gameTitle + ": " + gameUrl,
		"color": config.embedColor,
		"image": {
			"url": gameThumb
		},
		"thumbnail": {
			"url": "https://puu.sh/AZxe5.png"
		}
	};

	try {
		client.guilds.map((guild) => {
			guild.channels.map((channel) => {
				if (channel.name === config.channel_name) {
					channel.send({embed});
				}
			});
		});
	}
	catch (err) {
		console.log("Could not send message to all channels!" + err);
	}
}

console.log(date + ": Setup Done!");

client.on("ready", function() {
	client.user.setActivity("for free games!", { type: "WATCHING" });
	console.log(date + ": Connected!");
	console.log("Version: " + config.version + " - Last Updated: " + config.updateDate);
	freeGames();
});

client.on('uncaughtException', (e) => console.error(date + ": " + e));
client.on('error', (e) => console.error(date + ": " + e));
client.on('warn', (e) => console.error(date + ": " + e));
client.login(config.token);
