const express = require("express");
const session = require("express-session");
const path = require("path");
const log4js = require("log4js");
const crypto = require("crypto");

require("dotenv-safe").config();

const authenticationService = require("./services/authenticationService.js");
const candidateService = require("./services/candidateService.js");
const crypto = require("crypto");
const voteService = require("./services/voteService.js");
const auditLog = require("./utils/auditLog.js");

const server = express();
const port = process.env.PORT || 12000;

startServer();

function startServer() {
  configureServer();
  serveStaticFiles();
  /*
  serverMiddleware();
  */
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
  server.use(
    log4js.connectLogger(auditLog.getLogger("HTTP"), {
      level: "info",
      format: ":remote-addr :user-agent :method :url :status :response-time ms",
    })
  );
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

function serverMiddleware() {
  server.use((req, res, next) => {
    isAuthenticated(req, res, next);
  });
}

function serveServices() {
  server.post("/login", authenticationService.login);
  server.get("/logout", authenticationService.logout);
  
  server.get("/send-two-factor-auth-code", authenticationService.sendTwoFactorAuthCode);
  server.post("/check-two-factor-auth-code", authenticationService.checkTwoFactorAuthCode);
  
  server.get("/candidates", candidateService.getCandidates);
  server.post("/vote", voteService.postVote);
}

function serveHtml() {
  server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
  });
  server.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
  });
  server.get("/two-factor-auth", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/twoFactorAuth.html"));
  });
  server.get("/results", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/results.html"));
  });
}

function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  if (req.path === '/login') {
    return next();
  }
  return res.redirect('/login');
}