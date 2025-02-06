const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5500;

const serveStaticFile = (res, filePath, contentType, responseCode = 200) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('Błąd: Plik nie został znaleziony.');
      res.end();
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType });
      res.write(data);
      res.end();
    }
  });
};

const handleRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
  } else if (pathname === '/style.css') {
    serveStaticFile(res, path.join(__dirname, 'public', 'style.css'), 'text/css');
  } else if (pathname === '/script.js') {
    serveStaticFile(res, path.join(__dirname, 'public', 'script.js'), 'text/javascript');
  } else if (pathname === '/comments.json' && req.method === 'GET') {
  
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Błąd serwera podczas pobierania komentarzy.');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
      }
    });
  } else if (pathname === '/comments.json' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
  
    req.on('end', () => {
      try {
        const newComment = JSON.parse(body);
        
        fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write('Błąd serwera podczas zapisywania komentarza.');
            res.end();
          } else {
            const comments = JSON.parse(data);
            comments.push(newComment);
  
            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments, null, 2), (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Błąd zapisywania komentarza.');
                res.end();
              } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newComment));
              }
            });
          }
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write('Błąd: Złe dane w zapytaniu POST.');
        res.end();
      }
    });
  } else {
    // Obsługa nieznanych zapytań (404)
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Błąd: Strona nie została znaleziona.');
    res.end();
  }
};

// Tworzenie serwera
const server = http.createServer(handleRequest);

// Uruchomienie serwera na porcie 3000
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
