const config = require("../config.json");
const filters = require("../filters.json");
const request = require("request");

// Replace 'Title' with the title to check if it's seen as free or not
let game = "[Fanatical] Homefront: The Revolution - Freedom Fighter Bundle - Steam -  -100";
filterGame(game);

function filterGame(game) {
	let valid = 0;
	let i = 0;
	console.log("Checking for the whitelisted words...");
	filters.whitelist.forEach(function(){
		if (game.toLowerCase().includes(filters.whitelist[i])) {
			console.log("Matched whitelisted word: " + filters.whitelist[i]);
			valid = 1;
		}
		i++;
	});

	if(valid) {
		i = 0;
		console.log("Checking for the blacklisted words...");
		filters.blacklist.forEach(function() {
			if (game.toLowerCase().includes(filters.blacklist[i])) {
				console.log("Matched blacklisted word: " + filters.blacklist[i]);
				valid = 0;
			}
			i++;
		});
	}

	if(valid) {
		// Check the other precentages for 'free' in wrong context
		console.log("Checking for the precentages...");
		let wrongPercentOff = game.match(/\d{2,3}%/ig);
		if (wrongPercentOff != null) {
			console.log("Checking for the precentage numbers...");
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
		let wrongMoneyOff = game.match(/^[0-9]+(\.[0-9]{1,})|[0-9]+(\.[0-9]{1,})€|€[0-9]+(\.[0-9]{1,})|[0-9]+(\.[0-9]{1,})\$|\$[0-9]+(\.[0-9]{1,})|£[0-9]+(\.[0-9]{1,})|[0-9]+(\.[0-9]{1,})£?$/ig);
		console.log(wrongMoneyOff)
		if (wrongMoneyOff != null) {
			console.log("Checking for the money...");
			let wrongMoneyNumber;
			i = 0;
			wrongMoneyOff.forEach(function() {
				wrongMoneyNumber = wrongMoneyOff[i].match( /\d+/ig ).join([]);
				console.log(wrongMoneyNumber);
				if(wrongMoneyNumber > 0) {
					valid = 0;
					console.log("Wrong money value: " + wrongMoneyNumber);
				}
				i++;
			});
		}
	}

	if(valid) {
		console.log("free");
		return;
	}

	console.log("not free");
	return;
}