const { DynamoDBClient, ScanCommand, GetItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const Log_TableName = "Team3-app-post";
const Foods_TableName = "Food";
const User_TableName = "Team3-app-user";
const targetDate = new Date();
targetDate.setHours(0, 0, 0, 0);
const targetTimestamp = targetDate.getTime();
var eat_count = 1;

const perfectNutrition = {
  calcium: 250,
  carbohydrates: 1000,
  energy: 650.0,
  iron: 3.5,
  lipid: 260,
  protain: 15,
  vitamin_d: 5.0
};


function calc_nutrition(eat_item, foods, totalNutrition) {
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
  
  var totalNutrition = {
    calcium: 0,
    carbohydrates: 0,
    energy: 0,
    iron: 0,
    lipid: 0,
    protain: 0,
    vitamin_d: 0
  };
  
  var Nutrition_flg = {
    calcium: false,
    carbohydrates: false,
    energy: false,
    iron: false,
    lipid: false,
    protain: false,
    vitamin_d: false
  };

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
    
    unmarshalledLogItems.forEach(logItem => {
      // 同じ日付のものだけを処理
      const logDate = to_day(logItem.timestamp);
      const logTimestamp = logDate.getTime();
      if (logTimestamp === targetTimestamp) {
        if (logItem.histories) {
          logItem.histories.forEach(item => {
            calc_nutrition(item, unmarshalledFoodItems, totalNutrition);
          });
        }
      }
    });
    
    Object.keys(perfectNutrition).forEach((key) => {
      Nutrition_flg[key] = totalNutrition[key] < perfectNutrition[key];
    });
    
    const recommendedFoods = [];

    Object.keys(Nutrition_flg).forEach((key) => {
      if (Nutrition_flg[key]) {
        const lack = perfectNutrition[key] - totalNutrition[key];
        
        const currentSeason = unmarshalledUserItem.season;
        const acceptableFoods = unmarshalledFoodItems.filter(food => {
          console.log("dis" + unmarshalledUserItem.dislike);
          console.log("food" + food.name);
          console.log("TF" + !unmarshalledUserItem.dislike.includes(food.foodId));
          return (!unmarshalledUserItem.dislike || !unmarshalledUserItem.dislike.includes(food.foodId)) &&
                 food[`sg_${key}`] !== 0 &&
                 food[`Season${currentSeason}`] === "1";
        });
    
        acceptableFoods.sort((a, b) => a[`sg_${key}`] - b[`sg_${key}`]);
        
        const topFoods = acceptableFoods.slice(0, 2).map(food => {
          const weightNeeded = lack / (food[key] / 100);
          
          return {
            name: food.name,
            weight: weightNeeded.toFixed(2)
          };
        });
    
        const recommendation = {
          nutrition: key,
          lack
        };
    
        if (topFoods[0]) {
          recommendation.food1 = topFoods[0];
        }
    
        if (topFoods[1]) {
          recommendation.food2 = topFoods[1];
        }
    
        recommendedFoods.push(recommendation);
      }
    });

    response.body = JSON.stringify({
      suggestion: recommendedFoods,
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
