const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const filters = require("./filters.json");
const request = require("request");

let date = getTime();
let selector = 0;

// Do every hour
setInterval(function GameDealsNew(){
	date = getTime();
	freeGames(date);
}, 3600000);

function getTime(){
	let dateWhole = new Date();
	let date = dateWhole.getDate() + "." + (dateWhole.getMonth() + 1) + " " + dateWhole.getHours() + ":" + dateWhole.getMinutes();
	return date;
}

function freeGames(){
	request({
  		url: 'https://www.reddit.com/r/gamedeals/new.json',
 		json: true
	}, function(error, response, list) {
		let selector = 0;
		chooseGame(list);
	});
}

function chooseGame(list){
	try{
		if(list.data){
			game = list.data.children[selector].data
			console.log("\nCurrent game: " + game.title);
		}
		else{
			slector++;
			chooseGame(list);
		}
	}
	catch(error){
		console.log("couldn't get data");
	}	
	
	//check if the post is older than an hour
	let unixTime = (new Date).getTime() / 1000;
	if(game.created_utc > (unixTime - 3800)){
		filterGame(game);
		selector++;
		chooseGame(list);
	}
	else{
		console.log("Posted over an hour ago");
		selector = 0;
	}
}

function filterGame(game){
	console.log("filtering...");
	let valid = 0;
	let i = 0;
	filters.whitelist.forEach(function(){
		if (game.title.toLowerCase().includes(filters.whitelist[i])){
			valid = 1;
		}
		i++;
	});
	i = 0;
	filters.blacklist.forEach(function(){
		if (game.title.toLowerCase().includes(filters.blacklist[i])){
			valid = 0;
		}
		i++;
	});
	// Check the other precentages for 'free' in wrong context
	let wrongPercentOff = game.title.match(/\d{2,3}%/ig); 
	if(wrongPercentOff != null){
		let wrongPercentNumber = wrongPercentOff[0].match(/\d{2,3}/g);
		if(wrongPercentNumber < 100){
			valid = 0;
		}
	}
	// Check if there's any other values of money than 0
	let wrongMoneyOff = game.title.match(/\d{2,4}€|€\d{2,3}|\$\d{2,3}|£\d{2,3}/ig);
	if(wrongMoneyOff != null){
		let wrongMoneyNumber = wrongMoneyOff[0].match(/\d{2,3}/g);
		if(wrongMoneyNumber > 0){
			valid = 0;
		}
	}
	if(valid == 1){ 
		sendGame(game.title, game.url, game.thumbnail); 
		console.log("free");
	}
	else console.log("not free");
}

function sendGame(gameTitle, gameUrl, gameThumb){
	if(gameThumb == "default"){
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
	client.channels.get(config.channel_id).send({ embed });
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