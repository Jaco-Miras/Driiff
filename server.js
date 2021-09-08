const express = require("express");
const path = require("path");
const app = express();
const http = require("http");

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const baseUrl = "demo24.drevv.com";

app.get("/user-profile/:id", (req, res) => {
  console.log(req.params);
  var connector = http.request(
    {
      host: baseUrl,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (resp) => {
      console.log(resp);
      resp.pipe(res);
    }
  );

  req.pipe(connector);
});

app.listen(9000, function () {
  //console.log("Server listening on port 9000");
});
