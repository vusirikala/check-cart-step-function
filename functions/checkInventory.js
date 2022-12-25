const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})

const isBookAvailable = (book, quantity) => {
    return book.quantity > quantity;
}

module.exports.handler = async({bookId, quantity}) => {
    try {
        let params = {
            TableName: 'bookTable',
            KeyConditionExpression: 'bookId = :bookId',
            ExpressionAttributeValues: {
                ":bookId": bookId
            }
        }
        let result = await DocumentClient.query(params).promise();
        let book = result.Items[0];
        if (isBookAvailable(book, quantity))
            return book;
        else {
            let bookOutOfStockError = new Error("The book is out of stock")
            bookOutOfStockError.name = "BookOutOfStock"
            throw bookOutOfStockError
        } 
    } catch (err) {
        if (err.name === 'BookOutOfStock') {
            throw err;
        } else {
            let bookNotFoundError = new Error(err);
            bookNotFoundError.name = 'BookNotFound';
            throw bookNotFoundError;
        }
    }  
}
