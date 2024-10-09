const fs = require('fs');
const path = require('path');
const HttpServer = require('./modules/http-server');
const Dictionary = require('./models/dictionary');
const DuplicateKeyError = require('./models/DuplicateKeyError')
const LocalizationHelper = require("./helpers/localization.helper");
const NoKeyError = require('./models/NoKeyError');


class App {
    static dictionary = new Dictionary();
    static requestCount = 0;

    static start() {
        const app = new HttpServer();

        app.use(this.incrementRequestCount.bind(this));
        app.cors(["http://127.0.0.1:8080"]);

        app.post('/api/definitions', (req, res) => {
            try {
                const body = JSON.parse(req.body);
                const key = Object.keys(body)[0]
                const value = Object.values(body)[0]

                this.dictionary.add(key, value);

                const response = {
                    requestNum: this.requestCount,
                    created: `${key}: ${value}`,
                    message: LocalizationHelper.getTranslation("Messages.addedWord", [key])
                };

                res.status(201).json(response);
            } catch (e) {

                let response = {};

                if (e instanceof DuplicateKeyError) {
                    response.errorCode = e.errorCode;
                }

                response = {
                    ...response,
                    requestNum: this.requestCount,
                    message: e.message
                }; res.status(400).json(response);
            }

        });

        app.get('/api/definitions', (req, res) => {
            const key = req.queryParams.word;

            try {
                const definition = this.dictionary.read(key);

                const response = {
                    requestNum: this.requestCount,
                    word: key,
                    definition: definition,
                    message: LocalizationHelper.getTranslation("Messages.keyFound", [key, definition])
                };

                res.status(200).json(response);
            } catch (e) {

                let response = {};

                if (e instanceof NoKeyError) {
                    response.errorCode = e.errorCode;
                }

                response = {
                    ...response,
                    requestNum: this.requestCount,
                    message: e.message
                }; res.status(400).json(response);
            }
        });

        app.listen(3001, () => {
            console.log(`Server listening on port ${app.DEFAULT_PORT}`);
        });
    }

    static incrementRequestCount() {
        this.requestCount++;
    }
}

App.start();
