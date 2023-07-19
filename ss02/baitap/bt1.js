const http = require("http");
const fs = require("fs");
const url = require("url");
const queryString = require("querystring");
const port = 3002;

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const overviewPage = fs.readFileSync("./baitap/overview.html", "utf-8");
  const productPage = fs.readFileSync("./baitap/product.html", "utf-8");
  const cardTemplate = fs.readFileSync("./baitap/card-temple.html", "utf-8");
  const dataFruits = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  const searchBox = fs.readFileSync("./baitap/search.html", "utf-8");
  const createBox = fs.readFileSync("./baitap/create.html", "utf-8");
  const updateBox = fs.readFileSync("./baitap/update.html", "utf-8");

  //home page
  if (pathname === "/") {
    res.writeHead(200, "Content-Type", "text/html", "charset=utf-8");

    const cardItem = dataFruits.map((fruit) =>
      cardTemplate
        .replace("{{img}}", fruit.image)
        .replace("{{productName}}", fruit.productName)
        .replace("{{quantity}}", fruit.quantity)
        .replace("{{price}}", fruit.price)
        .replace("{{productId}}", fruit.id)
    );

    res.write(
      overviewPage.replace(
        `<div class="cards-container"></div>`,
        `<div class="cards-container">${cardItem}</div>`
      )
    );
    //search page
  } else if (pathname === `/search`) {
    res.writeHead(200, "Content-Type", "text/html", "charset=utf-8");

    let searchFruits = dataFruits.filter((fruit) =>
      fruit.productName.includes(query.q)
    );

    const cardItem = searchFruits.map((fruit) =>
      cardTemplate
        .replace("{{img}}", fruit.image)
        .replace("{{productName}}", fruit.productName)
        .replace("{{quantity}}", fruit.quantity)
        .replace("{{price}}", fruit.price)
        .replace("{{productId}}", fruit.id)
    );
    res.write(
      overviewPage
        .replace(
          `<figure class="card"></figure>`,
          `<figure class="card">${searchBox}</figure>`
        )
        .replace(
          `<div class="cards-container"></div>`,
          `<div class="cards-container">${cardItem}</div>`
        )
    );
  } else if (pathname.includes("product")) {
    res.writeHead(200, "Content-Type", "text/html", "charset=utf-8");

    const id = pathname.split("/")[2];
    let searchFruits = dataFruits.find((fruit) => fruit.id == id);
    const fruitDetail = productPage
      .replace(/{{image}}/g, searchFruits.image)
      .replace("{{productName}}", searchFruits.productName)
      .replace("{{quantity}}", searchFruits.quantity)
      .replace(/{{price}}/g, searchFruits.price)
      .replace("{{from}}", searchFruits.from)
      .replace("{{nutrients}}", searchFruits.nutrients)
      .replace("{{organic}}", searchFruits.organic ? "organic" : "")
      .replace("{{description}}", searchFruits.description)
      .replace(/{{id}}/g, searchFruits.id);
    res.write(fruitDetail);
  } else if (pathname.startsWith("/delete")) {
    const idDelete = pathname.split("/")[2];
    const newFruits = dataFruits.filter((fruit) => fruit.id != idDelete);
    fs.writeFileSync("./data.json", JSON.stringify(newFruits), "utf-8");
    res.writeHead(302, { location: "/" });
    res.end();
  } else if (pathname === "/create") {
    const productTemplate = overviewPage + createBox;
    if (req.method === "POST") {
      let data = "";
      req
        .on("error", (err) => {
          console.log(err);
        })
        .on("data", (chunk) => {
          data += chunk.toString();
        })
        .on("end", () => {
          const inputForm = queryString.parse(data);
          let form = {
            id: dataFruits[dataFruits.length - 1].id + 1,
            productName: "",
            image: "",
            from: "",
            nutrients: "",
            quantity: "",
            price: "",
            description: "",
            organic: inputForm.organic == "on" ? true : false,
          };

          const newFruit = { ...form, ...inputForm };
          console.log(newFruit);
          dataFruits.push(newFruit);
          fs.writeFileSync("./data.json", JSON.stringify(dataFruits));
        });
      res.writeHead(302, { location: "/" });
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(productTemplate);
    }
  } else if (pathname.startsWith("/update")) {
    let updateHtml = overviewPage + updateBox;
    const updateId = pathname.split("/")[2];
    let updateFruit = dataFruits.find((fruit) => fruit.id === +updateId);
    updateHtml = updateHtml
      .replace(/{{image}}/g, updateFruit.image)
      .replace("{{productName}}", updateFruit.productName)
      .replace("{{quantity}}", updateFruit.quantity)
      .replace(/{{price}}/g, updateFruit.price)
      .replace("{{from}}", updateFruit.from)
      .replace("{{nutrients}}", updateFruit.nutrients)
      .replace("{{organic}}", updateFruit.organic)
      .replace("{{description}}", updateFruit.description);
    if (req.method === "POST") {
      let data = "";
      req
        .on("error", (err) => {
          console.log(err);
        })
        .on("data", (chunk) => {
          data += chunk.toString();
        })
        .on("end", () => {
          const updateForm = queryString.parse(data);
          const newUpdate = {
            ...updateFruit,
            ...updateForm,
            organic: updateForm.organic ? true : false,
          };
          const newDataFruits = dataFruits.map((fruit) =>
            fruit.id === newUpdate.id ? newUpdate : fruit
          );
          fs.writeFileSync("./data.json", JSON.stringify(newDataFruits));
        });
      res.writeHead(302, { location: "/" });
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(updateHtml);
    }
  } else {
    res.writeHead(400, "Content-Type", "text/html", "charset=utf-8");
    res.write("Page not found");
  }

  res.end();
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
