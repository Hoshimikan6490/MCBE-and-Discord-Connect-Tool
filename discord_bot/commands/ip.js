const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ip")
    .setDescription("💻統合版マインクラフトサーバーの接続情報を表示します！"),

  run: async (client, interaction) => {
    try {
      let embed = new EmbedBuilder()
        .setTitle("💻統合版マインクラフトサーバーの接続情報")
        .setDescription(
          `- IP: \`${process.env.mcIPaddress}\`\n- PORT: \`${process.env.mcPort}\``
        )
        .setColor(0x00ff00);

      return interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
