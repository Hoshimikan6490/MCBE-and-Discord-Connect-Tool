import { system, world } from "@minecraft/server";
import {
  HttpRequest,
  HttpHeader,
  http,
  HttpRequestMethod,
} from "@minecraft/server-net";
import { channelID, botToken } from "./env.js";

// ============================
// Discord メッセージ送信関数
// ============================
async function sendDiscordMessage(message) {
  const req = new HttpRequest(
    `https://discord.com/api/v10/channels/${channelID}/messages`
  );
  req.method = HttpRequestMethod.Post;
  req.body = JSON.stringify(message);
  req.headers = [
    new HttpHeader("Content-Type", "application/json"),
    new HttpHeader("Authorization", `Bot ${botToken}`),
  ];
  await http.request(req);
}

// ============================
// Minecraft イベント連携
// ============================
world.afterEvents.worldLoad.subscribe(async () => {
  let title = `**✅｜サーバー起動**`;
  const embedData = {
    title: title,
    color: 0x0000ff,
    timestamp: new Date().toISOString(),
  };
  const message = {
    content: "",
    embeds: [embedData],
  };
  sendDiscordMessage(message);
});

world.afterEvents.chatSend.subscribe(async (eventData) => {
  let player = eventData.sender.name;
  const message = {
    content: `<${player}> ${eventData.message}`,
  };
  sendDiscordMessage(message);
});

world.afterEvents.playerJoin.subscribe(async (eventData) => {
  let player = eventData.playerName;
  let title = `**🚪｜${player}がサーバーに参加しました**`;
  const embedData = {
    title: title,
    color: 0x87ceeb, // 空色
    timestamp: new Date().toISOString(),
  };
  const message = {
    content: "",
    embeds: [embedData],
  };
  sendDiscordMessage(message);
});

world.afterEvents.playerLeave.subscribe(async (eventData) => {
  let player = eventData.playerName;
  let title = `**👋｜${player}がサーバーから退出しました**`;
  const embedData = {
    title: title,
    color: 0xffa500, // オレンジ色
    timestamp: new Date().toISOString(),
  };
  const message = {
    content: "",
    embeds: [embedData],
  };
  sendDiscordMessage(message);
});

// ============================
// Discordからのメッセージ取得
// ============================
const messageURL = `https://discord.com/api/v10/channels/${channelID}/messages`;
let lastMessageID = null;
let i = 0;

async function handleNewMessages() {
  const url = lastMessageID
    ? `${messageURL}?after=${lastMessageID}`
    : messageURL;
  const req = new HttpRequest(url);
  req.method = HttpRequestMethod.Get;
  req.headers = [new HttpHeader("Authorization", `Bot ${botToken}`)];
  const response = await http.request(req);
  const messages = JSON.parse(response.body);
  messages.forEach((message) => {
    if (!message.author.bot && i !== 0) {
      if (message.referenced_message) {
        let messageAuthor = message.referenced_message.author;
        world.sendMessage(
          `§l|⁻⁻§r§b[${
            messageAuthor.global_name || messageAuthor.username
          }] §f${message.referenced_message.content}\n§b[${
            messageAuthor.global_name || messageAuthor.username
          }] §f${message.content}`
        );
      } else {
        if (message.content.startsWith("runCommand!")) {
          try {
            const command = message.content.slice("runCommand!".length);
            if (command == "list") {
              const players = world.getAllPlayers();
              const playerNames = players.map((p) => p.name).join(", ");
              console.log(playerNames);
              sendDiscordMessage({
                content: `計${players.length}人のプレイヤーが接続中！: ${playerNames}`,
              });
            } else {
              world.getDimension("overworld").runCommand(command);
              // 結果をワールドに送信
              sendDiscordMessage({
                content: `success!!`,
              });
            }
          } catch (err) {
            sendDiscordMessage({
              content: `コマンド送信時に以下のエラーが発生しました！\n\`\`\`\n${err}\n\`\`\``,
            });
          }
        } else {
          world.sendMessage(
            `§b[${message.author.global_name || message.author.username}] §f${
              message.content
            }`
          );
        }
      }
    }
  });

  if (messages.length > 0) {
    lastMessageID = messages[0].id;
  }
  i++;
}

system.runInterval(() => {
  handleNewMessages();
}, 20);
