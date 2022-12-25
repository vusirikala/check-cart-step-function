

module.exports.handler = async (event) => {
    console.log("Billed customer ", event)
    return "Successfully billed"
}