const express = require("express");
const path = require("path");
const authenticationService = require("./services/authenticationService.js");

const server = express();
const port = 12000;

startServer();

function startServer() {
  configureServer();
  serveStaticFiles();
  serveHtml();
  serveServices();

  server.use((req, res) => {
    res.status(404);
    res.json({ message: "wrong url" });
  });

  server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
  });
}

function configureServer() {
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
}

function serveStaticFiles() {
  server.use("/css", express.static(path.join(__dirname, "../public/css")));
  server.use("/js", express.static(path.join(__dirname, "../public/js")));
  server.use(
    "/images",
    express.static(path.join(__dirname, "../public/images"))
  );
}

function serveServices() {
  server.post("/login", authenticationService.login);
}

function serveHtml() {
  server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
  });
}
