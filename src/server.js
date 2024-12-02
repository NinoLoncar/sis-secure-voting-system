express = require("express");

const server = express();
const port = 12000;

startServer();

function startServer() {
  server.use((req, res) => {
    res.status(404);
    res.json({ message: "wrong url" });
  });

  server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
  });
}
