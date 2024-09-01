import { Service } from "node-windows";

var svc = new Service({
    name: 'emailExactorBackend',
    description: 'This is email exactor service.',
    script: 'D:\\EmailExactorSoftware\\Backend\\server.js',
});

svc.on('install', function () {
    svc.start();
});

svc.install();