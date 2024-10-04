const Utils = require('./modules/utils');
const HttpServer = require('./modules/http-server');
const LocalizationHelper = require('./helpers/localization.helper');
const fs = require('fs');
const path = require('path');

class App {
    static dictionary = new Dictionary();
    static requestCount = 0;

    static start() {
        const app = new HttpServer();

        app.use(this.incrementRequestCount);

        app.post('/api/definitions', (req, res) => {
            try {
                const body = JSON.parse(req.body);
                this.dictionary.addBatch(body);
                res.status(201).send("Entry created");
            } catch (e) {
                res.status(400).send(e);
            }
        });

        app.get('/api/definitions', (req, res) => {
            const key = req.queryParams.word;

            try {
                const definition = this.dictionary.read(key);
                res.status(200).send(definition);
            } catch (e) {
                res.status(400).send(e);
            }
        });

        app.listen(app.DEFAULT_PORT, () => {
            console.log(`Server listening on port ${app.DEFAULT_PORT}`);
        });
    }

    static incrementRequestCount() {
        this.requestCount++;
    }
}

App.start();