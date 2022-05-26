const { Client } = require("discord.js");
const settings = require("./config");
const keep_alive = require('./keep_alive.js')
const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
});

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
 // client.user.setActivity(`007_link sucks`);
});
client.on('ready', () => {
    setInterval(async ()=>{
        let textList = ['Fortnite','You','Coding videos', 'Donald Trump', 'The news', `Developers working on Tech Optimum`]
        var text = textList[Math.floor(Math.random() * textList.length)];
        client.user.setActivity(text , { type: 'WATCHING' })
    },50000) // milliseconds
});

client.on("ready", async () => {
  console.log(`Online ${client.user.tag}`);
  let guild = client.guilds.cache.get(settings.guildID);
  if (guild) {
    await guild.commands.set([
      {
        name: "setup",
        description: `setup application system in your server`,
        type: "CHAT_INPUT",
      },
      {
        name: "ping",
        description: `get ping of bot`,
        type: "CHAT_INPUT",
      },
    ]);
  }
  require("./application_manager")(client, settings);
});

client.login(process.env.TOKEN);
