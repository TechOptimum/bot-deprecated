const { Client } = require("discord.js");
const settings = require("./config");

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
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
