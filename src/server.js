const express = require("express");
const session = require("express-session");
const path = require("path");
const authenticationService = require("./services/authenticationService.js");
const candidateService = require("./services/candidateService.js");

const crypto = require("crypto");

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
  configureSession();
}

function configureSession() {
  let sessionSecret = crypto.randomBytes(32).toString("base64");
  server.use(
    session({
      secret: sessionSecret,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60,
      },
      resave: false,
    })
  );
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
  server.get("/logout", authenticationService.logout);

  server.get("/candidates", candidateService.getCandidates);
}

function serveHtml() {
  server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
  });
  server.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
  });
  server.get("/results", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/results.html"));
  });
}
