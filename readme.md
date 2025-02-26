# 統合版マインクラフトとdiscordの相互通信ツール(アドオン)
## 概要
2025/02/20　動作確認済み。
サーバー起動やログイン、ちゃっと送受信データをdiscordとBEマイクラサーバーの相互通信します。

## 使い方
### アドオンの準備
1. [release note](https://github.com/Hoshimikan6490/MCBE-and-Discord-Connect-Tool/releases)から、最新版のzipファイルをダウンロードする。
2. ダウンロードしたzipファイルを展開する。
3. [Discordの開発者ポータル](https://discord.com/developers/applications)でBOTのtokenを生成する。(詳しい方法はご自身でお調べ頂くか、[元動画](https://youtu.be/VXPT7evGisc)をご覧ください。)
4. このシステムで連携したいDiscordサーバーにBOTを追加する。
5. 連携したいテキストチャンネルのチャンネルIDをコピーする。
6. 手順2で展開したファイルの`./scripts/env.js`を開き、`YOUR_DISCORD_BOT_TOKEN_HERE`を手順3で取得したtokenに置き換え、`1234567890`を手順5で取得したチャンネルIDに置き換える。そうすると、次のようになるはずである。

※なお、ここで表記したtokenは既に無効化済みの物であるが、一般的にアクティブなtokenは絶対に公開してはいけない。
```js
// ./scripts/env.js
const botToken = "KQxRadknWn3hop3X0AgXIoL71.SP8axcS8CR9kbVJrbeKI9wsgqef";
const channelID = "1344134143948230686";

export { channelID, botToken };
```
7. `manifest.json`と`scripts`フォルダを選択して、zip圧縮する。
8. 圧縮すると恐らく`manifest.zip`になると思うので、`BEDiscord.mcpack`等と名前を変える。(拡張子を変える)
9. 完成した`.mcpack`ファイルを統合版Minecraftで起動し、正常にインポート出来たことを確認する。

### ワールドデータの準備
10. 統合版Minecraftのワールド生成画面に移動し、「ビヘイビアーパック」の「利用可能」の中にある「BEDiscord」の右のボタン「有効化」を押す。
11. 同様に「実験」の中にある「ベータAPI」と言う項目をON（緑色の状態）に設定する。(この後生成するワールドがマルチプレイで利用するワールドになるため、適切にPVPなどその他のワールド設定も行ってください。)
12. ワールドの設定が終わったらワールドの生成を実行し、ワールドに入れることを確認したら、一度ワールドから抜ける。
13. 統合版Minecraft内のワールド設定編集画面から「一般」の中の「世界をエクスポートする」を選択し、任意のフォルダに保存する。
14. 保存すると、`(ワールド名).mcworld`というファイルが作成されるので、`(ワールド名).zip`のように拡張子を変更して、zipファイルを展開する。展開すると、以下のようなフォルダ構成になっているはずである。なお、バグ防止のため、この手順14以降使用する「(ワールド名)」には英語か数字を使用する事をお勧めする。
```
(ワールド名)
　┣━ behavior_packs
　┃　┗━ BEDiscord
　┃　　　┣━ scripts
　┃　　　┃　┣━ env.js
　┃　　　┃　┗━ index.js
　┃　　　┗━ manifest.json
　┣━ db
　┃　┗━ (様々なLDBファイルやテキストファイルなど)
　┣━ level.dat
　┣━ level.dat_old
　┣━ levelname.txt
　┣━ world_behavior_pack_history.json
　┣━ world_behavior_packs.json
　┣━ world_icon.jpeg
　┗━ world_resource_packs.json
```

### 統合版サーバーの準備
15. [Minecraft公式のサーバーファイル配布ページ](https://www.minecraft.net/ja-jp/download/server/bedrock)に移動し、最新版のサーバーファイルをダウンロードする。(サーバーを立てるOSに合わせた物を選んでダウンロードしてください。プレビュー版である必要はありません。)
16. ダウンロードしたサーバーファイルのzipファイルを展開する。
17. 展開したファイル群の中にある`bedrock_server.exe`をダブルクリックして起動する。(起動時にWindowsのファイアウォールの許可が求められる場合がある。その場合は許可を選択する。拒否した場合、正常にサーバーの機能が動作しない場合がある。)
18. 手順16のexeファイルを起動すると黒い画面が表示され、色々出てくるので、表示が止まるまでしばらく待ち、止まったら「stop」と入力してEnterキーを押す。黒い画面が勝手に消えるはずである。(この時、展開したファイル群の中に必要なファイルやフォルダが作成される。)
19. 「ワールドデータの準備」で作成したワールドデータが入ったフォルダをサーバーのファイル群の中の「worlds」と言うフォルダに移動する。なお、既にある「Bedrock level」と言うフォルダは、使わないデータなので、消しても構わない。
20. アドオンと先ほど作成したワールドデータを使用するために以下のようにファイルを編集します。

#### server.properties
手順19で移動した、`worlds/`の下のフォルダ名を入力する。また、手順11で行った設定と同じ内容をこのファイルにも行う。存在しない項目は設定不要である。
```diff
- level-name=test world
+ level-name=(ワールド名)
```
#### config/default/permissions.json
許可されたモジュールに、`@minecraft/server-net`を追加する。jsonというファイル形式の都合上、`"@minecraft/server-editor"`の後にカンマを入れ忘れないように注意する事。
```diff
{
  "allowed_modules": [
    "@minecraft/server-gametest",
    "@minecraft/server",
    "@minecraft/server-ui",
    "@minecraft/server-admin",
-   "@minecraft/server-editor"
+   "@minecraft/server-editor",
+   "@minecraft/server-net"
  ]
}
```
21. 各種設定が終わったら、再度`bedrock_server.exe`を再度起動すると、設定したDiscordサーバーのチャンネルにサーバーの起動通知が送信されるはずである。そうすれば準備は完了だ。

## トラブルシューティング
### 「requesting invalid module version [@minecraft/server - ○.○.○-beta].」と表示されます。
このエラーメッセージの下に使用可能な「@minecraft/server」パッケージのバージョンが表示されます。その中から「○.○○.○-beta」と書かれているバージョンを探し、manifest.jsonの
```json
    {
      "module_name": "@minecraft/server",
      "version": "○.○○.○-beta"
    },
```
の部分を編集してください。

## 謝辞
本アドオンは、[Naque / ナク (@naque79)](https://youtube.com/@naque79)さんが公開された以下の動画「 [【マインクラフト統合版】統合版のサーバーとDiscordのチャットを連携する方法を解説！](https://youtu.be/VXPT7evGisc)」で配布されているアドオンを最終編集時点の最新バージョンの統合版サーバーとDiscordサーバー間で通信できるように修正した物です。本コードに関するお問い合わせは、[本リポジトリのissue](https://github.com/Hoshimikan6490/MCBE-and-Discord-Connect-Tool/issues)や[Hoshimikan6490のお問い合わせフォーム](https://forms.gle/E5Pt7YRJfVcz4ZRJ6)からどうぞ。元動作のコメント欄へこのリポジトリの内容に関するお問い合わせをする行為はご遠慮ください。
[![本コードの元となったアドオンの動画](http://img.youtube.com/vi/VXPT7evGisc/0.jpg)]([https://www.youtube.com/watch?v={video-id}](https://youtu.be/VXPT7evGisc))

## 変更履歴
[release note](https://github.com/Hoshimikan6490/MCBE-and-Discord-Connect-Tool/releases)をご覧ください。

## ライセンス関連情報
このコードは、元動画のライセンスを継承し、__**非商用利用に限り**__、改造・無改造に関わらず二次配布を許可します。なお例えば、生徒が受講料を支払って参加するプログラミング教室などは商用利用とみなします。可能であれば元動画のアップロードチャンネルや本リポジトリのURLなどの明記をお願い致します。また、本コードを改造された場合はぜひ[Hoshimikan6490のお問い合わせフォーム](https://forms.gle/E5Pt7YRJfVcz4ZRJ6)や[Hoshimikan6490のTwitter](https://twitter.com/hoshimikan6490)からお知らせください。今後の開発の参考にさせて頂きます。
