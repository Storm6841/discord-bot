const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.token);
setInterval(() => {
  http.get(`https://${process.package.url}.glitch.me/`);
}, 280000);
