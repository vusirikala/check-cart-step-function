

module.exports.handler = async ({book, quantity}) => {
    let total = book.price * quantity;
    return {total};
}