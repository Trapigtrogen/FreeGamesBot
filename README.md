### You need to add your own config.json that needs to have:


```json
{
  "token": "insert bot token",
  "version": "x.x.x",
  "updateDate": "xx.xx.xxxx",
  "embedColor": "RGB",
  "channel_name": "insert the name of the channel where the messages are sent"
}
```

### where: 
- token is the bot's API token that you get when creating the bot
- embedcolor is the  border color of the message on discord. RGB format without anything between
- channel_name is the name of the channel where the messages should be sent in each server. A channel with this name needs to exist in every server the bot is on
- version and update date are just printed when the bot starts and serve no real purpose

## Note:
The bot has no commands and it can be invited without any permissions and just given read/write permission to the free-games channel
You will need to install discord.js and request with npm
The filters list is tailored for myself and doesn't show games for consoles or Windows store for example so you probably want to edit that

## Planning to add:
- Saving 5-10 latest posts to memory in order to prevent dublicates
- more sources to find free game notifications from