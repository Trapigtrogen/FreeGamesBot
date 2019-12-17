### You need to add your own config.json that needs to have:


```json
{
  "token": "insert bot token",
  "version": "1.0.0",
  "updateDate": "13.05.2019",
  "embedColor": "6648024",
  "channel_id": "insert ID of the channel you wish the bot to send the messages"
}
```

### where: 
- token is the bot's token that you get when creating the bot to API
- embedcolor is the  bordercolor of the message on discord
- channel_id is the id of channel you wish the messages to be sent to

## Planning to add:
- Replace channel id with channel name so it would work with multiple servers at once
- Saving 5-10 latest posts to memory in order to prevent dublicates
- more sources to find free game notifications from