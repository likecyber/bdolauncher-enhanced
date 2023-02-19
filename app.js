const appName = 'BDOLauncher Enhanced';
const hostName = 'localhost';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { X509Certificate } = require('crypto');

const mockttp = require('mockttp');

const appDataPath = path.resolve(process.env.APPDATA, appName);
const certPath = path.resolve(appDataPath, 'cert.pem');
const keyPath = path.resolve(appDataPath, 'key.pem');
const pidPath = path.resolve(appDataPath, 'process.pid');
const startupPath = path.resolve(__dirname, 'startup.vbs');

const command = process.argv[2]?.toLowerCase();
if (command !== undefined && ['install', 'uninstall', 'kill'].includes(command)) {
    if (command === 'install') {
        fs.writeFileSync(startupPath, 'CreateObject("Wscript.Shell").Run """" & Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\\") - 1) & "\\Run.cmd""", 0, False');
        execFileSync('reg', ['add', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName, '/t', 'REG_SZ', '/d', 'wscript.exe "' + startupPath + '"', '/f']);
    } else if (command === 'uninstall') {
        try {
            process.kill(Number(fs.readFileSync(pidPath).toString()));
            fs.unlinkSync(pidPath);
        } catch (e) {
        }
        try {
            fs.unlinkSync(startupPath);
        } catch (e) {
        }
        try {
            execFileSync('reg', ['delete', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName, '/f'], { stdio: 'ignore' });
        } catch (e) {
        }
    } else if (command === 'kill') {
        try {
            process.kill(Number(fs.readFileSync(pidPath).toString()));
            fs.unlinkSync(pidPath);
        } catch (e) {
        }
    }
    process.exit();
}

const script = fs.readFileSync(path.resolve(__dirname, 'injectScript.js')).toString().replace('\r', '').split('\n');

