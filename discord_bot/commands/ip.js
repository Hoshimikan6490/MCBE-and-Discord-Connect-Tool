const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config({ quiet: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ip")
    .setDescription("💻統合版マインクラフトサーバーの接続情報を表示します！"),

  run: async (client, interaction) => {
    try {
      let mcIP = process.env.mcIPaddress;
      let mcPort = process.env.mcPort || 19132;

      let embed = new EmbedBuilder()
        .setTitle("💻統合版マインクラフトサーバーの接続情報")
        .setDescription(`- IP: \`${mcIP}\`\n- PORT: \`${mcPort}\``)
        .setColor(0x00ff00);

      let button = new ActionRowBuilder(
        new ButtonBuilder()
          .setLabel("サーバーへの参加方法")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://kuwa.app/tool/hjs/?ip=${mcIP}&port=${mcPort}`)
      );

      return interaction.reply({
        embeds: [embed],
        components: [button],
      });
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
