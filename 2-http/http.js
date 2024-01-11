'use strict';

import fs from "node:fs";
import http from "node:http";
const port = 8000;
const petRegExp = /^\/pets\/(.*)$/;

const server = http.createServer(function(req, res) {

  const method = req.method;
  const url = req.url;

  console.log(`${method} request to ${url}`);

  if (method === "GET" && url === "/pets") {
    console.log('getting all the pets');
    fs.readFile("../petsCopy.json", "utf-8", (err, text) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end();
        return;
      }
      //const allPets = JSON.parse(fileData);
      res.setHeader('Content-Type', 'application/json');
      res.end(text);
    });

  } else if (method === "GET" && url.match(petRegExp)) {
      const index = Number(url.match(petRegExp)[1]);

      fs.readFile("../petsCopy.json", "utf-8", (err, text) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end();
          return;
        }
        const pets = JSON.parse(text);
        console.log(`getting pet at index: ${index}`);

        if (!Number.parseInt(index) || index < 0 || index >= pets.length) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not found');
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(pets[index]));
      });
  }
  
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
});

server.listen(port, function() {
  console.log('Listening on port', port);
});