// 各種ライブラリを初期化しています
const parser = require('lambda-multipart-parser');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Lambdaの関数実行時はhandlerが呼び出されるので、その中に処理を登録します
exports.handler = async (event, context) => {
  // lambda-multipart-parserにeventを渡す。このeventの中に今回のリクエスト内容が含まれる。そのままパーサーに渡すことで解析する。
  let result = await parser.parse(event);

  /********************************************************/
  // S3へのアップロード処理
  let image = '';
  // パースした結果の中にファイルが含まれていれば処理を行う
  if (result.files) {
    // S3のクライアントを初期化
    const S3 = new AWS.S3();

    // ファイルが含まれているオブジェクトをループで回す
    for (let file of result.files) {
      // ファイル名に使用する UUID を取得
      let uuid = uuidv4();

      // アップロード先の パスとオブジェクト名を組み立てる
      image = `image/${uuid}${path.extname(file.filename)}`;

      // そのファイルをputObjectを利用して非同期(Promise)でアップロード
      await S3.putObject({
        Body: file.content,
        Bucket: 'aws-lambda-vue-travel-record-site',
        Key: image,
        ContentType: file.contentType,
      }).promise();
    }
  }
  /********************************************************/

  /********************************************************/
  // DynamoDBへ書き込む準備
  // DocumentClientと呼ばれる、簡易的に利用可能なクライアント
  const dynamo = new AWS.DynamoDB.DocumentClient();

  // リクエスト内容とDynamoDBに登録する内容をマッピング
  const item = {
    note_id: 'main_note', // プライマリキー（ユニークである必要がある）
    datetime: Math.floor(Date.now() / 1000), // ソートキー（PKにソートキーの組み合わせでユニークとなる）
    text: result.text,
    lat: result.lat,
    lon: result.lon,
    image: image,
  };
  const param = {
    TableName: 'locnote',
    Item: item,
  };
  /********************************************************/

  /********************************************************/
  // DynamoDBへ書き込む
  await dynamo.put(param).promise();
  /********************************************************/

  // レスポンスとして返す
  return item;
};
