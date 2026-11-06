const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist/pokemon-game-angular/browser');
const port = Number(process.env.PORT || 4202);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405);
    res.end();
    return;
  }
  try {
    const url = new URL(req.url, 'http://localhost'),
      relative = decodeURIComponent(url.pathname).replace(/^\/+/, ''),
      file = path.resolve(root, relative || 'index.html');
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let target = file;
    try {
      if (!(await fs.stat(target)).isFile()) target = path.join(root, 'index.html');
    } catch {
      if (path.extname(relative)) {
        res.writeHead(404);
        res.end('Fichier introuvable');
        return;
      }
      target = path.join(root, 'index.html');
    }
    const body = await fs.readFile(target);
    res.writeHead(200, {
      'Content-Type': mime[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('La version compilée est absente. Exécute npm ci puis npm run build.');
  }
});
server.listen(port, '127.0.0.1', () => console.log('Base Angular : http://localhost:' + port));
