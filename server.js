const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.ts': 'text/plain', // Servi comme texte pour Babel
  '.tsx': 'text/plain', // Servi comme texte pour Babel
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Gestion intelligente des extensions pour les imports (ex: import App from './App')
  // Le serveur cherche App, puis App.tsx, puis App.ts
  if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
      const extensions = ['.tsx', '.ts', '.js', '.html'];
      for (const ext of extensions) {
          if (fs.existsSync(filePath + ext)) {
              filePath = filePath + ext;
              break;
          }
      }
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT'){
        // En cas d'erreur 404, on renvoie index.html (pour le routing SPA)
        fs.readFile('./index.html', (err, htmlContent) => {
            if (err) {
                res.writeHead(500);
                res.end('Erreur fatale: index.html introuvable.');
            } else {
                // Injection de la clé API
                const html = htmlContent.toString().replace(
                    '<!--__ENV_INJECTION__-->', 
                    `<script>window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };</script>`
                );
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html, 'utf-8');
            }
        });
      } else {
        res.writeHead(500);
        res.end('Erreur serveur: '+error.code);
      }
    } else {
      // Si c'est index.html, on injecte aussi la clé API
      if (filePath === './index.html') {
          const html = content.toString().replace(
              '<!--__ENV_INJECTION__-->', 
              `<script>window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };</script>`
          );
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(html, 'utf-8');
      } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Le Nexus écoute sur le port ${port}`);
});