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

server.listen(8080);