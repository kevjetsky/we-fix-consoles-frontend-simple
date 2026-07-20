const { createServer } = require('node:http');
const { createReadStream, existsSync, statSync } = require('node:fs');
const { extname, join, normalize } = require('node:path');

const port = Number(process.env.PORT || 8080);
const host = process.env.HOSTNAME || '0.0.0.0';
const outDir = join(__dirname, 'out');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function resolvePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalizedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const candidates = [
    join(outDir, normalizedPath),
    join(outDir, normalizedPath, 'index.html'),
    join(outDir, `${normalizedPath}.html`),
  ];

  return candidates.find((candidate) => {
    return candidate.startsWith(outDir) && existsSync(candidate) && statSync(candidate).isFile();
  });
}

createServer((request, response) => {
  const filePath = resolvePath(request.url || '/');

  if (!filePath) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': contentTypes[extname(filePath)] || 'application/octet-stream',
    'cache-control': filePath.includes('/_next/static/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
  });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Serving static export on http://${host}:${port}`);
});