(async () => {
    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath);
    }
    if (fs.existsSync(certPath)) {
        try {
            if (Math.floor((new Date((new X509Certificate(fs.readFileSync(certPath))).validTo).getTime() - new Date().getTime()) / 8.64e7) <= 30) {
                if (fs.existsSync(certPath)) {
                    fs.unlinkSync(certPath);
                }
                if (fs.existsSync(keyPath)) {
                    fs.unlinkSync(keyPath);
                }
            }
        } catch (e) {
            if (fs.existsSync(certPath)) {
                fs.unlinkSync(certPath);
            }
            if (fs.existsSync(keyPath)) {
                fs.unlinkSync(keyPath);
            }
        }
    }
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        if (fs.existsSync(certPath)) {
            fs.unlinkSync(certPath);
        }
        if (fs.existsSync(keyPath)) {
            fs.unlinkSync(keyPath);
        }
        const { cert, key } = await mockttp.generateCACertificate({
            commonName: appName,
            organizationName: appName
        });
        fs.writeFileSync(certPath, cert);
        fs.writeFileSync(keyPath, key);
    }

    execFileSync('certutil', ['-addstore', '-user', 'root', certPath]);

    const customBeforeRequest = (overrideUserAgent = false, hideCookie = false) => {
        return (request) => {
            if (overrideUserAgent) {
                if (request.headers['user-agent'] === 'BLACKDESERT-STEAM') {
                    request.headers['user-agent'] = 'BLACKDESERT';
                }
            }
            if (hideCookie) {
                if (request.headers['cookie'].includes('ENC_Cookie=')) {
                    request.headers['cookie'] = request.headers['cookie'].replace(/(?:^|; *)ENC_Cookie=([a-zA-Z0-9+/=]+)(?:;|$)/, ';').replace(/^[; ]+|[; ]+$/g, '');
                }
            }
            return request;
        }
    };

    const customBeforeResponse = (injectScript = false, removeCookie = false) => {
        return async (response) => {
            const rewrite = {};
            if (injectScript) {
                if (response.statusCode === 200) {
                    if (response.headers['content-type'] !== undefined && response.headers['content-type'].startsWith('text/html')) {
                        const body = await response.body.getText();
                        const matches = body.match(/( *)_abyss\.program\.ready\(\);/);
                        if (matches) {
                            if (rewrite.body === undefined) {
                                rewrite.body = body;
                            }
                            rewrite.body = rewrite.body.replace(matches[0], script.map((line) => (line.length > 0 ? matches[1] + line : '') + '\n').join('') + '\n' + matches[0]);
                        }
                    }
                }
            }
            if (removeCookie) {
                if (response.statusCode === 302) {
                    if (rewrite.headers === undefined) {
                        rewrite.headers = response.headers;
                    }
                    if (rewrite.headers['set-cookie'] === undefined) {
                        rewrite.headers['set-cookie'] = [];
                    }
                    rewrite.headers['set-cookie'].push('ID_Cookie=; domain=account.pearlabyss.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
                    rewrite.headers['set-cookie'].push('ENC_Cookie=; domain=account.pearlabyss.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
                }
            }
            return rewrite;
        }
    };

    const server = mockttp.getLocal({
        https: {
            certPath: certPath,
            keyPath: keyPath
        }
    });

    await server.forGet(/^https:\/\/launcher\.([a-z0-9\-]+?)\.playblackdesert\.com\/[a-z]{2}-[A-Z]{2}$/).always().thenPassThrough({
        beforeResponse: customBeforeResponse(true, false)
    });

    await server.forGet(/^https:\/\/launcher\.([a-z0-9\-]+?)\.playblackdesert\.com\/[a-z]{2}-[A-Z]{2}\/Main$/).always().thenPassThrough({
        beforeResponse: customBeforeResponse(true, false)
    });

    await server.forGet(/^https:\/\/account\.pearlabyss\.com\/[a-z]{2}-[A-Z]{2}\/Launcher\/Login$/).always().thenPassThrough({
        beforeRequest: customBeforeRequest(true, true),
        beforeResponse: customBeforeResponse(true, false)
    });

    await server.forGet(/^https:\/\/account\.pearlabyss\.com\/[a-z]{2}-[A-Z]{2}\/Member\/Logout$/).always().thenPassThrough({
        beforeRequest: customBeforeRequest(true, true),
        beforeResponse: customBeforeResponse(false, true)
    });

    await server.forAnyRequest().forHost('account.pearlabyss.com').always().thenPassThrough({
        beforeRequest: customBeforeRequest(true, true)
    });

    await server.forUnmatchedRequest().thenPassThrough();

    await server.start({
        startPort: 9994,
        endPort: 65535
    });

    fs.writeFileSync(pidPath, process.pid.toString());
    ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((event) => {
        process.on(event, () => {
            try {
                fs.unlinkSync(pidPath);
            } catch (e) {
            }
        });
    });

    await server.forGet('http://' + hostName + ':' + server.port).always().thenReply(200, appName + ' Server is running.', {
        'Content-Type': 'text/plain'
    });
    await server.forGet('http://' + hostName + ':' + server.port + '/autoproxy.pac').always().thenReply(200, fs.readFileSync(path.resolve(__dirname, 'autoproxy.pac')).toString().replaceAll('{PROXY}', hostName + ':' + server.port), {
        'Content-Type': 'application/x-ns-proxy-autoconfig'
    });
    await server.forAnyRequest().forHost(hostName + ':' + server.port).always().thenReply(404, 'The requested resource is not found.', {
        'Content-Type': 'text/plain'
    });

    console.log(appName + ' Server is running.');
    console.log('http://' + hostName + ':' + server.port);

    execFileSync('reg', ['add', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings', '/v', 'AutoConfigURL', '/t', 'REG_SZ', '/d', 'http://' + hostName + ':' + server.port + '/autoproxy.pac', '/f']);
    ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((event) => {
        process.on(event, () => {
            try {
                execFileSync('reg', ['delete', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings', '/v', 'AutoConfigURL', '/f'], { stdio: 'ignore' });
            } catch (e) {
            }
        });
    });
})();