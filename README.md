### You need to add your own config.json that needs to have:


```json
{
  "token": "insert bot token",
  "embedColor": "Hex color",
  "channel_name": "insert the name of the channel where the messages are sent"
}
```

### where: 
- token is the bot's API token that you get when creating the bot
- embedcolor is the  border color of the message on discord.
- channel_name is the name of the channel where the messages should be sent in each server. A channel with this name needs to exist in every server the bot is on. For those servers that don't have the channel, message just simply doesn't go through. The bot will stay on and will work on servers that are set up correctly.

## Usage
1. Install node.js and npm
2. Clone the repo and inside the folder run `npm install`
3. Create `config.json` from the example above
4. Edit the `filters.json` for your liking
5. run `node bot` inside the folder

## Note:
* The bot has no commands and it can be invited without any permissions and just given read/write permission to the free-games channel
* The filters list is tailored for myself and doesn't show games for consoles or Windows store for example so you probably want to edit that
* This is for Discord.js version 13 which requires Node 16.6 or higher
* The bot can be "daemonized" with tmux or something like that

## Planning to add:
- Saving 5-10 latest posts to memory in order to prevent dublicates
- More sources to find free game notifications from
