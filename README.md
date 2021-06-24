## 内容

Booth で見つけた「5 日で構築する！？AWS Lambda と Vue.js でつくる位置情報付きの旅行記録サイト」

https://booth.pm/ja/items/2366464

## きっかけ

「個人開発・スタートアップで採用すべき最強のアーキテクチャを考えた」の記事で、Lambda は勉強すべきと考えたため。

https://zenn.dev/yuno_miyako/articles/19201dcb19ff6b6ffc59

## メモ

### lambda-multipart-parser

Lambda 上で multipart/form-data 形式の データを受信してパースするためのライブラリ。

### uuid

UUID を生成するためのライブラリ、画像ファイルの設定に使う。

### aws-sdk

Node.js から AWS の操作を行うため の SDK です。
DynamoDB や S3 へアクセスするため必要です。
aws-sdk 自体は Lambda 環境であれば環境内にビルトインされているため、開発時のみ必要です。
