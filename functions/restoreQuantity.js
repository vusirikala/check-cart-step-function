
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})

module.exports.handler = async({bookId, quantity}) => {
    let params = {
        TableName: 'bookTable',
        Key: {bookId: bookId},
        UpdateExpression: "SET quantity = quantity - :orderQuantity",
        ExpressionAttributeValues: {
            ":orderQuantity": quantity
        }
    }
    await DocumentClient.update(params).promise();
    return "Quantity restored"
}