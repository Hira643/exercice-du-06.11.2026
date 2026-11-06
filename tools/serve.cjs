const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

const server = http.createServer(async (request, response) => {
    const send = (code, body) => {
        response.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end(request.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
        response.setHeader('Allow', 'GET, HEAD');
        return send(405, 'Méthode non autorisée');
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { return send(400, 'Adresse invalide'); }
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some(segment => segment.startsWith('.') || segment.includes('\\') || segment.includes(':') || segment.includes('\0'))) {
        return send(404, 'Page introuvable');
    }
    if (pathname.endsWith('/')) pathname += 'index.html';
    const publicPage = ['/index.html', '/balises.html'].includes(pathname)
        || pathname.startsWith('/workspace/bases/') || pathname.startsWith('/projets/clement/');
    const type = types[path.extname(pathname)];
    if (!publicPage || !type) return send(404, 'Page introuvable');
    const filename = path.resolve(root, '.' + pathname);
    if (!filename.startsWith(root + path.sep)) return send(404, 'Page introuvable');
    try {
        const content = await fs.readFile(filename);
        response.writeHead(200, { 'Content-Type': type, 'Content-Length': content.length, 'X-Content-Type-Options': 'nosniff' });
        response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
        send(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500, 'Page indisponible');
    }
});
server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `Le port ${port} est déjà occupé. Choisissez un autre port avec la variable PORT.` : error.message);
    process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Exercices disponibles sur http://localhost:${port}`));
