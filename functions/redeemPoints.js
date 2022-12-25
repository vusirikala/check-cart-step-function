const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})

const deductPoints = async (userId) => {
    try {

        let params = {
            TableName: 'userTable',
            Key: {'userId': userId},
            UpdateExpression: 'SET points = :zero', 
            ExpressionAttributeValues: {
                ":zero": 0
            }
        }
        await DocumentClient.update(params).promise();
    } catch (err) {
        throw new Error(err);
    }
}

module.exports.handler = async ({userId, total}) => {
    let orderTotal = total.total
    try {
        let params = {
            TableName: 'userTable',
            Key: {
                'userId': userId
            }
        }
        let result = await DocumentClient.get(params).promise();
        let user = result.Item;
        const points = user.points;
        if (orderTotal > points) {
            await deductPoints(userId);
            orderTotal = orderTotal - points
            return {total: orderTotal, points}
        } else {
            throw new Error("Order total is less than redeem points")
        }
    } catch (err) {
        throw new Error(err);
    }
}