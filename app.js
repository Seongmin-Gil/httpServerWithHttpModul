const http = require('http');
const URL = require('url');

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
    const reqUrl = URL.parse(url, true);
    const searchId = reqUrl.pathname.slice(reqUrl.pathname.indexOf('/', 1) + 1); //입력받은 id
    const pathUrl = reqUrl.pathname.slice(0, reqUrl.pathname.indexOf('/', 1)); //입력한 url path
    //게시글 목록 조회
    if (method === 'GET') {
        if (url === '/posts') {
            res.writeHead(200, { "cotent-Type": "application/json" });
            res.end(JSON.stringify(posts));
        }
    }

    if (method === 'POST') {
        //회원가입 endPoint
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
                res.end(JSON.stringify({ "message": "userCreated" }));
            });
        }
        //게시글 등록 endPoint
        if (url === '/posting') {
            let postingData = '';
            req.on('data', (data) => {
                postingData += data;
            });
            req.on('end', () => {
                const newPosting = JSON.parse(postingData);
                posts.push({
                    userID: newPosting.userID,
                    userName: newPosting.userName,
                    postingId: newPosting.postingId,
                    postingTitle: newPosting.postingTitle,
                    postingContent: newPosting.postingContent,
                });
                res.writeHead(200, { 'text-Type': 'application/json' });
                res.end(JSON.stringify({ "message": "postCreated" }));
            });
        }
    }

    if (method === 'PATCH') {
        //게시글 수정 end-point
        if (pathUrl === '/posts' && searchId) {
            let updateData = '';
            req.on('data', (data) => {
                updateData += data
            });
            req.on('end', () => {
                const inputValue = JSON.parse(updateData);// 수정 요청한 정보 받아오기
                const originValue = posts.filter(post => post.postingId === Number(searchId)); // 수정할 게시물 찾아오기
                for (const key in inputValue) { // 해당 게시물 데이터 수정 작업 수행
                    originValue[0][key] = inputValue[key];
                }
                res.writeHead(200, { "cotent-Type": "application/json" });
                res.end(JSON.stringify({"data" : originValue[0]}));
            });
        }
    }

    if (method === 'DELETE') {
        //게시물 삭제 end-point
        if (pathUrl === '/posts' && searchId) {
            const targetObj = posts.filter(post=>post.postingId === Number(searchId));//삭제할 게시물 찾기
            const targetObjIndex = posts.indexOf(targetObj[0]);//삭제할 게시물의 index 찾기
            posts.splice(targetObjIndex,1); //게시물 삭제 수행
            res.writeHead(200, { "cotent-Type": "application/json" });
            res.end(JSON.stringify({"message" : "postingDeleted"}));
        }
    }
}

server.on('request', httpRequestListener);

server.listen(8000, '127.0.0.1', () => console.log('server is working~~~~'));