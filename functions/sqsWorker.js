const AWS = require("aws-sdk");
const StepFunction = new AWS.StepFunctions();
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})

const updateBookQuantity = async(bookId, orderQuantity) => {
    console.log("bookId: ", bookId)
    console.log("orderQuantity: ", orderQuantity)
    let params = {
        TableName: 'bookTable',
        Key: {'bookId': bookId},
        UpdateExpression: "SET quantity = quantity - :orderQuantity",
        ExpressionAttributeValues: {
            ":orderQuantity": orderQuantity
        }
    }
    await DocumentClient.update(params).promise();
}

module.exports.handler = async (event) => {
    try {
        console.log("SQS Worker ", event)
        let record = event.Records[0]
        var body = JSON.parse(record.body)
        let courier = "satyasatya123456@gmail.com"
        await updateBookQuantity(body.Input.bookId, body.Input.quantity);

        await StepFunction.sendTaskSuccess({
            output: JSON.stringify({courier}),
            taskToken: body.Token
        }).promise();
    } catch (err) {
        console.log("Error generated ", err)
        await StepFunction.sendTaskFailure({
            error: "NoCourierAvailable",
            cause: "No couriers are available",
            taskToken: body.Token
        }).promise()
    }
}