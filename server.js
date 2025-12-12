// Charge les variables d'environnement depuis le fichier .env si présent (pour le local)
try {
  require('dotenv').config();
} catch (e) {
  // En production (Cloud Run), dotenv n'est pas toujours nécessaire si les vars sont injectées par la plateforme
  console.log("Note: dotenv non chargé ou absent (normal en prod si les vars sont définies)");
}

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

// Récupération sécurisée de la clé API (supporte les deux noms courants)
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';

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
                    `<script>window.process = { env: { API_KEY: "${apiKey}" } };</script>`
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
      // Si c'est index.html, on injecte la clé API
      if (filePath === './index.html') {
          const html = content.toString().replace(
              '<!--__ENV_INJECTION__-->', 
              `<script>window.process = { env: { API_KEY: "${apiKey}" } };</script>`
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
  if (!apiKey) {
      console.warn("ATTENTION: Aucune API_KEY n'a été trouvée dans les variables d'environnement.");
  } else {
      console.log("API_KEY détectée et prête à l'injection.");
  }
});