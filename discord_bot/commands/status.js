const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("💻マイクラサーバーのステータスを表示します。"),

  run: async (client, interaction) => {
    try {
      let IPaddress = process.env.server_ip;
      fetch(`https://api.mcsrvstat.us/bedrock/3/${IPaddress}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return interaction.reply("done");
        });
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
