const config = require("./config.json");
const filters = require("./filters.json");
const request = require("request");

let game = "title";
filterGame(game);

function filterGame(game){
	console.log("filtering...");
	let valid = 0;
	let i = 0;
	console.log("Checking for the whitelisted words...");
	filters.whitelist.forEach(function(){
		if (game.toLowerCase().includes(filters.whitelist[i])){
			console.log("Matched whitelisted word: " + filters.whitelist[i]);
			valid = 1;
		}
		i++;
	});
	i = 0;
	console.log("Checking for the blacklisted words...");
	filters.blacklist.forEach(function(){
		if (game.toLowerCase().includes(filters.blacklist[i])){
			console.log("Matched blacklisted word: " + filters.blacklist[i]);
			valid = 0;
		}
		i++;
	});
	// Check the other precentages for 'free' in wrong context
	let wrongPercentOff = game.match(/\d{2,3}%/ig); 
	if(wrongPercentOff != null){
		let wrongPercentNumber = wrongPercentOff[0].match(/\d{2,3}/g);
		if(wrongPercentNumber < 100){
			valid = 0;
		}
	}
	// Check if there's any other values of money than 0
	let wrongMoneyOff = game.match(/\d{2,4}€|€\d{2,3}|\$\d{2,3}|£\d{2,3}/ig);
	if(wrongMoneyOff != null){
		let wrongMoneyNumber = wrongMoneyOff[0].match(/\d{2,3}/g);
		if(wrongMoneyNumber > 0){
			valid = 0;
		}
	}
	if(valid == 1){ 
		console.log("free");
	}
	else console.log("not free");
}