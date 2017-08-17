import { EzServer } from './server';
import { EzRouter } from './router/router';
import { EzRequest } from './core/request';
import { EzResponse } from './core/response';

const router = new EzRouter();
const server = new EzServer();
server.use(router);

router.use(() => {
    console.log('before any route matched from router');
});

router.use(() => {
    console.log('break in router');
    return true;
});
router.get('/test/:id', [
    () => {
        console.log('before route handler');
    },
    (request: EzRequest, response: EzResponse) => {
        console.log(request.params);
        response.writeHead(200);
        response.end('si senior');
    },
    () => {
        console.log('after route handler');
    },
]);

router.add('/test/:id', '*', [
    () => {
        console.log('before route handler2');
    },
    (request: EzRequest, response: EzResponse) => {
        console.log(request.params);
        response.writeHead(200);
        response.end('si senior22');
    },
    () => {
        console.log('after route handler2');
    },
]);

server.use(()=>{
    console.log('last middleware in server');
})

server.listen(8080);