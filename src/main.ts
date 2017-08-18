import { EzRequest } from './core/request';
import { EzResponse } from './core/response';
import { EzServer } from './server';
import { EzRouter } from './router/router';
import { MiddlewareAction } from './core/middleware';

const router1 = new EzRouter('test');
const router2 = new EzRouter('test2');
const server = new EzServer();
server.use(router1);

router1.use(router2);

router2.use(() => {
    console.log('before any route matched from router');
});

router1.use(() => {
    console.log('router middleware');
});
router1.get('/test/:id', [
    () => {
        console.log('before route handler');
    },
    (request: EzRequest, response: EzResponse) => {
        console.log(request.params);
        response.writeHead(200);
        response.end('si senior');
        return MiddlewareAction.SkipHolder;
    },
    () => {
        console.log('after route handler');
    }
]);

router1.add('/test/:id', '*',
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

server.use(() => {
    console.log('last middleware in server');
})

server.listen(8080);