const http = require("http");

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    let requestBody = '';
    req.on('data', chunk => {
        requestBody += chunk;
    });
    req.on('end', () => {
        console.log("requestListener end", requestBody); // 'Buy the milk'

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
        } else {
            res.setHeader("Content-Type", "application/json");

            let code = 'OK'
            let data = {}
            if (req.url === '/testGet') {
                data = {
                    "a": "b",
                    "b": 123,
                    "c": 456.789,
                    "d": false,
                    "m": "GET"
                }
            } else if (req.url === '/testPost') {
                data = {
                    "a": "b",
                    "b": 123,
                    "c": 456.789,
                    "d": false,
                    "m": "POST"
                }
            } else {
                data = {
                    "m": req.method,
                    "u": req.url,
                    "b": requestBody,
                }
            }

            res.writeHead(200);
            res.end(JSON.stringify({code: code, data: data}));
        }
    });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http` + `://${host}:${port}`);
});
