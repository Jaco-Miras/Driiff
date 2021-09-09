const express = require("express");
const path = require("path");
const app = express();
//const fetch = require("node-fetch");
var request = require("request");

app.use(express.static(path.join(__dirname, "build")));

app.get("/user-profile/:id", (req, res) => {
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

  const URL = `https://demo24.driff.network/user-profile/${req.params.id}`;
  request.get(URL, { encoding: "binary" }, function (error, response) {
    var contentType = response.headers["content-type"];
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-cache" });
    res.end(response.body, "binary");
  });
  // fetch("https://demo24.driff.network/user-profile/3")
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     res.send({ data });
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(9000, function () {
  //console.log("Server listening on port 9000");
});
