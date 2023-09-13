const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const User_TableName = "Team3-app-user";
var eat_count = 1;

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const userId = event.queryStringParameters.userId;
  const token = event.queryStringParameters.token;
  
  const param_User = {
    TableName: User_TableName,
    Key: marshall({
      userId,
    }),
  };

  const command_User = new GetItemCommand(param_User);

  try {
    
    const result_User = await client.send(command_User);
    const User = result_User.Item;

    const unmarshalledUserItem = unmarshall(User);
    
    const season = unmarshalledUserItem.season;
    
    
    response.body = JSON.stringify({ 
      user: unmarshalledUserItem,
    });

  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }
  

  return response;
};
