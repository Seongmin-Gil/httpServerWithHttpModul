const http = require('http');

const users = [
    {
        id: 1,
        name: "Rebekah Johnson",
        email: "Glover12345@gmail.com",
        password: "123qwe",
    },
    {
        id: 2,
        name: "Fabian Predovic",
        email: "Connell29@gmail.com",
        password: "password",
    },
];

const posts = [
    {
        userID: 1,
        userName: "Rebekah Johnson",
        postingId: 1,
        postingTitle: "간단한 HTTP API 개발 시작!",
        postingContent: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현."
    },
    {
        userID: 1,
        userName: "Fabian Predovic",
        postingId: 2,
        postingTitle: "HTTP의 특성",
        postingContent: "Request/Response와 Stateless!!"
    },
    {
        userID: 3,
        userName: "new user 1",
        postingId: 3,
        postingImageUrl: "내용 1",
        postingContent: "sampleContent3"
    },
    {
        userID: 4,
        userName: "new user 2",
        postingId: 4,
        postingImageUrl: "내용 2",
        postingContent: "sampleContent4"
    }
];

const server = http.createServer();

function httpRequestListener(req, res) {
    const { url, method } = req;
    if (method === 'POST') {
        if (url === '/signUp') {
            let data = '';
            req.on('data', (body) => {
                data += body;
            });
            req.on('end', () => {
                const newUser = JSON.parse(data);
                users.push({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                });
                res.writeHead(200, { 'context-Type': 'application/json' });
                res.end(JSON.stringify({ "message":"userCreated" }));
            });
        }
    }
}

server.on('request', httpRequestListener);

server.listen(8000, '127.0.0.1', () => console.log('server is working~~~~'));