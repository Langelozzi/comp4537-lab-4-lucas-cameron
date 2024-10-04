const Utils = require('./modules/utils');
const HttpServer = require('./modules/http-server');
const LocalizationHelper = require('./helpers/localization.helper');
const fs = require('fs');
const path = require('path');

class Server {
    static start() {
        const server = new HttpServer();

        server.get('/getDate', (req, res) => {
            const name = req.queryParams.name ?? '';
            const message = LocalizationHelper.getTranslation('Messages.GetDate', [name, Utils.getDate()]);

            res.status(200).send(`
                <span style="color: blue;">
                    ${message}
                </span>
            `)
        })

        server.get('/writeFile', (req, res) => {
            const filePath = 'file.txt'

            let text = req.queryParams.text;
            const newLine = req.queryParams.newLine;

            if (newLine) {
                text = `\n${text}`;
            }

            res.setHeader('Content-Type', 'text/plain');

            fs.appendFile(filePath, text, (err) => {
                if (err) {
                    res.status(500).send(LocalizationHelper.getTranslation('ErrorMessages.ErrorWritingFile', [filePath, err]));
                } else {
                    res.status(200).send(LocalizationHelper.getTranslation('Messages.FileWritten', [filePath]));
                }
            })
        })

        server.get('/readFile/:fileName', (req, res) => {
            const fileName = req.urlParams.fileName;
            const filePath = path.join(__dirname, fileName);

            res.setHeader('Content-Type', 'text/plain');

            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    res.status(404).send(LocalizationHelper.getTranslation('ErrorMessages.FileNotFound', [fileName, err]));
                } else {
                    res.status(200).send(data);
                }
            })
        })

        server.listen(server.DEFAULT_PORT, () => {
            console.log(`Server listening on port ${server.DEFAULT_PORT}`);
        });
    }
}

Server.start();