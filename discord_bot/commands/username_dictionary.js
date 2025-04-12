const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("username_dictionary")
    .setDescription("📚ユーザー名をdiscordのユーザー名と置き換えます！"),

  run: async (client, interaction) => {
    try {
      //todo: コード書く
      return interaction.reply("準備中…");
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
