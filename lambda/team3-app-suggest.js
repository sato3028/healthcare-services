const { DynamoDBClient, ScanCommand, GetItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const Log_TableName = "Team3-app-post";
const Foods_TableName = "Food";
const User_TableName = "Team3-app-user";
var eat_count = 1;
var totalNutrition = {
  calcium: 0,
  carbohydrates: 0,
  energy: 0,
  iron: 0,
  lipid: 0,
  protain: 0,
  vitamin_d: 0
};

function calc_nutrition(eat_item, foods) {
  var nutrientData = {
    calcium: 0,
    carbohydrates: 0,
    energy: 0,
    iron: 0,
    lipid: 0,
    protain: 0,
    vitamin_d: 0
  };

  const food = foods.find(f => f.foodId === eat_item.foodId);
  if (!food) return;

  Object.keys(nutrientData).forEach((key) => {
    nutrientData[key] += (food[key] / 100 * eat_item.weight);
    totalNutrition[key] += nutrientData[key];
  });

  console.log(nutrientData);
  return nutrientData;
}

function to_day(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const formattedDate = new Date(year, month, day);
  return formattedDate;
}

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

  const param_Log = {
    TableName: Log_TableName,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: userId }
    }
  };
  
  const param_User = {
    TableName: User_TableName,
    Key: marshall({
      userId,
    }),
  };

  const param_Food = {
    TableName: Foods_TableName,
  };

  const command_Log = new QueryCommand(param_Log);
  const command_User = new GetItemCommand(param_User);
  const command_Food = new ScanCommand(param_Food);

  try {
    const result_Log = await client.send(command_Log);
    const Log = result_Log.Items;

    const result_User = await client.send(command_User);
    const User = result_User.Item;

    const result_Foods = await client.send(command_Food);
    const Foods = result_Foods.Items;

    const unmarshalledLogItems = Log.map(item => unmarshall(item));
    const unmarshalledUserItem = unmarshall(User);
    const unmarshalledFoodItems = Foods.map((item) => unmarshall(item));

    const season = unmarshalledUserItem.season;

    if (season == 1 || season == 2) {
      eat_count = 2;
    } else if (season == 3) {
      eat_count = 3;
    } else if (season == 4) {
      eat_count = 4;
    };

    console.log(eat_count);
    
    unmarshalledLogItems.forEach(logItem => {
      if (logItem.histories) {
        logItem.histories.forEach(item => {
          calc_nutrition(item, unmarshalledFoodItems);
        });
      }
    });

    response.body = JSON.stringify({
      logs: unmarshalledLogItems,
      user: unmarshalledUserItem,
      foods: unmarshalledFoodItems,
      totalNutrition: totalNutrition
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
