const express = require("express");
//const path = require("path");
const app = express();
//const fetch = require("node-fetch");
var request = require("request");

app.get("/user-profile/:id", (req, res) => {
  const URL = `https://demo24.driff.network/user-profile/${req.params.id}`;
  request.get(URL, { encoding: "binary" }, function (error, response) {
    var contentType = response.headers["content-type"];
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-cache" });
    res.end(response.body, "binary");
  });
  // request.get("https://demo24.driff.network/user-profile/3", function (error, res, body) {
  //   if (!error && res.statusCode == 200) {
  //     response.setHeader("Content-Type", "image");
  //     response.writeHead(200);
  //     response.write(body);
  //     response.end();
  //   } else {
  //     response.send(error);
  //   }
  // });
  // fetch("https://demo24.driff.network/user-profile/3")
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     res.send({ data });
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

app.listen(9001, function () {
  //console.log("Server listening on port 9000");
});
