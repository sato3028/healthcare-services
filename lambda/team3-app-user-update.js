const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Team3-app-user";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  if (event.headers.authorization !== "mtiToken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });

    return response;
  }
  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.userId || !body.dislike || !body.name || !body.password || !body.season) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });
  };

  const { userId, dislike, name, password, season } = body;

  // TODO: paramに更新対象のテーブル名と更新内容を記述
  const param = {
    TableName,
    Item: marshall({
      userId, // userId: userIdと同じ意味
      dislike,
      name, 
      password, 
      season,
    }),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.body = JSON.stringify({  userId, dislike, name, password, season  });
    // TODO: 更新に成功した場合の処理を記述(response bodyを設定する)
  }
  catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
  
}