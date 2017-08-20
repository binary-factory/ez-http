import { MiddlewareAction } from './core/middleware';
import { EzRequest } from './core/request';
import { EzResponse } from './core/response';
import { EzRouter } from './router/router';
import { EzServer } from './server';

const router1 = new EzRouter('/api');
const router2 = new EzRouter('/nested');
const server = new EzServer();



router1.use(() => {
    console.log('before any route matched from router1');
});

router1.get('/users/:id', [
    () => {
        console.log('before route handler');
    },
    (request: EzRequest, response: EzResponse) => {
        console.log(request.params);
        response.writeHead(200);
        response.end('resource1: ' + request.params.id);
        return MiddlewareAction.SkipHolder;
    },
    () => {
        console.log('after route handler');
    }
]);
server.use(router1);






router2.use(() => {
    console.log('before any route matched from nested router2');
});

router2.add('/test', '*',
    () => {
        console.log('before route handler2');
        return MiddlewareAction.SkipAll;
    },
    (request: EzRequest, response: EzResponse) => {
        console.log(request.params);
        response.writeHead(200);
        response.end('si senior22');
    },
    () => {
        console.log('after route handler2');
    },
);
router1.use(router2);


server.use(() => {
    console.log('last middleware in server');
})

server.listen(8080);