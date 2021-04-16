const Discord = require("discord.js");
const client = new Discord.Client({ disableMentions: 'everyone' });
const config = require("../config.json");
const package = require("../package.json");

let date = getTime();

function getTime() {
	let dateWhole = new Date();
	let date = dateWhole.getDate() + "." + (dateWhole.getMonth() + 1) + " " + dateWhole.getHours() + ":" + dateWhole.getMinutes();
	return date;
}

function sendGame(gameTitle, gameUrl, gameThumb) {
	// build an embed message for prettines points
	const embed = new Discord.MessageEmbed()
	.setColor(config.embedColor)
	.setTitle('Free Game!')
	.setDescription(gameTitle + ": " + gameUrl)
	.setThumbnail('https://puu.sh/AZxe5.png')
	.setImage(gameThumb);

	// Send embed message to all servers
	try {
		client.guilds.cache.map((guild) => {
			guild.channels.cache.map((channel) => {
				// find the proper channel
				if (channel.name === config.channel_name) {
					channel.send({embed});
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
	client.user.setActivity("for free games!", { type: "WATCHING" });
	console.log(date + ": Connected!");
	console.log("Version: " + package.version);

    sendGame("FreeGamesBot", "https://gitlab.com/Trapigtrogen/freegamesbot", "https://assets.gitlab-static.net/uploads/-/system/project/avatar/12318149/thenewlogo3__Custom_.png");
});

client.on('uncaughtException', (e) => console.error(date + ": " + e));
client.on('error', (e) => console.error(date + ": " + e));
client.on('warn', (e) => console.error(date + ": " + e));

// The bot logins here and goes to ready state
client.login(config.token);