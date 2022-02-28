const express = require("express");
//const path = require("path");
const app = express();
//const fetch = require("node-fetch");
var request = require("request");

app.get("/user-profile/:id", (req, res) => {
  const host = req.headers["host"];
  const slug = host.split(".")[0];
  const URL = `https://${slug}.driff.network/user-profile/${req.params.id}`;
  //const URL = `https://${slug}.driff.online/user-profile/${req.params.id}`;

  request.get(URL, { encoding: "binary" }, function (error, response) {
    var contentType = response.headers["content-type"];
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-cache" });
    res.end(response.body, "binary");
  });
});

app.listen(9001, function () {
  //console.log("Server listening on port 9000");
});
