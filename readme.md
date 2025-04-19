# MCBE-and-Discord-Connect-Tool
## 概要
本リポジトリは、[Naque / ナク (@naque79)](https://youtube.com/@naque79)さんが公開された以下の動画「 [【マインクラフト統合版】統合版のサーバーとDiscordのチャットを連携する方法を解説！](https://youtu.be/VXPT7evGisc)」で配布されているアドオンを最終編集時点の最新バージョンの統合版サーバーとDiscordサーバー間で通信できるように修正したアドオンと、それの活用を支援するdiscord BOTのリポジトリです。

## 注意事項
- 使用例のスクリーンショットは、アドオンとdiscord botの両方を使用した場合の表示です。それらの機能については、「アドオンとdiscord botの機能について」をご覧ください。
- 本アドオンは、「beta API」(旧GameTest API)を使用するため、実績解除が出来なくなります。予めご了承ください。
- 仕様上、実績解除や死亡ログはDiscordに転送出来ませんので、予めご了承ください。
- コントリビュートする場合は、次のコマンドを実行して「mcIDtoDiscordUserName.json」の変更をignoreしてください。
```console
git update-index --skip-worktree .\discord_bot\mcIDtoDiscordUserName.json
```

## 各種制限
- Discordにおける送信文字数などの上限は、Discordの仕様の通りです。
- Discordの埋め込みメッセージや画像ファイルは一切Discordに転送されません。

## アドオンとDiscord BOTの機能について

|                 | アドオンのみ | Discord BOTのみ | アドオンとDiscord BOTの両方 |
| --------------: | :---------: | :------------: | :------------------------: |
| サーバー起動通知 |      ✅      |      ❌      |             ✅             |
| サーバー停止通知 |      ❌      |      ✅      |             ✅             |
| メンバー参加通知 |      ✅      |      ❌      |             ✅             |
| メンバー退出通知 |      ✅      |      ❌      |             ✅             |
| メンバー退出通知 |      ✅      |      ❌      |             ✅             |
|   実績解除通知   |      ❌      |      ✅      |             ❌             |
| メンバー死亡通知 |      ✅      |      ❌      |             ✅             |
| サーバーステータス確認コマンド | ❌ |    ✅    |             ✅             |
| MCユーザー名置き換え機能 |  ❌  |      ✅      |             ✅             |
※ 実績解除は、アドオンを追加した時点でワールドが実績解除の対象外にされるため、通知以前に実績解除が出来ません。
※ 「MCユーザー名置き換え機能」とは、Discord BOTで事前に指定したDiscordのユーザー名と統合版マインクラフトのユーザー名のデータを元に、統合版マインクラフトから送信される全ての通知に含まれる統合版マインクラフトのユーザー名をDiscordのユーザー名に置き換えて送信することが出来ます。

## アドオンについて
アドオンの詳細については、[アドオンのREADME](/bedrock_addon/bedrock_addon_readme.md)をご覧ください。

## discord BOTについて
discord BOTの詳細については、[discord BOTのREADME](/discord_bot/discord_bot_readme.md)をご覧ください。

