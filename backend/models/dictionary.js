const DuplicateKeyError = require("./DuplicateKeyError")
const NoKeyError = require('../models/NoKeyError')
const LocalizationHelper = require("../helpers/localization.helper")
class Dictionary {
    constructor() {
        this.dictionary = {};
    }

    add(key, value) {
        if (key in this.dictionary) {
            throw new DuplicateKeyError(`Warning! '${key}' already exists in dictionary.`);
        }

        this.dictionary[key] = value;
    }

    // addBatch(entries) {
    //     // TODO: Add logic to handle when one fails, don't immediately return, store errors, and keep going
    //     for (const [key, value] of Object.entries(entries)) {
    //         this.add(key, value);
    //     }
    // }

    read(key) {
        if (!(key in this.dictionary)) {
            throw new NoKeyError(LocalizationHelper.getTranslation("ErrorMessages.KeyNotFound", [key]));
        }

        return this.dictionary[key];
    }
}
module.exports = Dictionary;
