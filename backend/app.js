const Utils = require('./modules/utils');
const HttpServer = require('./modules/http-server');
const LocalizationHelper = require('./helpers/localization.helper');
const fs = require('fs');
const path = require('path');

class App {
    static dictionary = new Dictionary();
    static requestCount = 0;

    static start() {
        const server = new HttpServer();

        server.post('/api/definitions', (req, res) => {
            try {
                const body = JSON.parse(req.body);
                this.dictionary.addBatch(body);
            } catch (e) {
                res.status(400).send(e);
            }
        })

        server.listen(server.DEFAULT_PORT, () => {
            console.log(`Server listening on port ${server.DEFAULT_PORT}`);
        });
    }
}

App.start();