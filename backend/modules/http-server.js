const http = require('http');
const url = require('url');
const Request = require('../models/request');
const Response = require('../models/response');
const LocalizationHelper = require('../helpers/localization.helper');

class HttpServer {
    DEFAULT_PORT = 3000;

    constructor() {
        this.routes = {};
    }

    // Public Methods
    get(endpoint, callback) {
        this.routes[endpoint] = {
            endpoint: endpoint,
            method: 'GET',
            callback
        };
    }

    listen(port = this.DEFAULT_PORT, callback) {
        const server = this._createServer();
        server.listen(port, callback);
    }

    // Private methods
    _createServer() {
        return http.createServer((req, res) => {
            // Wrap the raw incoming and outgoing messages in custom Request and Response objects
            const request = this._parseRequest(req);
            const response = new Response(request, res);

            const route = request.route;

            if (route && req.method === route.method) {
                route.callback(request, response);
            } else {
                response.status(404).send(LocalizationHelper.getTranslation('ErrorMessages.EndpointNotFound'));
            }
        });
    }

    _parseRequest(req) {
        // Get the route
        const parsedUrl = url.parse(req.url, true);
        const route = this._matchRoute(parsedUrl.pathname);

        // Get the query params
        const queryParams = parsedUrl.query;

        // Get the url params
        let urlParams;
        if (!route) {
            urlParams = null;
        } else {
            urlParams = this._parseUrlParams(route.endpoint, parsedUrl.pathname);
        }

        return new Request(req.method, req.url, route, req.headers, queryParams, urlParams);
    }

    _matchRoute(actualUrl) {
        const actualUrlParts = actualUrl.split('/').filter(Boolean);

        // Try to find a matching route based on the static part (all parts that don't start with ':')
        for (let route in this.routes) {
            const routeParts = route.split('/').filter(Boolean);
            const numStaticRouteParts = routeParts.filter(part => !part.includes(':')).length;

            let isMatch = true;
            for (let i = 0; i < numStaticRouteParts; i++) {
                if (routeParts[i] !== actualUrlParts[i]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return this.routes[route];
            }
        }

        return null;  // No matching route found
    }

    _parseUrlParams(route, actualUrl) {
        // filter(Boolean) removes any falsy/empty values
        const routeParts = route.split('/').filter(Boolean);
        const urlParts = actualUrl.split('/').filter(Boolean);

        if (routeParts.length !== urlParts.length) {
            return null;  // Route does not match
        }

        const params = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                // This part is a parameter, extract it
                const paramName = routeParts[i].slice(1);  // Remove the ":"
                params[paramName] = urlParts[i];
            } else if (routeParts[i] !== urlParts[i]) {
                // This part does not match, return null
                return null;
            }
        }

        return params;
    }
}

module.exports = HttpServer;