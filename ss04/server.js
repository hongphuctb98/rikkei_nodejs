const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
let dataUsers = {
  users: [
    {
      name: "Minion",
      address: "Ha Noi",
      phone: "123546789",
    },
    {
      name: "Chihuahua",
      address: "Ha Noi",
      phone: "123546789",
    },
  ],
};

app.get("/send", (req, res) => {
  res.send("  <h1>🥦 Rikkei Farm 🌽</h1> <p>☣️☣️☣️☣️☣️☣️</p>");
});

app.get("/send-json/:id/:type", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send(users);
});

app.get("/", (req, res) => {
  res.send("home page");
});
app.get("/products", (req, res) => {
  let dataUsers = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  console.log(dataUsers);
  res.send(dataUsers);
});
app.get("/products/:id", (req, res) => {
  res.send(`products ${req.params.id} page`);
});
app.post("/product", (req, res) => {
  res.send({
    message: "sucess",
    body: req.body,
  });
  const data = req.body;
  let dataUsers = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  dataUsers.users.push(data);
  console.log(dataUsers);
  fs.writeFileSync("./data.json", JSON.stringify(dataUsers), "utf-8");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
