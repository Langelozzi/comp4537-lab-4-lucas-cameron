class DuplicateKeyError {
    errorCode = 1
    constructor(message) {
        this.message = message
    }
}
module.exports = DuplicateKeyError

