const express = require("express");
const session = require("express-session");
const path = require("path");
const log4js = require("log4js");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

require("dotenv-safe").config();

const authenticationService = require("./services/authenticationService.js");
const candidateService = require("./services/candidateService.js");
const voteService = require("./services/voteService.js");
const auditLog = require("./utils/auditLog.js");
const globals = require("./utils/globals.js");
const dbInit = require("./db/dbInit.js");

const server = express();
const port = process.env.PORT || 12000;

startServer();

async function startServer() {
  await initializeDatabase();
  configureServer();
  serveStaticFiles();
  serverMiddleware();
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
async function initializeDatabase() {
  await dbInit.initDb();
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
  configureRateLimit();
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

function configureRateLimit() {
  server.use(
    rateLimit({
      windowMs: 20 * 60 * 1000,
      max: 150,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      keyGenerator: (req) => req.ip,
      handler: (req, res) => {
        res
          .status(429)
          .sendFile(path.join(__dirname, "../public/html/rateLimit.html"));
      },
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

  server.get(
    "/send-two-factor-auth-code",
    authenticationService.sendTwoFactorAuthCode
  );
  server.post(
    "/check-two-factor-auth-code",
    authenticationService.checkTwoFactorAuthCode
  );

  server.get("/candidates", candidateService.getCandidates);
  server.get("/voted", voteService.getVotedStatus);
  server.post("/vote", voteService.postVote);

  server.get("/rsa-public-key", voteService.getRSAPublicKey);
  server.get("/end-vote", voteService.endVote);
}

function serveHtml() {
  server.get("/", (req, res) => {
    if (globals.getVoteEnded()) {
      res.redirect("/results");
      return;
    }
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
  });
  server.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/login.html"));
  });
  server.get("/two-factor-auth", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/twoFactorAuth.html"));
  });
  server.get("/results", (req, res) => {
    if (!globals.getVoteEnded()) {
      res.redirect("/");
      return;
    }
    res.sendFile(path.join(__dirname, "../public/html/results.html"));
  });
}

function isAuthenticated(req, res, next) {
  if (!req.session?.username) {
    if (req.path === "/login") {
      return next();
    }
    if (req.method === "POST") {
      return res.status(401).send({ error: "Unauthorized: Session expired" });
    }
    return res.redirect("/login");
  }
  if (!req.session.verified) {
    if (
      req.path === "/two-factor-auth" ||
      req.path === "/send-two-factor-auth-code" ||
      req.path === "/check-two-factor-auth-code"
    ) {
      return next();
    }
    return res.redirect("/two-factor-auth");
  }
  next();
}
