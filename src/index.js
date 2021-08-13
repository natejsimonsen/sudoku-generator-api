const express = require("express");
const init = require("./sudoku");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.get("/", (req, res) => res.send(JSON.stringify(init())));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
