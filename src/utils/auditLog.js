const log4js = require("log4js");
const path = require("path");

log4js.configure({
  appenders: {
    file: {
      type: "dateFile",
      filename: path.join(__dirname + "../../../logs/app.log"),
      pattern: "yyyy-MM-dd-hh",
      keepFileExt: true,
      numBackups: 24,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["file"], level: "info" },
    HTTP: { appenders: ["file"], level: "info" },
  },
});

exports.getLogger = function (category) {
  return log4js.getLogger(category);
};
