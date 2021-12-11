const express = require("express");
const init = require("./sudoku");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.get("/", (req, res) => res.json(init(req.query.difficulty)));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
