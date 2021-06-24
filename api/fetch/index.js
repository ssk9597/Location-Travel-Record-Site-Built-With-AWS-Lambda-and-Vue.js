// 各種ライブラリを初期化しています
const AWS = require('aws-sdk');

// Lambdaの関数実行時はhandlerが呼び出されるので、その中に処理を登録します
exports.handler = async (event, context) => {
  // DocumentClientと呼ばれる、簡易的に利用可能なクライアント
  const dynamo = new AWS.DynamoDB.DocumentClient();

  // リクエスト時のパラメータ
  const params = {
    // テーブル名
    TableName: 'locnote',
    // 抽出条件（keyはnote_id, valueはmain_note）
    KeyConditionExpression: 'note_id = :k',
    ExpressionAttributeValues: { ':k': 'main_note' },
    // 並び順。デフォルトでは昇順。古い投稿が先頭に出てくるためにfalseで降順とする。
    ScanIndexForward: false,
  };

  // データを取得する
  const result = await dynamo.query(params).promise();

  return { result };
};
