const { DynamoDBClient, QueryCommand, ScanCommand  } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Article";

exports.handler = async (event, context) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "" }),
    };
    
    if(event.headers.authorization !== "mtiToken") {
        response.statusCode = 401;
        response.body = JSON.stringify({
            message:
            "ログインを完了してください。",
        });
        return response;
    }
    
    const userId = event.queryStringParameters ? event.queryStringParameters.userId : null;
    const category = event.queryStringParameters ? event.queryStringParameters.category : null;
    const start = event.queryStringParameters ? event.queryStringParameters.start : null;
    const end = event.queryStringParameters ? event.queryStringParameters.end : null;
    
    //  全検索(ScanCommand)
    if (!userId && !category && !start && !end) {
        const param = {
            TableName,
            Limit:100,
        }
        const command = new ScanCommand(param);
        
        try {
            // client.send()で全件取得するコマンドを実行
            const Articles = (await client.send(command)).Items;
            console.log(Articles)
            
            //TODO: レスポンスボディを設定する
            const unmarshalledArticlesItems = Articles.map((item) => unmarshall(item));
            unmarshalledArticlesItems.sort((a, b) => b.timestamp - a.timestamp);
            response.body = JSON.stringify({ articles: unmarshalledArticlesItems });
        } catch (e) {
            console.error(e);
            response.statusCode = 500;
            response.body = JSON.stringify({
                message: "予期せぬエラーが発生しました。",
                errorDetail: e.toString(),
            });
        }
        
        return response;
    }
    
    //  条件付き検索 
    else {
        let param = {
            TableName,
            Limit: 100,
        };
        
        let expressionAttributeValues = {};
        let filterExpressionArr = [];
        let expressionAttributeNames = {};
        
        if (userId) {
            param.KeyConditionExpression = "userId = :uid";
            expressionAttributeValues[":uid"] = userId;
        }
        
        if (category) {
            filterExpressionArr.push("category = :cat");
            expressionAttributeValues[":cat"] = category;
        }
        
        if(start && end) {
            param.KeyConditionExpression += " AND #ts BETWEEN :start AND :end";
            expressionAttributeNames["#ts"] = "timestamp";
            expressionAttributeValues[":start"] = parseInt(start);
            expressionAttributeValues[":end"] = parseInt(end);
        }
        
        if (filterExpressionArr.length > 0) {
            param.FilterExpression = filterExpressionArr.join(' AND ');
        }
        
        param.ExpressionAttributeValues = marshall(expressionAttributeValues);
        
        if (Object.keys(expressionAttributeNames).length > 0) {
            param.ExpressionAttributeNames = expressionAttributeNames;
        }
      
      const command = new QueryCommand(param);
        
        try {
            // client.send()で全件取得するコマンドを実行
            const Articles = (await client.send(command)).Items;
            console.log(Articles)
            
            //TODO: レスポンスボディを設定する
            const unmarshalledArticlesItems = Articles.map((item) => unmarshall(item));
            unmarshalledArticlesItems.sort((a, b) => b.timestamp - a.timestamp);
            response.body = JSON.stringify({ users: unmarshalledArticlesItems });
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
}